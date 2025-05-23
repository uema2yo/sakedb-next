"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/init";
import { sendSignInLinkToEmail, signOut } from "firebase/auth";
import { DOMAIN, LOCAL_DOMAIN } from "@/constants";
import { validateForms } from "@/lib/code/validateForms"; 
import { Button } from "../ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface LogoutProps {
  closeDialog: () => void;
}

const EmailForSignup: React.FC<LogoutProps> = ({ closeDialog }) => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailDisabled, setEmailDisabled] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const handleChangeEmail = async(value: string) => {
    setEmail(value);
    const validate = await validateForms("email", value, false)
    if (validate.result) {
      setEmailDisabled(false);
      setErrorMessage("");
    } else {
      setEmailDisabled(true);
      setErrorMessage(validate.message || "");
    }
  }

  const handleSendEmail = async () => {
    const signupUrl =
      process.env.NEXT_PUBLIC_LOCAL === "TRUE"
        ? `http://${LOCAL_DOMAIN}/signup`
        : `https://${DOMAIN}`;
    const actionCodeSettings = {
      url: signupUrl,
      handleCodeInApp: true,
    };
    const valid = await validateForms("email", email, false)
    
    try {
      valid.result && await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignup", email); // localStorage に保存するのは不安なので Firestore で持つように変更する
      setSubmitted(true);
    } catch (error) {
      console.error(error);
    }
  };

  const router = useRouter();

  const logout = async () => {
    try {
      await signOut(auth);
      closeDialog();
      router.replace("/");
    } catch (error) {
      console.error("ログアウトに失敗しました。", error);
    }
  };

  if (submitted) {
    return (
      <div>
        <p>{email} に認証メールを送信しました。</p>
        <p>メール本文に記載してある認証リンクにアクセスするとユーザー登録画面が開きます。</p>
      </div>
    ); 
  } else {
    return (
      <Dialog>
        <DialogTrigger>
          <Button variant="outline">ユーザー登録</Button>
        </DialogTrigger>
        <DialogContent className="md:max-w-(--standard-dialog-max-width)">
          <DialogHeader>
            <DialogTitle>ユーザー登録</DialogTitle>
            <DialogDescription>受信可能な E メールアドレスをご登録ください。</DialogDescription>
          </DialogHeader>
          <div className="text-center">
        <input
          type="email"
          value={email ?? ""}
          onChange={e => handleChangeEmail(e.target.value)}
        />
        <Button variant="outline" onClick={handleSendEmail} disabled={emailDisabled}>E メールアドレスを登録する</Button>
        {errorMessage !=="" && <p className="errorMessage">{errorMessage}</p>}

          </div>
        </DialogContent>
      </Dialog>
    );
  }
};

export default EmailForSignup;
