"use client";

import { ReactNode, useState, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Dialog, { DialogComponentHandle } from "@/components/Dialog";
import { DialogProvider } from "@/contexts/DialogContext";
import { useLoginContext } from "@/contexts/LoginContext";
//import { checkLogin, loginInfo } from "@/lib/checkLogin";

export default function ClientLayoutInner(
  { children }: { children: ReactNode }) {
  const { loginInfo, loginLoading } = useLoginContext();
  const uid = loginInfo ? loginInfo.uid : "";
  
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [slot, setSlot] = useState<ReactNode>();
  const dialogRef = useRef<DialogComponentHandle>(null);
  //const [loginLoading, setLoginLoading] = useState(true);
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

  //const { loginInfo, loginLoading } = useLoginContext();
console.log("LayoutInner")
  //if (loginLoading) return <p>ログイン確認中...</p>;

  //await checkLogin();

  //setLoginLoading(false);

  return (
    <DialogProvider
      value={{ onDialogToggleButtonClick: handleDialogToggleButtonClick }}
    >
      <Header loginInfo={loginInfo} loginLoading={loginLoading} onDialogToggleButtonClick={handleDialogToggleButtonClick} />
      {children}
      <Footer />
      <Dialog ref={dialogRef} id={id} title={title} slot={slot} />
    </DialogProvider>
  );
}
