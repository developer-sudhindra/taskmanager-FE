import { type ReactNode, type FC } from "react";
interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  variant: "primary" | "secondary" | "outline" | "danger";
}
export const Button: FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  type = "button",
  variant = "primary",
}) => {
  const base = "px-4 py-2 rounded-md text-sm font-medium transition";

  const variants = {
    primary: "bg-primary text-white hover:opacity-90",
    secondary: "bg-secondary text-white hover:opacity-90",
    outline: "border border-border text-text hover:bg-surface",
    danger: "bg-danger text-white hover:opacity-90",
  };

  const disabledStyle = "opacity-50 cursor-not-allowed";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`${base} ${variants[variant]} ${disabled ? disabledStyle : ""}`}
    >
      {children}
    </button>
  );
};
