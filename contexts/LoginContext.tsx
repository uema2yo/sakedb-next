"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { checkLogin, loginInfo as defaultLoginInfo, LoginInfoProps } from "@/lib/checkLogin";

type LoginContextValue = {
  loginInfo: LoginInfoProps | null;
  loginLoading: boolean;
};

const LoginContext = createContext<LoginContextValue>({
  loginInfo: defaultLoginInfo,
  loginLoading: true,
});

export const useLoginContext = () => useContext(LoginContext);

export function LoginProvider({ children }: { children: React.ReactNode }) {
  const [loginInfo, setLoginInfo] = useState<LoginInfoProps | null>(defaultLoginInfo);
  const [loginLoading, setLoginLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const info = await checkLogin();
        setLoginInfo(info);
      } catch (err) {
        console.error("checkLogin error", err);
      } finally {
        setLoginLoading(false);
      }
    })();
  }, []);

  return (
    <LoginContext.Provider value={{ loginInfo, loginLoading }}>
      {children}
    </LoginContext.Provider>
  );
}
