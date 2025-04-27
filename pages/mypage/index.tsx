"use client";

import Layout from "@layout";
import Login from "@components/Form/Login";
import Loading from "@components/Loading";
import Profile from "@pages/profile";
import type { LoginInfoProps } from "@lib/checkLogin";

interface Props {
  loginInfo: LoginInfoProps;
  loginLoading: boolean;
}

const Mypage = (props: Props) => {
  const { loginInfo, loginLoading } = props;
  const uid = loginInfo.uid;
console.log(uid)
  return(
    <Layout loginInfo={loginInfo} loginLoading={loginLoading} >
      <main>
      <header>
          <h1>マイページ</h1>
      </header>

      {loginLoading ? (
        <Loading />
      ) : uid !== "" ? (
    		<Profile uid={uid} />
      ):(
        <Login />
      )
      }
      </main>
    </Layout>
  );
}

export default Mypage;
