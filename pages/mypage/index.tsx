"use client";

import Layout from "@layout";
import Login from "@components/Form/Login";
import Profile from "@modules/Profile";

import type { LoginInfoProps } from "@lib/checkLogin";

interface Props {
  loginInfo: LoginInfoProps;
  loginLoading: boolean;
}

const Mypage = (props: Props) => {
  const { loginInfo, loginLoading } = props;

  return(
    <Layout loginInfo={loginInfo} loginLoading={loginLoading} >
      <main>
      <header>
          <h1>マイページ</h1>

      </header>
      {loginInfo.uid ? (
    		<Profile uid={loginInfo.uid} />
      ):(
        <>
          <Login />
        </>
      )
      }
      </main>
    </Layout>
  );
}

export default Mypage;
