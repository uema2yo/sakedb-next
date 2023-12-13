import { useState, useEffect } from "react";
import type { AppProps } from 'next/app';
import { NextPage } from 'next';
import { checkLogin, loginInfo } from "@lib/checkLogin";
import "@styles/common.scss";

const MyApp: NextPage<AppProps> = ({ Component, pageProps }: AppProps)  => {
  const [loginInfoProps, setLoginInfoProps] = useState({});
  useEffect(() => {
    (async () => {
      try {
        await checkLogin();
        setLoginInfoProps(loginInfo);
      } catch (error) {
        console.error(
          "An error occurred while checking the login status:",
          error
        );
      }
    })();
  }, []);

  return (
    <Component {...pageProps} loginInfo={loginInfoProps} />
  )
}
export default MyApp;
