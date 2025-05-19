"use client"

import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  ReactNode,
} from "react";

interface DialogProps {
  id?: string;
  title?: string;
  slot?: (closeDialog: () => void) => ReactNode;
};

export interface DialogComponentHandle {
  toggleDialog: () => void;
  openDialog: () => void;
  closeDialog: () => void;
}

const Dialog = forwardRef<DialogComponentHandle, DialogProps>(({ id, title, slot }, ref) => {
  const [open, setOpen] = useState(false);
  const openRef = useRef(null);

  const toggleDialog = () => setOpen(!open);
  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);

  useImperativeHandle(ref, () => ({
    toggleDialog,
    openDialog,
    closeDialog
  }));

  return (
    <dialog id={id} ref={openRef} open={open}>
      <button onClick={closeDialog}>&#10005;</button>
      <h2>{title}</h2>
      {slot && slot(closeDialog)}
    </dialog>
  );
});
Dialog.displayName = "Dialog";
export default Dialog;
