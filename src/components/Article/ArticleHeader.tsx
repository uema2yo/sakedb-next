import React, { ReactNode } from "react";
import Title from "../Article/Title";

interface ArticleHeaderProps {
  title?: string;
  children?: ReactNode;
  maxWidth?: string;
}

const ArticleHeader = ({ title, children, maxWidth }: ArticleHeaderProps) => {
  return (
    <header className={`mb-4 bg-white ${maxWidth ? `max-w-${maxWidth}` : `max-w-full`} mx-auto`}>
      <Title level="article"> 
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
export default ArticleHeader;
