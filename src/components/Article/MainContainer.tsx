import React, { ReactNode } from "react";

type MainContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
  children: ReactNode;
  className?: string;
}

const MainContainer = React.forwardRef<HTMLDivElement, MainContainerProps>(({ children, className, ...props }, ref) => {
  return (
    <div ref={ref} className={`mb-4 bg-white ${className ?? ""}`} {...props}>
      {children}
    </div>
  );
});
MainContainer.displayName = "MainContainer";

export default MainContainer;
