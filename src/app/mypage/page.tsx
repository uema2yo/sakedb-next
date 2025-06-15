"use client";

import MainContainer from "@/components/Article/MainContainer";
import MainHeader from "@/components/Article/MainHeader";
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

  return (
    <>
      <MainHeader title="マイページ"></MainHeader>
      <MainContainer className="max-w-3xl">
        {uid ? (
          <ProfileModule uid={uid} readonly={false} />
        ) : (
          <SignupInformation />
        )}
      </MainContainer>
    </>
  );
}

export default Mypage;
