import type { ReactNode, FC } from "react";
interface IErrorMessageProps {
  children: ReactNode;
}
export const ErrorMessages: FC<IErrorMessageProps> = ({ children }) => {
  if (!children) return null;
  return <span className="text-red-700 text-sm">{children}</span>;
};
