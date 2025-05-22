import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { Providers } from "@/lib/Providers";
import { LoginProvider } from "@/contexts/LoginContext";
import ClientLayoutInner from "@/components/ClientLayoutInner";

const inter = Inter({ subsets: ["latin"] });

export default function MyApp({ Component, pageProps }: AppProps) {
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
