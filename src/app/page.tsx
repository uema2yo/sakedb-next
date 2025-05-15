"use client";

import Loading from "@/components/Loading";
import { useLoginContext } from "@/contexts/LoginContext";

const Index = () => {
  const { loginInfo, loginLoading } = useLoginContext();

  if (loginLoading) return <Loading />;

  return (
    <main>
      <header>
        <h1>home</h1>
      </header> 
    </main>
  );
};

export default Index;
