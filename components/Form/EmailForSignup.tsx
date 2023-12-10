"use client";

import React, { useState } from "react";
import Router from 'next/router'
import { auth } from "@lib/firebase/init";
import { sendSignInLinkToEmail } from "firebase/auth";
import { DOMAIN, LOCAL_DOMAIN } from "@constants";

const EmailForSignup = () => {
  const [email, setEmail] = useState("");
  let submitted: boolean = false;

  const handleSendEmail = async () => {
    const signupUrl =
      process.env.NEXT_PUBLIC_LOCAL === "TRUE"
        ? `http://${LOCAL_DOMAIN}/signup`
        : `https://${DOMAIN}`;
    const actionCodeSettings = {
      url: signupUrl,
      handleCodeInApp: true,
    };
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignup", email); // localStorage に保存するのは不安なので Firestore で持つように変更する
      submitted = true;
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleSendEmail}>E メールアドレスを登録する</button>
      </div>
    );
  }
};

export default EmailForSignup;
