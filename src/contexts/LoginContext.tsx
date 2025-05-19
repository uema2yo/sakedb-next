"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { checkLogin, loginInfo as defaultLoginInfo, LoginInfoProps } from "@/lib/checkLogin";
import { useDispatch } from "react-redux";
import { clearUid, setUid } from "@/lib/store/authSlice";

type LoginContextValue = {
  loginInfo: LoginInfoProps | null;
  loginLoading: boolean;
};

const LoginContext = createContext<LoginContextValue>({
  loginInfo: defaultLoginInfo,
  loginLoading: true,
});

export const useLoginContext = () => useContext(LoginContext);

export function LoginProvider({ children }: { children: ReactNode }) {
  const [loginInfo, setLoginInfo] = useState<LoginInfoProps | null>(defaultLoginInfo);
  const [loginLoading, setLoginLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const info = await checkLogin();
        setLoginInfo(info);

        if (info?.uid) {
          dispatch(setUid(info.uid));
        } else {
          dispatch(clearUid());
        }
      } catch (err) {
        console.error("checkLogin error", err);
        dispatch(clearUid());
      } finally {
        setLoginLoading(false);
      }
    })();
  }, [dispatch]);

  return (
    <LoginContext.Provider value={{ loginInfo, loginLoading }}>
      {children}
    </LoginContext.Provider>
  );
}
