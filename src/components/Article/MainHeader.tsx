import React, { ReactNode } from "react";
import Title from "../Article/Title";

interface MainHeaderProps {
  title?: string;
  children?: ReactNode;
  maxWidth?: string;
}

const MainHeader = ({ title, children, maxWidth }: MainHeaderProps) => {
  return (
    <header className={`mb-4 bg-white ${maxWidth ? `max-w-${maxWidth}` : `max-w-full`} mx-auto`}>
      <Title level="main"> 
        {title ?? ""}
      </Title>
      { children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </header>
  );
};
export default MainHeader;
