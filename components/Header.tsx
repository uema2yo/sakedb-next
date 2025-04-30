import React, { ReactNode, FC } from "react";
import { SITE_TITLE } from "@/constants";
import Login from "@/components/Form/Login";
import Logout from "@/components/Form/Logout";
import EmailForSignup from "@/components/Form/EmailForSignup";
import Loading from "@/components/Loading";
import Signup from "@/pages/signup";
import SignupButton from "./SignupButton";

type HeaderProps = {
  onDialogToggleButtonClick: (
    id: string,
    title: string,
    slot: ReactNode
  ) => void;
  loginInfo: {
    uid: string;
    user: boolean;
    admin: boolean;
    status: number;
  } | null;
  loginLoading: boolean;
};

const Header: FC<HeaderProps> = ({
  onDialogToggleButtonClick,
  loginInfo,
  loginLoading,
}) => {
  return (
    <header>
      <h1>{SITE_TITLE}</h1>
      {loginLoading ? (
        <Loading />
      ) : loginInfo?.uid ? (
        <button
          onClick={() =>
            onDialogToggleButtonClick("logout", "ログアウト", <Logout />)
          }
        >
          ログアウト
        </button>
      ) : (
        <>
          <button
            onClick={() =>
              onDialogToggleButtonClick("login", "ログイン", <Login />)
            }
          >
            ログイン
          </button>
          <SignupButton />
        </>
      )}
    </header>
  );
};

export default Header;
