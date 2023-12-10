import type { AppProps } from 'next/app';
import { NextPage } from 'next';
import "@styles/common.scss";

const MyApp: NextPage<AppProps> = ({ Component, pageProps }: AppProps)  => {
  console.log("Hoge")
  return (
    <>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp;
