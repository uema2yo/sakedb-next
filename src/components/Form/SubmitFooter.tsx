import { ReactNode } from "react";

interface SubmitFooterProps {
  className?: string;
}

const SubmitFooter = ({children}: { children: ReactNode }, SubmitFooterProps: { className: string; }) => {
  return (
  <footer className={`p-4 ${SubmitFooterProps.className}`} data-slot="submit-footer">  
    {children}
  </footer>)
}

export default SubmitFooter;
