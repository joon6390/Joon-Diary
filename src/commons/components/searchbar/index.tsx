import React, { useRef } from "react";
import Image from "next/image";
import styles from "./styles.module.css";

export interface SearchBarProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: "primary" | "secondary" | "tertiary";
  size?: "small" | "medium" | "large";
  theme?: "light" | "dark";
  onSearch?: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  variant = "primary",
  size = "medium",
  theme = "light",
  className,
  disabled,
  placeholder = "검색어를 입력해 주세요.",
  onSearch,
  onChange,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { "data-testid": dataTestId, ...inputProps } = rest as {
    "data-testid"?: string;
    [key: string]: unknown;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(e.currentTarget.value);
    }
  };

  const handleIconClick = () => {
    if (onSearch && !disabled && inputRef.current) {
      onSearch(inputRef.current.value);
    }
  };

  const containerClasses = [
    styles.searchbar,
    styles[variant],
    styles[size],
    styles[theme],
    disabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const iconSize = size === "small" ? 16 : size === "large" ? 28 : 24;

  return (
    <div className={containerClasses} data-testid={dataTestId}>
      <div
        className={styles.iconWrapper}
        onClick={handleIconClick}
        style={{ cursor: disabled ? "not-allowed" : "pointer" }}
      >
        <Image
          src="/icons/search_outline_light_m.svg"
          alt="search"
          width={iconSize}
          height={iconSize}
          className={styles.searchIcon}
        />
      </div>
      <input
        ref={inputRef}
        className={styles.input}
        disabled={disabled}
        placeholder={placeholder}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        {...inputProps}
      />
    </div>
  );
};

export default SearchBar;
