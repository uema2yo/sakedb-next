"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { auth, db } from "@lib/firebase/init";
import { addDocument } from "@lib/firebase/addDocument";
import { setDoc, doc } from "firebase/firestore";
import { User, createUserWithEmailAndPassword } from "firebase/auth";
import Layout from "@layout";

import type { LoginInfoProps } from "@lib/checkLogin";

interface Props {
  loginInfo: LoginInfoProps;
  loginLoading: boolean;
}

const Signup = (props: Props) => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const { loginInfo, loginLoading } = props;

  useEffect(() => {
    setEmail(window.localStorage.getItem("emailForSignup") || "");
  },[]);

  const addUserAccount = async (user: User) => {
    const currentPath = window.location.pathname;
    const timestamp = new Date().getTime();  
    await setDoc(doc(db, "m_user", user.uid), {
      //uid を一致させるために m_user は setDoc を使う。
      uid: user.uid,
      timestamp: timestamp
    });
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

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      alert("パスワードが一致しません。");
      return;
    }

    try {
      if (email) {
        console.log(auth, email, password)
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await addUserAccount(userCredential.user);
        // 登録成功後の処理
        router.push("/mypage");
      } else {
        // Eメールアドレスが存在しない場合のエラー処理
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout loginInfo={loginInfo} loginLoading={loginLoading} >
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
