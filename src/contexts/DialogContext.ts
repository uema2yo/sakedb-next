import { createContext, useContext, ReactNode } from "react";

export interface DialogContextProps {
  onDialogToggleButtonClick: (
    id: string,
    title: string,
    slot: (closeDialog: () => void) => ReactNode
  ) => void;
  closeDialog: () => void;
}

const DialogContext = createContext<DialogContextProps | undefined>(undefined);

export const DialogProvider = DialogContext.Provider;

export const useDialog = (): DialogContextProps => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
};
