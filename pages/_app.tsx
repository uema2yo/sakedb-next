import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { Providers } from "@/lib/Providers";
import { LoginProvider } from "@/contexts/LoginContext";
import ClientLayoutInner from "@/components/ClientLayoutInner";

import "@/styles/globals.css";
import "@/styles/tailwind.css";
import "@/styles/main.scss";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    document.documentElement.classList.add("summer")
  }, [])
  return (
    <div className={inter.className}>
      <Providers>
        <LoginProvider>
          <ClientLayoutInner>
            <Component {...pageProps} />
          </ClientLayoutInner>
        </LoginProvider>
      </Providers>
    </div>
  );
}
