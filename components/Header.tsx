import React, { ReactNode, FC } from "react";
import { SITE_TITLE } from "@constants";
import Login from "@components/Form/Login";
import Logout from "@components/Form/Logout";
import EmailForSignup from "@components/Form/EmailForSignup";

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
};

const Header: FC<HeaderProps> = ({
  onDialogToggleButtonClick,
  loginInfo = null,
}) => {
  return (
    <header>
      <h1>{SITE_TITLE}</h1>
      {loginInfo?.uid ? (
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
          <button
            onClick={() =>
              onDialogToggleButtonClick(
                "signup",
                "ユーザー登録",
                <EmailForSignup />
              )
            }
          >
            ユーザー登録
          </button>
        </>
      )}
    </header>
  );
};

export default Header;
