import { ReactNode } from "react";

interface MainContainerProps {
  children: ReactNode;
  maxWidth?: string;
}

const MainContainer = ({ children, maxWidth }: MainContainerProps) => {
  return (
    <div className={`mb-4 bg-white ${maxWidth ? `max-w-${maxWidth}` : `max-w-full`} mx-auto`}>
      {children}
    </div>
  );
}
export default MainContainer;
