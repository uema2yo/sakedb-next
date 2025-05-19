import { ReactNode } from "react";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "@/lib/Providers";
import ClientLayoutInner from "@/components/ClientLayoutInner";
import { LoginProvider } from "@/contexts/LoginContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "My App",
  description: "App Router Layout",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <Providers>
          <LoginProvider>
          <ClientLayoutInner>{children}</ClientLayoutInner>
          </LoginProvider>
        </Providers>
      </body>
    </html>
  );
}

/*
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
    <DialogProvider
      value={{ onDialogToggleButtonClick: handleDialogToggleButtonClick }}
    >

        <Header
          onDialogToggleButtonClick={handleDialogToggleButtonClick}
          loginInfo={loginInfo}
          loginLoading={loginLoading}
        />!!!!!
        {children}
        <Footer />
        <Dialog ref={dialogRef} id={id} title={title} slot={slot} />
        </DialogProvider>
      </body>
    </html>
  );
}*/
