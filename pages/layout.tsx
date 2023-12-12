"use client";

import { ReactNode, useState } from "react";
import { useRef, useEffect } from "react";
import { checkLogin, login } from "@lib/checkLogin";
import Header from "@components/Header";
import Footer from "@components/Footer";
import Dialog, { DialogComponentHandle } from "@components/Dialog";

type LayoutProps = {
  children: ReactNode;
  logout?: boolean;
};

const Layout = ({ children, logout = true }: LayoutProps) => {
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
  useEffect(() => {
    (async () => {
      try {
        await checkLogin();
        console.log("login", login);
        setLoading(false);
      } catch (error) {
        console.error(
          "An error occurred while checking the login status:",
          error
        );
      }
    })();
  }, []);

  return (
    <>
      !!
      {logout && (
        <Header onDialogToggleButtonClick={handleDialogToggleButtonClick} />
      )}
      {children}
      <Footer />
      <Dialog ref={dialogRef} id={id} title={title} slot={slot} />
    </>
  );
};

export default Layout;
