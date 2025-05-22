"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "@/lib/firebase/init";
import { addDocument } from "@/lib/firebase/addDocument";
import { User, createUserWithEmailAndPassword } from "firebase/auth";
import { validateForms } from "@/lib/code/validateForms";
import SignupDialogButton from "@/components/SignupDialogButton";
import { createUser } from "@/lib/firebase/createUser";
import { useLoginContext } from "@/contexts/LoginContext";
import Loading from "@/components/Loading";

const Page = () => {
  const { loginLoading } = useLoginContext();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validateUserId, setValidateUserId] = useState<{result: boolean; message?: string | undefined} | undefined>();
  const [validatePassword, setValidatePassword] = useState<{result: boolean; message?: string | undefined} | undefined>();
  const [errorMessageConfirmPassword, setErrorMessageConfirmPassword] = useState("");
  const [validateEmailExists, setValidateEmailExists] = useState({result: true, message: ""});
  const [submitDisabled,setSubmitDisabled] = useState(true);

  const router = useRouter();
  
  if (loginLoading) return <Loading />;

  useEffect(() => {
    setEmail(window.localStorage.getItem("emailForSignup") || "");
  },[]);

  const addUserAccount = async (user: User) => {
    const currentPath = window.location.pathname;
    const timestamp = new Date().getTime();  
    await createUser(user);
    addDocument("b_user_id", {
      uid: user.uid,
      value: userId,
      public: true,
      timestamp: timestamp
    });
    addDocument("b_user_email", {
      uid: user.uid,
      value: email,
      public: false,
      timestamp: timestamp
    });
    addDocument("b_user_status", {
      uid: user.uid,
      value: "ACT",
      timestamp: timestamp
    });
  };
  
  const handleChangeUserId = async(event: React.ChangeEvent<HTMLInputElement>) => {
    const newUserId = event.target.value;
    setUserId(newUserId);
    const validate = await validateForms("id", newUserId, false);
    setValidateUserId(validate);
  }

  const handleChangePassword = async(event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    const validate = await validateForms("password", newPassword, false)
    setValidatePassword(validate);
  }

  const handleSignup = async () => {
    if (submitDisabled) return; 
    try {
      if (email) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await addUserAccount(userCredential.user);
        router.push("/mypage");
      } else {
        setValidateEmailExists({result: false, message: "E メールアドレスが指定されていません。お手数ですが、ユーザー登録を最初からやり直してください。"});
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (
      validateUserId?.result &&
      validatePassword?.result &&
      password === confirmPassword
    ) {
      setSubmitDisabled(false);
    } else {
      setSubmitDisabled(true);
    }
    if (password !== "" && password !== confirmPassword) {
      setErrorMessageConfirmPassword("確認用パスワードに同じパスワードをもう一度入力してください。");
    } else {
      setErrorMessageConfirmPassword("");
    }
  }, [userId, password, confirmPassword, validateUserId, validatePassword]);

  return (
      <main>
        <p>
          ユーザー ID とパスワードを設定してください。（※ ユーザー ID
          は、ウェブ上で一般公開されます。）
        </p>
        {validateEmailExists.result ?
        <div>
        <p>登録するEメールアドレス: {email}</p>
        <label>
          ユーザー ID:
          <input
            type="text"
            value={userId}
            autoComplete="username"
            onChange={e => handleChangeUserId(e)}
          />
        </label>
        <label>
          パスワード:
          <input
            type="password"
            value={password}
            autoComplete="new-password"
            onChange={e => handleChangePassword(e)}
          />
        </label>
        <label>
          確認用パスワード:
          <input
            type="password"
            value={confirmPassword}
            autoComplete="new-password"
            onChange={e => setConfirmPassword(e.target.value)}
          />
        </label>
        {validateUserId?.message && <p>{validateUserId.message}</p>}
        {validatePassword?.message && <p>{validatePassword.message}</p>}
        {errorMessageConfirmPassword !== "" && <p>{errorMessageConfirmPassword}</p>}

        <button onClick={handleSignup} disabled={submitDisabled}>アカウント作成</button>
        </div>
        :
        <>
        {validateEmailExists.message !== "" && <p>{validateEmailExists.message}</p>}
        <SignupDialogButton />
        </>}
        </main>
  );
};

export default Page;
