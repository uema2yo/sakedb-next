"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/init";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SubmitFooter from "./SubmitFooter";

interface LogoutProps {
  closeDialog: () => void;
}

const Logout: React.FC<LogoutProps> = ({ closeDialog }) => {
  const router = useRouter();
  const logout = async () => {
    try {
      await signOut(auth);
      router.replace("/");
    } catch (error) {
      console.error("ログアウトに失敗しました。", error);
    }
  };
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="link">ログアウト</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-(--standard-dialog-max-width)">
          <DialogHeader>
            <DialogTitle>ログアウト確認</DialogTitle>
            <DialogDescription>本当にログアウトしますか？</DialogDescription>
          </DialogHeader>
          <SubmitFooter>
            <div className="flex justify-center gap-4">
              <Button variant="primary" onClick={logout}>
                ログアウト
              </Button>
            </div>
          </SubmitFooter>

          <div className="text-center">
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Logout;
