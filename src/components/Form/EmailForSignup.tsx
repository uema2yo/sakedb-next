"use client";


import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { sendSignInLinkToEmail } from "firebase/auth";
import { auth, db } from "@/lib/firebase/init";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { DOMAIN, LOCAL_DOMAIN } from "@/constants";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SubmitFooter from "./SubmitFooter";
import { Check } from "lucide-react";

const emailSchema = z.object({
  email: z.string().email({ message: "有効なメールアドレスをご入力ください。" }),
});

interface EmailForSignupProps {
  variant?: "outline" | "link_default";
}

type EmailFormValues = z.infer<typeof emailSchema>;

const EmailForSignup = ({ variant = "link_default" }: EmailForSignupProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [description, setDescription] = useState("受信可能な E メールアドレスをごご送信ください。");
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [emailValidated, setEmailValidated] = useState(<></>);

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    const email = form.watch("email");
    const emailResult = emailSchema.shape.email.safeParse(email);
    if (emailResult.success) {
      setEmailValidated(<Check className="text-success inline-block" size={20} absoluteStrokeWidth />);
    } else {
      setEmailValidated(<></>);
    }
    setSubmitDisabled(!emailResult.success || !form.formState.isValid);
  }, [form.watch("email"), form.formState.isValid]);

const handleSendEmail = async (data: EmailFormValues) => {
  const token = uuidv4();
  const signupUrl =
    process.env.NEXT_PUBLIC_LOCAL === "TRUE"
      ? `http://${LOCAL_DOMAIN}/signup?token=${token}`
      : `https://${DOMAIN}/signup?token=${token}`;

  const actionCodeSettings = {
    url: signupUrl,
    handleCodeInApp: true,
  };

  try {
    await setDoc(doc(db, "signup_tokens", token), {
      email: data.email,
      createdAt: serverTimestamp(),
    });

    await sendSignInLinkToEmail(auth, data.email, actionCodeSettings);
    setSubmitted(true);
    setDescription("");
  } catch (error) {
    console.error("メール送信エラー:", error);
  }
};
  /*
  const handleSendEmail = async (data: EmailFormValues) => {
    const signupUrl =
      process.env.NEXT_PUBLIC_LOCAL === "TRUE"
        ? `http://${LOCAL_DOMAIN}/signup`
        : `https://${DOMAIN}`;
    const actionCodeSettings = {
      url: signupUrl,
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, data.email, actionCodeSettings);
      window.localStorage.setItem("emailForSignup", data.email);
      setSubmitted(true);
      setDescription("");
    } catch (error) {
      console.error("メール送信エラー:", error);
    }
  };
  */
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={variant}>ユーザー登録</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-(--standard-dialog-max-width)">
        <DialogHeader>
          <DialogTitle>ユーザー登録</DialogTitle>
          {description !== "" && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>

        {submitted ? (
          <div className="text-center space-y-2">
            <p>{form.getValues("email")} に認証メールを送信しました。</p>
            <p>
              メール本文に記載してある認証リンクにアクセスするとユーザー登録画面が開きます。
            </p>
          </div>
        ) : (
          <div className="w-full max-w-md mx-auto">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSendEmail)}
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
                            有効なメールアドレスをご入力ください。
                            {emailValidated}
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
                    E メールアドレスを送信する
                  </Button>
                </SubmitFooter>
              </form>
            </Form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmailForSignup;
