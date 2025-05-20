"use client";

import Loading from "@/components/Loading";
import { useLoginContext } from "@/contexts/LoginContext";
import { RootState } from "@/lib/store";
import ProfileModule from "@/modules/ProfileModule";
import { useSelector } from "react-redux";

const Page = () => {
  const uid = useSelector((state: RootState) => state.auth.uid) as string;
  const { loginLoading } = useLoginContext();
  
  if (loginLoading) return <Loading />;

  return(
      <main>
        <header>
            <h1>マイページ</h1>
        </header>
        { uid !== "" ?
        <ProfileModule />
        :
        <article>
          <h2></h2>

        </article>
        }
      </main>
  );
}

export default Page;
