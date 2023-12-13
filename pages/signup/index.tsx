"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "@lib/firebase/init";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Layout from "@layout";

const Signup = (loginInfo: { uid: string; user: boolean; admin: boolean; status: number; } | null) => {
  const [userId, setUserId] = useState("");
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
        router.push("/dashboard");
      } else {
        // Eメールアドレスが存在しない場合のエラー処理
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout loginInfo={loginInfo} >
      <div >
        <p>
          ユーザー ID とパスワードを設定してください。（※ ユーザー ID
          は、ウェブ上で一般公開されます。）
        </p>
        <p>登録するEメールアドレス: {email}</p>
        <label>
          ユーザー ID:
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </label>
        <label>
          パスワード:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label>
          パスワード（確認）:
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </label>

        <button onClick={handleSignup}>アカウント作成</button>
      </div>
    </Layout>
  );
};

export default Signup;
