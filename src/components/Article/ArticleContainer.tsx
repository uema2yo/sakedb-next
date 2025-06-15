import { ReactNode } from "react";

interface ArticleContainerProps {
  children: ReactNode;
  maxWidth?: string;
}

const ArticleContainer = ({ children, maxWidth }: ArticleContainerProps) => {
  return (
    <div className={`mb-4 bg-white ${maxWidth ? `max-w-${maxWidth}` : `max-w-full`} mx-auto`}>
      {children}
    </div>
  );
}
export default ArticleContainer;
