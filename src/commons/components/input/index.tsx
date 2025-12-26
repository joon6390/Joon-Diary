import React from "react";
import styles from "./styles.module.css";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: "primary" | "secondary" | "tertiary";
  size?: "small" | "medium" | "large";
  theme?: "light" | "dark";
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = "primary",
      size = "medium",
      theme = "light",
      className,
      disabled,
      value,
      ...rest
    },
    ref
  ) => {
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

    return (
      <input
        ref={ref}
        className={inputClasses}
        disabled={disabled}
        value={value ?? ""}
        {...rest}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;




