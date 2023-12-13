"use client";

import { ReactNode, useState } from "react";
import { useRef, useEffect } from "react";
//import { checkLogin, loginInfo } from "@lib/checkLogin";
import Header from "@components/Header";
import Footer from "@components/Footer";
import Dialog, { DialogComponentHandle } from "@components/Dialog";

type LayoutProps = {
  children: ReactNode;
  loginInfo: {
    uid: string;
    user: boolean;
    admin: boolean;
    status: number;
  } | null;
};

const Layout = ({ children, loginInfo }: LayoutProps) => {
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [slot, setSlot] = useState<ReactNode>();
  const [laoding, setLoading] = useState(true);
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
    <>
      <Header
        onDialogToggleButtonClick={handleDialogToggleButtonClick}
        loginInfo={loginInfo}
      />
      {children}
      <Footer />
      <Dialog ref={dialogRef} id={id} title={title} slot={slot} />
    </>
  );
};

export default Layout;
