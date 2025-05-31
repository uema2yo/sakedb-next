import { ReactNode } from "react";

interface TitleProps {
  children: string | JSX.Element;
  level: string;
}

const Title = ({ children, level }: TitleProps) => {
  const levels:{[key: string]: JSX.Element } = {
    "top": (
      <h1 className="font-bold text-3xl">{children}</h1>
    ),
    "main": (
      <h2 className="font-bold text-2xl">{children}</h2>
    ),
    "article": (
      <h3 className="font-bold text-xl">{children}</h3>
    )     
  }
  const element = levels[level];

  return (
    <>
    {element}
    </>
  );
}

export default Title;
