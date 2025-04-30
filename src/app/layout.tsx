"use client";

import { ReactNode, useState } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { useRef } from "react";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Dialog, { DialogComponentHandle } from "@/components/Dialog";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout(
  { children }: { children: ReactNode },
  loginInfo: {
    uid: string;
    user: boolean;
    admin: boolean;
    status: number;
  } | null,
  loginLoading: boolean
) {
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
    <html lang="en">
      <body className={inter.className}>
        <Header
          onDialogToggleButtonClick={handleDialogToggleButtonClick}
          loginInfo={loginInfo}
          loginLoading={loginLoading}
        />
        {children}
        <Footer />
        <Dialog ref={dialogRef} id={id} title={title} slot={slot} />
      </body>
    </html>
  );
}
