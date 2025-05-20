import React, { ReactNode, FC } from "react";
import { SITE_TITLE } from "@/constants";
import Login from "@/components/Form/Login";
import Logout from "@/components/Form/Logout";
import Loading from "@/components/Loading";
import SignupButton from "./SignupButton";

type HeaderProps = {
  onDialogToggleButtonClick: (
    id: string,
    title: string,
    slot: (closeDialog: () => void) => React.ReactNode
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
  function closeDialog(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <header>
      <h1>{SITE_TITLE}</h1>
      {loginLoading ? (
        <Loading />
      ) : loginInfo?.uid ? (
        <button
          onClick={() =>
            onDialogToggleButtonClick("logout", "ログアウト確認", (closeDialog) => (
              <Logout closeDialog={closeDialog} />
            ))
          }
        >
          ログアウト
        </button>
      ) : (
        <>
          <button
            onClick={() =>
              onDialogToggleButtonClick("login", "ログイン", (closeDialog) => (
                <Login />
              ))
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
