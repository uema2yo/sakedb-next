import { ReactNode } from "react";
import { Inter } from "next/font/google";
import { Providers } from "@/lib/Providers";
import ClientLayoutInner from "@/components/ClientLayoutInner";
import { LoginProvider } from "@/contexts/LoginContext";

import "@/styles/globals.css";
import "@/styles/tailwind.css";
import "@/styles/main.scss";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "My App",
  description: "App Router Layout",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja" className="summer">
      <head>
      </head>
      <body className={inter.className}>
        <Providers>
          <LoginProvider>
          <ClientLayoutInner>{children}</ClientLayoutInner>
          </LoginProvider>
        </Providers>
      </body>
    </html>
  );
}
