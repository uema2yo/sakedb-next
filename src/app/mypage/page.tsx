"use client";

import Loading from "@/components/Loading";
import { useLoginContext } from "@/contexts/LoginContext";
import ProfileModule from "@/modules/ProfileModule";

const Page = () => {
  const { loginInfo, loginLoading } = useLoginContext();

  if (loginLoading) return <Loading />;

  return(
      <main>
        <header>
            <h1>マイページ</h1>
        </header>
        <ProfileModule uid={loginInfo?.uid || ""} />
      </main>
  );
}

export default Page;
