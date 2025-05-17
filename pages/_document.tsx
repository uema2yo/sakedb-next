import { Html, Head, Main, NextScript } from "next/document";

const MyDocument = () => {
  return (
    <Html lang="ja">
      <Head>
        <link
          href="https://fonts.googleapis.com/css?family=Noto+Sans+JP&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="my-custom-class">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default MyDocument;
