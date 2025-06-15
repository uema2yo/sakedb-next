"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/init";
import { addDocument } from "@/lib/firebase/addDocument";
import { User, createUserWithEmailAndPassword } from "firebase/auth";
import { validateForms } from "@/lib/code/validateForms";
import { createUser } from "@/lib/firebase/createUser";
import { useLoginContext } from "@/contexts/LoginContext";
import Loading from "@/components/Loading";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GetCollectionConfig } from "@/types/getDocumentsConfig";
import { getDocuments } from "@/lib/firebase/getDocuments";
import MainHeader from "@/components/Article/MainHeader";
import MainContainer from "@/components/Article/MainContainer";
import Login from "@/components/Form/Login";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import Link from "next/link";
const SignupSchema = z.object({
  userId: z.string().min(1, { message: "ユーザー ID を入力してください。" }),
  password: z
    .string()
    .min(8, { message: "8 文字以上のパスワードを入力してください。" }),
  confirmPassword: z
    .string()
    .min(1, { message: "確認用パスワードを入力してください。" }),
});

type SignupSchema = z.infer<typeof SignupSchema>;

const Page = () => {
  const form = useForm<SignupSchema>({
    defaultValues: {
      userId: "",
      password: "",
      confirmPassword: "",
    },
  });
  const { loginLoading } = useLoginContext();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validateUserId, setValidateUserId] = useState<{result: boolean; message?: string | undefined} | undefined>();
  const [validatePassword, setValidatePassword] = useState<{result: boolean; message?: string | undefined} | undefined>();
  const [errorMessageConfirmPassword, setErrorMessageConfirmPassword] = useState("");
  const [validateEmailExists, setValidateEmailExists] = useState({result: false, message: ""});
  const [submitDisabled,setSubmitDisabled] = useState(true);
  const [agreed, setAgreed] = useState(false);

  const router = useRouter();

  const token = new URLSearchParams(window.location.search).get("token");

  const addUserAccount = async (user: User) => {
    const currentPath = window.location.pathname;
    const timestamp = new Date().getTime();  
    await createUser(user);
    addDocument("b_user_id", {
      uid: user.uid,
      value: userId,
      public: true,
      timestamp: timestamp
    });
    addDocument("b_user_email", {
      uid: user.uid,
      value: email,
      public: false,
      timestamp: timestamp
    });
    addDocument("b_user_status", {
      uid: user.uid,
      value: "ACT",
      timestamp: timestamp
    });
  };
  
  const handleChangeUserId = async(event: React.ChangeEvent<HTMLInputElement>) => {
    const newUserId = event.target.value;
    setUserId(newUserId);
    const validate = await validateForms("id", newUserId, false);
    setValidateUserId(validate);
  }

  const handleChangePassword = async(event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    const validate = await validateForms("password", newPassword, false)
    setValidatePassword(validate);
  }

  const handleSignup = async () => {
    if (submitDisabled) return; 
    try {
      if (email) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await addUserAccount(userCredential.user);
        await fetch("/api/deleteSignupToken", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        router.push("/mypage");
      } else {
        setValidateEmailExists({result: false, message: "E メールアドレスが指定されていません。お手数ですが、ユーザー登録を最初からやり直してください。"});
      }
    } catch (error) {
      console.error(error);
    }
  };

  const uid = useSelector((state: RootState) => state.auth.uid) as string;

  useEffect(() => {
    if (email === "") {
      setValidateEmailExists({result: false, message: "E メールアドレスが指定されていません。お手数ですが、ユーザー登録を最初からやり直してください。"});
      return;
    } 
    const configUserEmail: GetCollectionConfig = {
      collectionName: "b_user_email",
      conditions: [{ name: "value", operator: "==", value: email }],
      public_only: false,
      order_by: { field: "timestamp", direction: "desc" },
      limit_num: 1,
    };
    (async () => {
      const resEmail = (await getDocuments([configUserEmail])) as Array<{
        uid: string;
      }>;
      if (resEmail.length > 0) {
        setValidateEmailExists({result: false, message: "このメールアドレスはすでに登録済みです。"});
      } else {
        setValidateEmailExists({result: true, message: ""});
      }
    })();
  }
  , [email]);
  
  useEffect(() => {
    if (token!== null) {
      console.log("トークン:", token);
      fetch(`/api/getSignupEmail?token=${token}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.email) {
            console.log("Eメールアドレス:", data.email);
            setEmail(data.email);
          }
        })
        .catch((error) => {
          console.error("Eメールの取得に失敗しました:", error);
          setValidateEmailExists({
            result: false,
            message:
              "E メールアドレスの取得に失敗しました。お手数ですが、ユーザー登録を最初からやり直してください。",
          });
        });
    } else {
      console.log("トークンが指定されていません。");
      setValidateEmailExists({
        result: false,
        message:
          "URL に有効な token が見つかりません。お手数ですが、ユーザー登録を最初からやり直してください。",
      });
    }
  }, []);

  useEffect(() => {
    if (
      validateUserId?.result &&
      validatePassword?.result &&
      password === confirmPassword
    ) {
      setSubmitDisabled(false);
    } else {
      setSubmitDisabled(true);
    }
    if (password !== "" && password !== confirmPassword) {
      setErrorMessageConfirmPassword("確認用パスワードに同じパスワードをもう一度入力してください。");
    } else {
      setErrorMessageConfirmPassword("");
    }
  }, [userId, password, confirmPassword, validateUserId, validatePassword]);

  if (loginLoading) return <Loading />;

  return (
    <>
      <MainHeader title="アカウント登録">
        {uid ? (
          <p>すでにログインしています。アカウント登録は不要です。</p>
        ) : (
          <>
            <p>新規ユーザー登録を行います。</p>
            <p>
              ※ 既にアカウントをお持ちの方は
              <Login variant="link_inline" size="inline" />
              してください。
            </p>
            {validateEmailExists.result && (
              <p>
                ユーザー ID とパスワードを設定してください。（※ ユーザー ID
                は、ウェブ上で一般公開されます。）
              </p>
            )}
          </>
        )}
      </MainHeader>
      <MainContainer>
        {uid ? (
          <>
          <p>追加でアカウント登録する場合は、一度ログアウトしてください。</p>
          <p>トップページは<Button variant={"link_inline"} size="inline"><Link href="/">こちら</Link></Button></p>
          </>
        ) : validateEmailExists.result ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSignup)}>
              <p>登録するEメールアドレス: {email}</p>
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ユーザー ID</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        value={userId}
                        autoComplete="username"
                        onChange={(e) => handleChangeUserId(e)}
                      />
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
                      <Input
                        type="password"
                        {...field}
                        value={password}
                        autoComplete="new-password"
                        onChange={(e) => handleChangePassword(e)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>確認用パスワード</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        value={confirmPassword}
                        autoComplete="new-password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {validateUserId?.message && <p>{validateUserId.message}</p>}
              {validatePassword?.message && <p>{validatePassword.message}</p>}
              {errorMessageConfirmPassword !== "" && (
                <p>{errorMessageConfirmPassword}</p>
              )}
              <label>
                <Input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                利用規約に同意する
              </label>
              <ul>
                <li>アカウントを作成するには利用規約への同意が必要です。</li>
                <li>ユーザー ID は、半角英数と「_」以外は使用できません。</li>
                <li>パスワードは、半角英数記号による最低 8 文字を設定してください。</li>
                <li>確認用パスワードに同じパスワードを再入力してください。</li>
                <li>ユーザー ID とパスワードは、ログイン時に必要になります。</li>
                <li>ユーザー ID は、ウェブ上で一般公開されます。</li>
              </ul>
              <div>
                <Button
                  variant="primary"
                  onClick={handleSignup}
                  disabled={submitDisabled || !agreed}
                >
                  アカウント作成
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <>
            {validateEmailExists.result === false && (
              <>
                <p className="mb-4">{validateEmailExists.message}</p>
                <p>
                  または、
                  <Login variant="link_inline" size="inline" />
                  フォームからログインしてください。
                </p>
              </>
            )}
          </>
        )}
      </MainContainer>
    </>
  );
};

export default Page;
