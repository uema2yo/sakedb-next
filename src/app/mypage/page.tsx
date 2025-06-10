"use client";

import Title from "@/components/Article/Title";
import Loading from "@/components/Loading";
import SignupInformation from "@/components/SignupInformation";
import { useLoginContext } from "@/contexts/LoginContext";
import { RootState } from "@/lib/store";
import ProfileModule from "@/modules/ProfileModule";
import { useSelector } from "react-redux";

const Mypage = () => {
  const uid = useSelector((state: RootState) => state.auth.uid) as string;

  const { loginLoading } = useLoginContext();
  
  if (loginLoading) return <Loading />;

  return(
      <>
        <header>
            <Title level="main">マイページ</Title>
        </header>
        { uid ?
        <ProfileModule uid={uid} readonly={false} />
        :
        <SignupInformation />
        }
      </>
  );
}

export default Mypage;
