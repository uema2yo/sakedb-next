"use client";

import React, { useState } from "react";
import { auth } from "@lib/firebase/init";
import { sendSignInLinkToEmail } from "firebase/auth";

const EmailForSignup = () => {
  const [email, setEmail] = useState("");

  const handleSendEmail = async () => {
    const actionCodeSettings = {
      url: "http://localhost:3000/signup", // ユーザーがリダイレクトされるURL
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignup", email);
      // メール送信後の処理
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSendEmail}>Eメールを送信</button>
    </div>
  );
};

export default EmailForSignup;
