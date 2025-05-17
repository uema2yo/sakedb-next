import { useState, useEffect, ReactNode } from "react";
import type { AppProps } from "next/app";
import { NextPage } from "next";
import { checkLogin, loginInfo, LoginInfoProps } from "@/lib/checkLogin";
import "@/styles/common.scss";

const MyApp: NextPage<AppProps> = ({
  Component,
  pageProps,
  router,
}: AppProps) => {
  const [loginInfoProp, setLoginInfoProp] = useState<LoginInfoProps | null>(loginInfo);
  const [loginLoading, setLoginLoading] = useState(true);
  const additionalProps = {
    loginInfo: loginInfoProp,
    loginLoading: loginLoading,
  };

  useEffect(() => {
    (async () => {
      try {
        const info = await checkLogin();
        setLoginInfoProp(info);
        setLoginLoading(false);
      } catch (error) {
        console.error(
          "An error occurred while checking the login status:",
          error
        );
      }
    })();
  }, [router.pathname]);

  return <Component {...pageProps} {...additionalProps} />;
};

export default MyApp;
