import { signOut } from "firebase/auth";
import { auth } from "@lib/firebase/init";
//import { addDocument } from "@lib/firebase/addDocument";

const Logout = () => {
  const logout = async () => {
    try {
      //await addDocument("m_user_status", { value: 0 });
      await signOut(auth);
      //goto("/login");
    } catch (error) {
      console.error("ログアウトに失敗しました。", error);
    }
  };
  return (
    <>
      <button onClick={logout}>Logout</button>
    </>
  );
};

export default Logout;
