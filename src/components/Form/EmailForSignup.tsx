"use client";

import React, { useEffect, useState } from "react";
import Router from 'next/router'
import { auth } from "@/lib/firebase/init";
import { sendSignInLinkToEmail } from "firebase/auth";
import { DOMAIN, LOCAL_DOMAIN } from "@/constants";
import { validateForms } from "@/lib/code/validateForms"; 

const EmailForSignup = () => {
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

  if (submitted) {
    return (
      <div>
        <p>{email} に認証メールを送信しました。</p>
        <p>メール本文に記載してある認証リンクにアクセスするとユーザー登録画面が開きます。</p>
      </div>
    ); 
  } else {
    return (
      <div>
        <p>受信可能な E メールアドレスをご登録ください。</p>
        <input
          type="email"
          value={email ?? ""}
          onChange={e => handleChangeEmail(e.target.value)}
        />
        <button onClick={handleSendEmail} disabled={emailDisabled}>E メールアドレスを登録する</button>
        {errorMessage !=="" && <p className="errorMessage">{errorMessage}</p>}
      </div>
    );
  }
};

export default EmailForSignup;
