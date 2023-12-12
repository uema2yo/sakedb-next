"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { auth } from "@lib/firebase/init";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Layout from "@layout"

const Signup = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    setEmail(window.localStorage.getItem("emailForSignup") || "");
  });

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      alert("パスワードが一致しません。");
      return;
    }

    try {
      if (email) {
        await createUserWithEmailAndPassword(auth, email, password);
        // 登録成功後の処理
        router.push('/dashboard'); 
      } else {
        // Eメールアドレスが存在しない場合のエラー処理
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout logout={false}>
    <div>
      <p>登録するEメールアドレス: {email}</p> {/* Eメールアドレスを表示 */}
      <input
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="パスワード確認"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button onClick={handleSignup}>アカウント作成</button>
    </div>
    </Layout>
  );
};

export default Signup;
