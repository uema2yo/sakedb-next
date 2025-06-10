"use client";

import { ReactNode, useRef, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
//import SimpleDialog, { DialogComponentHandle } from "@/components/Dialog/SimpleDialog";
import { DialogProvider } from "@/contexts/DialogContext";
import { useLoginContext } from "@/contexts/LoginContext";

export default function ClientLayoutInner(
  { children }: { children: ReactNode }
) {
  const { loginInfo, loginLoading } = useLoginContext();
  //const dialogRef = useRef<DialogComponentHandle>(null);
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [slot, setSlot] = useState<(closeDialog: () => void) => ReactNode>();

  const onDialogToggleButtonClick = (
    id: string,
    title: string,
    slot: (closeDialog: () => void) => ReactNode
  ) => {
    setId(id);
    setTitle(title);
    setSlot(() => slot); // 必ず関数として渡す
    //dialogRef.current?.openDialog();
  };

  const closeDialog = () => {
    //dialogRef.current?.closeDialog();
  };

  return (
    <DialogProvider
      value={{ onDialogToggleButtonClick, closeDialog }}
    >
      <Header
        loginInfo={loginInfo}
        loginLoading={loginLoading}
        onDialogToggleButtonClick={onDialogToggleButtonClick}
      />
      <main className="pt-[100px] p-4 bg-white">
      {children}
      </main>
      <Footer />
      {/*<SimpleDialog id={id} title={title} slot={slot} ref={dialogRef} />*/}
    </DialogProvider>
  );
}
