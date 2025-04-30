"use client";

import React from "react";
import EmailForSignup from "@/components/Form/EmailForSignup";
import { useDialog } from "@/contexts/dialogContext";

interface Props {
}

const SignupDialogButton = (props: Props) => {
  const { onDialogToggleButtonClick } = useDialog();
  const handleClick = () => {
    onDialogToggleButtonClick("signup", "ユーザー登録", <EmailForSignup />);
  };

  return (
    <button onClick={handleClick}>
      ユーザー登録
    </button>
  );
};

export default SignupDialogButton;
