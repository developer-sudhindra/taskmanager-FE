import type { ReactNode, FC } from "react";
interface FormWrapper {
  children: ReactNode;
}
export const FormWrapper: FC<FormWrapper> = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center w-svw h-dvh">
      <div className="w-[400px] border border-surface rounded p-4">
        {children}
      </div>
    </div>
  );
};
