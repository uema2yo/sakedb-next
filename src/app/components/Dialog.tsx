import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  ReactNode,
} from "react";

type DialogProps = {
  id?: string;
  title?: string;
  slot?: ReactNode;
};

export interface DialogComponentHandle {
  toggleDialog: () => void;
}

const Dialog = forwardRef<DialogComponentHandle, DialogProps>(({ id, title, slot }, ref) => {
  const [open, setOpen] = useState(false);
  useImperativeHandle(ref, () => ({
    toggleDialog,
    closeDialog
  }));
  const openRef = useRef(null);
  const toggleDialog = () => {
    setOpen(!open);
  }
  const closeDialog = () => {
    setOpen(false);
  }
  return (
  <dialog id={id} ref={openRef} open={open}>
    <button onClick={closeDialog}>&#10005;</button>
    <h2>{title}</h2>
    {slot}
  </dialog>
  );
});
export default Dialog;
