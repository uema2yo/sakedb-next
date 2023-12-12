import type { AppProps } from 'next/app';
import { NextPage } from 'next';
import "@styles/common.scss";

const MyApp: NextPage<AppProps> = ({ Component, pageProps }: AppProps)  => {
  return (
    <>
      <Component {...pageProps} />
    </>
  )
}
export default MyApp;
