import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/init";

const Logout = () => {
  const router = useRouter();
  const logout = async () => {
    try {
      await signOut(auth);

      /*
      if (router.pathname === "/") {
        router.reload();
      } else {
        router.push("/");
      }*/
     router.replace("/");
    } catch (error) {
      console.error("ログアウトに失敗しました。", error);
    }
  };
  return (
    <>
      <p>本当にログアウトしますか？</p>
      <button onClick={logout}>ログアウト</button>
    </>
  );
};

export default Logout;
