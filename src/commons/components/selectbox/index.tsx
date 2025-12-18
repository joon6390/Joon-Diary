import React, { useState, useRef, useEffect } from "react";
import styles from "./styles.module.css";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectBoxProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  variant?: "primary" | "secondary" | "tertiary";
  size?: "small" | "medium" | "large";
  theme?: "light" | "dark";
  disabled?: boolean;
  className?: string;
}

export const SelectBox: React.FC<SelectBoxProps> = ({
  options,
  value,
  onChange,
  placeholder = "전체",
  variant = "primary",
  size = "medium",
  theme = "light",
  disabled = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (optionValue: string) => {
    if (onChange) {
      onChange(optionValue);
    }
    setIsOpen(false);
  };

  const selectClasses = [
    styles.selectbox,
    styles[variant],
    styles[size],
    styles[theme],
    disabled && styles.disabled,
    isOpen && styles.open,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const dropdownClasses = [
    styles.dropdown,
    styles[`dropdown-${size}`],
    styles[`dropdown-${theme}`],
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.wrapper} ref={selectRef}>
      <div className={selectClasses} onClick={handleToggle}>
        <div className={styles.content}>
          <span className={styles.text}>{displayText}</span>
          <div className={styles.icon}>
            <img
              src="/icons/arrow_drop_down.svg"
              alt="dropdown"
              className={styles.arrow}
            />
          </div>
        </div>
      </div>

      {isOpen && !disabled && (
        <div className={dropdownClasses}>
          {options.map((option) => (
            <div
              key={option.value}
              className={`${styles.option} ${
                value === option.value ? styles.selected : ""
              }`}
              onClick={() => handleSelect(option.value)}
            >
              <span className={styles.optionText}>{option.label}</span>
              {value === option.value && (
                <img
                  src="/icons/check_outline_light_xs.svg"
                  alt="selected"
                  className={styles.checkIcon}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectBox;

