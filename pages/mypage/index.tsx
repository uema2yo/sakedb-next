"use client";

import Layout from "@/layout";
import Login from "@/components/Form/Login";
import Loading from "@/components/Loading";
import ProfileModule from "@/modules/ProfileModule";
import type { LoginInfoProps } from "@/lib/checkLogin";

interface Props {
  loginInfo: LoginInfoProps;
  loginLoading: boolean;
}

const Mypage = (props: Props) => {
  const { loginInfo, loginLoading } = props;
  const uid = loginInfo ? loginInfo.uid : "";

  return(
    <Layout loginInfo={loginInfo} loginLoading={loginLoading} >
      <main>
      <header>
          <h1>マイページ</h1>
      </header>

      {loginLoading ? (
        <Loading />
      ) : uid !== "" ? (
        <ProfileModule uid={uid} />
    	):(
        <Login />
      )
      }
      </main>
    </Layout>
  );
}

export default Mypage;
