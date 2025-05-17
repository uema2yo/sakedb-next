"use client";

import { ReactNode, useState, FC } from "react";
import { useRef, useEffect } from "react";
import type { LoginInfoProps } from "@/lib/checkLogin";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Dialog, { DialogComponentHandle } from "@/components/Dialog";
import SignupDialogButton from "@/components/SignupButton";
import { DialogProvider } from "../contexts/DialogContext";

interface LayoutProps {
  children: ReactNode;
  loginInfo: LoginInfoProps;
  loginLoading: boolean;
}

const Layout: FC<LayoutProps> = ({ children, loginInfo, loginLoading }) => {
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [slot, setSlot] = useState<ReactNode>();
  const dialogRef = useRef<DialogComponentHandle>(null);
  const handleDialogToggleButtonClick = (
    id: string,
    title: string,
    slot: ReactNode
  ) => {
    setId(id);
    setTitle(title);
    setSlot(slot);
    dialogRef.current?.openDialog();
  };

  return (
    <DialogProvider
      value={{ onDialogToggleButtonClick: handleDialogToggleButtonClick }}
    >
      <Header
        onDialogToggleButtonClick={handleDialogToggleButtonClick}
        loginInfo={loginInfo}
        loginLoading={loginLoading}
      />
      {children}
      <Footer />
      <Dialog ref={dialogRef} id={id} title={title} slot={slot} />
    </DialogProvider>
  );
};

export default Layout;
