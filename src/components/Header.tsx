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

const Header: FC<HeaderProps> = ({
  loginLoading,
}) => {

  const uid = useSelector((state: RootState) => state.auth.uid) as string;

  const closeDialog = (): void => {
    throw new Error("Function not implemented.");
  }

  return (
    <header className="grid grid-cols-3 items-center">
      <div>
        <Title level="top">{SITE_TITLE}</Title>
      </div>
      {loginLoading ? (
        <div>
          <Loading />
        </div>
      ) : uid ? (
        <Logout closeDialog={closeDialog} />
      ) : (
        <>
          <div>
            <Login />
          </div>
          <div>
            <EmailForSignup closeDialog={closeDialog} />
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
