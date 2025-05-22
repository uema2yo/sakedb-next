"use client";
import { useState, useEffect, FormEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/init";
import {
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  browserSessionPersistence,
} from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("replace", user, pathname);
      if (user && pathname) {
        router.replace(pathname);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const login = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        return signInWithEmailAndPassword(auth, email, password);
      })
      .catch((error) => {
        console.error("Error signing in", error);
      });
  };

  return (
    <>
      <p>ご登録いただいた方法でログインしてください。</p>
      <form onSubmit={login}>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="E メール"
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="パスワード"
        />
        <button type="submit">ログイン</button>
      </form>
    </>
  );
};

export default Login;
