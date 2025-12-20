import React from "react";
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(e.currentTarget.value);
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
    <div className={containerClasses}>
      <div className={styles.iconWrapper}>
        <Image
          src="/icons/search_outline_light_m.svg"
          alt="search"
          width={iconSize}
          height={iconSize}
          className={styles.searchIcon}
        />
      </div>
      <input
        className={styles.input}
        disabled={disabled}
        placeholder={placeholder}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        {...rest}
      />
    </div>
  );
};

export default SearchBar;



