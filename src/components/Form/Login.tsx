"use client"

import React, { ReactNode, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, usePathname } from "next/navigation"
import { auth } from "@/lib/firebase/init"
import {
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  browserSessionPersistence,
} from "firebase/auth"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import SubmitFooter from "./SubmitFooter"
import { Check } from "lucide-react"

const loginSchema = z.object({
  email: z.string().email({ message: "有効なメールアドレスを入力してください。" }),
  password: z.string().min(8, { message: "8 文字以上のパスワードを入力してください。" }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function Login() {
  const router = useRouter();
  const pathname = usePathname();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [emailValidated, setEmailValidated] = useState(<></>);
  const [passwordValidated, setPasswordValidated] = useState(<></>);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && pathname) {
        router.replace(pathname);
      }
    });
    return () => unsubscribe();
  }, [router, pathname]);

  useEffect(() => {
    const email = form.watch("email");
    const password = form.watch("password");
    const emailResult = loginSchema.shape.email.safeParse(email);
    const passwordResult = loginSchema.shape.password.safeParse(password);
    if (emailResult.success) {
      setEmailValidated(<Check className="text-success inline-block" size={20} absoluteStrokeWidth />);
    } else {
      setEmailValidated(<></>);
    }
    if (passwordResult.success) {
      setPasswordValidated(<Check className="text-success inline-blick" size={20} absoluteStrokeWidth />);
    } else {
      setPasswordValidated(<></>);
    }
    setSubmitDisabled(!emailResult.success || !form.formState.isValid);
  }, [form.watch("email"), form.watch("password"), form.formState.isValid]);
 
  const submitLoginForm = async (data: LoginFormValues) => {
    try {
      await setPersistence(auth, browserSessionPersistence);
      await signInWithEmailAndPassword(auth, data.email, data.password);
    } catch (error) {
      console.error("ログインエラー", error);
      // 必要ならここで toast 表示など
    }
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link">ログイン</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-(--standard-dialog-max-width)">
        <DialogHeader>
          <DialogTitle>ログイン</DialogTitle>
          <DialogDescription>
            ご登録いただいた方法でログインしてください。
          </DialogDescription>
        </DialogHeader>

        <div className="w-full max-w-md mx-auto">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(submitLoginForm)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>メールアドレス</FormLabel>
                    <FormControl>
                      <>
                        <Input
                          type="email"
                          placeholder="example@example.com"
                          {...field}
                        />
                        <p className="flex items-center text-secondary text-sm">
                          有効なメールアドレスを入力してください。
                          {emailValidated}
                        </p>
                      </>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>パスワード</FormLabel>
                    <FormControl>
                      <>
                        <Input
                          type="password"
                          placeholder="パスワード"
                          {...field}
                        />
                        <p className="flex items-center text-secondary text-sm">
                          8 文字以上のパスワードを入力してください。
                          {passwordValidated}
                        </p>
                      </>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SubmitFooter>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={submitDisabled}
                  className="w-full"
                >
                  ログイン
                </Button>
              </SubmitFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
