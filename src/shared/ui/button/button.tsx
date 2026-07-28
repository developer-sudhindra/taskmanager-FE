import { type ReactNode, type FC } from "react";
interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  variant: "primary" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg" | "full";
}
export const Button: FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  type = "button",
  variant = "primary",
  size = "sm",
}) => {
  const base = "text-sm font-medium transition";

  const variants = {
    primary: "bg-primary text-white hover:opacity-90",
    secondary: "bg-secondary text-white hover:opacity-90",
    outline: "border border-border text-text hover:bg-surface",
    danger: "bg-danger text-white hover:opacity-90",
  };

  const buttonSize = {
    sm: "h-8 px-3 text-sm rounded-md",
    md: "h-10 px-4 text-base rounded-md",
    lg: "h-12 px-6 text-lg rounded-lg",
    full: "w-full h-10 px-4 text-base rounded-md",
  };

  const disabledStyle = "opacity-50 cursor-not-allowed";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`${base} ${variants[variant]} ${buttonSize[size]} ${disabled ? disabledStyle : ""}`}
    >
      {children}
    </button>
  );
};
