import React from "react";
import Image from "next/image";
import styles from "./styles.module.css";

export interface PaginationProps {
  variant?: "primary" | "secondary" | "tertiary";
  size?: "small" | "medium" | "large";
  theme?: "light" | "dark";
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  variant = "primary",
  size = "medium",
  theme = "light",
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
}) => {
  const containerClasses = [
    styles.pagination,
    styles[variant],
    styles[size],
    styles[theme],
  ]
    .filter(Boolean)
    .join(" ");

  const pageButtonClasses = (page: number) =>
    [
      styles.pageButton,
      styles[variant],
      styles[size],
      styles[theme],
      page === currentPage && styles.active,
    ]
      .filter(Boolean)
      .join(" ");

  const navButtonClasses = (disabled: boolean) =>
    [
      styles.navButton,
      styles[variant],
      styles[size],
      styles[theme],
      disabled && styles.disabled,
    ]
      .filter(Boolean)
      .join(" ");

  const getVisiblePages = () => {
    const pages: number[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();
  const isPrevDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= totalPages;

  const handlePrevClick = () => {
    if (!isPrevDisabled) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (!isNextDisabled) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className={containerClasses}>
      <button
        className={navButtonClasses(isPrevDisabled)}
        onClick={handlePrevClick}
        disabled={isPrevDisabled}
        aria-label="이전 페이지"
      >
        <Image
          src={
            isPrevDisabled
              ? "/icons/leftdisabled_outline_light_m.svg"
              : "/icons/leftenable_outline_light_m.svg"
          }
          alt="이전"
          width={24}
          height={24}
          className={styles.icon}
        />
      </button>

      <div className={styles.pageNumbers}>
        {visiblePages.map((page) => (
          <button
            key={page}
            className={pageButtonClasses(page)}
            onClick={() => onPageChange(page)}
            aria-label={`페이지 ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        className={navButtonClasses(isNextDisabled)}
        onClick={handleNextClick}
        disabled={isNextDisabled}
        aria-label="다음 페이지"
      >
        <Image
          src={
            isNextDisabled
              ? "/icons/rightdisabled_outline_light_m.svg"
              : "/icons/rightenable_outline_light_m.svg"
          }
          alt="다음"
          width={24}
          height={24}
          className={styles.icon}
        />
      </button>
    </div>
  );
};

export default Pagination;
