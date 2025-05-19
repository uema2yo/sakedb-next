// lib/LoginContext.tsx
"use client";
import { createContext, useContext } from "react";

export const LoginContext = createContext<{ uid: string } | null>(null);
export const useLogin = () => useContext(LoginContext);
