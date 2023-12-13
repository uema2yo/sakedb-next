import { useRouter } from 'next/router';
import { signOut } from "firebase/auth";
import { auth } from "@lib/firebase/init";
import { addDocument } from "@lib/firebase/addDocument";

const Logout = () => {
  const router = useRouter()
  const logout = async () => {
    try {
      //await addDocument("m_user_status", { value: 0 });
      await signOut(auth);
      router.push("/");
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
