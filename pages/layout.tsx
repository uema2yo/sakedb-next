"use client";

import { ReactNode, useState } from "react";
import { useRef } from "react";
import Header from "@components/Header";
import Footer from "@components/Footer";
import Dialog, { DialogComponentHandle } from "@components/Dialog";

export default function Layout({ children }: { children: ReactNode }) {
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
    dialogRef.current?.toggleDialog();
  };

  return (
    <>
      <Header onDialogToggleButtonClick={handleDialogToggleButtonClick} />
      {children}
      <Footer />
      <Dialog ref={dialogRef} id={id} title={title} slot={slot} />
    </>
  );
}
