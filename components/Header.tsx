import React, { ReactNode, FC } from "react";
import { SITE_TITLE } from "@constants";
import Login from "@components/Form/Login";
import EmailForSignup from "@components/Form/EmailForSignup";

type ClickProps = {
  onDialogToggleButtonClick: (
    id: string,
    title: string,
    slot: ReactNode
  ) => void;
};

const Header: FC<ClickProps> = ({ onDialogToggleButtonClick }) => {
  return (
    <header>
      <h1>{SITE_TITLE}</h1>
      <button onClick={() => onDialogToggleButtonClick("login", "ログイン", <Login />)}>
        ログイン
      </button>
      <button onClick={() => onDialogToggleButtonClick("signup", "ユーザー登録", <EmailForSignup />)}>
        ユーザー登録
      </button>
    </header>
  );
};

export default Header;
