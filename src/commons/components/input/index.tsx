import React from "react";
import styles from "./styles.module.css";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: "primary" | "secondary" | "tertiary";
  size?: "small" | "medium" | "large";
  theme?: "light" | "dark";
}

export const Input: React.FC<InputProps> = ({
  variant = "primary",
  size = "medium",
  theme = "light",
  className,
  disabled,
  ...rest
}) => {
  const inputClasses = [
    styles.input,
    styles[variant],
    styles[size],
    styles[theme],
    disabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <input className={inputClasses} disabled={disabled} {...rest} />;
};

export default Input;




