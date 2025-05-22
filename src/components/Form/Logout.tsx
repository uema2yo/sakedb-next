"use client";

import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/init";

interface LogoutProps {
  closeDialog: () => void;
}

const Logout: React.FC<LogoutProps> = ({ closeDialog }) => {
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
  return (
    <>
      <p className="custom">本当にログアウトしますか？</p>
      <button onClick={logout}>ログアウト</button>
    </>
  );
};

export default Logout;
