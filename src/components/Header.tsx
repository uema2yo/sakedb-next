import React, { FC } from "react";
import { SITE_TITLE } from "@/constants";
import Logout from "@/components/Form/Logout";
import Loading from "@/components/Loading";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import Title from "./Article/Title";
import EmailForSignup from "./Form/EmailForSignup";
import Login from "./Form/Login";

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

const Header: FC<HeaderProps> = ({ loginLoading }) => {
  const uid = useSelector((state: RootState) => state.auth.uid) as string;

  const closeDialog = (): void => {
    throw new Error("Function not implemented.");
  };

  return (
    <header className="grid grid-cols-2 items-center fixed w-full bg-white border-b border-primary/50 shadow-lg shadow-primary/10 z-50">
      <Title level="top">
        <a href="/" className="text-black no-underline">
          <img
            src="/images/logo.png"
            alt={SITE_TITLE}
            className="h-[50px] w-auto inline-block mx-2"
            height="70"
          />
        </a>
      </Title>
      <div className="align-self-end justify-self-end p-4">
        {loginLoading ? (
          <div>
            <Loading />
          </div>
        ) : uid ? (
          <Logout closeDialog={closeDialog} />
        ) : (
          <ul className="flex gap-4">
            <li>
              <Login />
            </li>
            <li>
              <EmailForSignup />
            </li>
          </ul>
        )}
      </div>
    </header>
  );
};

export default Header;
