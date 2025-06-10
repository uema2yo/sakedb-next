"use client";

import Loading from "@/components/Loading";
import { useLoginContext } from "@/contexts/LoginContext";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";


const Index = () => {
  const { loginInfo, loginLoading } = useLoginContext();
  const uploadedUrl = useSelector((state: RootState) => state.profileImage.url);

  if (loginLoading) return <Loading />;

  return (
    <>
      <header>
        <h1>home</h1>
        <img src={uploadedUrl} />
      </header> 
    </>
  );
};

export default Index;
