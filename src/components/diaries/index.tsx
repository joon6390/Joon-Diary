"use client";

import React, { useState } from "react";
import styles from "./styles.module.css";
import { SelectBox } from "@/commons/components/selectbox";
import { SearchBar } from "@/commons/components/searchbar";
import { Button } from "@/commons/components/button";
import Image from "next/image";

export default function Diaries() {
  const [selectedFilter, setSelectedFilter] = useState<string>("");

  const filterOptions = [
    { value: "all", label: "전체" },
    { value: "recent", label: "최신순" },
    { value: "oldest", label: "오래된순" },
  ];

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
  };

  const handleSearch = (value: string) => {
    console.log("검색:", value);
  };

  const handleWriteDiary = () => {
    console.log("일기쓰기 클릭");
  };

  return (
    <div className={styles.container}>
      <div className={styles.gap1} />
      <div className={styles.search}>
        <div className={styles.searchLeft}>
          <SelectBox
            options={filterOptions}
            value={selectedFilter}
            onChange={handleFilterChange}
            placeholder="전체"
            variant="primary"
            size="medium"
            theme="light"
            className={styles.selectbox}
          />
          <SearchBar
            variant="primary"
            size="medium"
            theme="light"
            placeholder="검색어를 입력해 주세요."
            onSearch={handleSearch}
            className={styles.searchbar}
          />
        </div>
        <Button
          variant="primary"
          size="large"
          theme="light"
          onClick={handleWriteDiary}
          className={styles.writeButton}
        >
          <Image
            src="/icons/plus_outline_light_m.svg"
            alt="add"
            width={24}
            height={24}
            className={styles.addIcon}
          />
          일기쓰기
        </Button>
      </div>
      <div className={styles.gap2} />
      <div className={styles.main} />
      <div className={styles.gap3} />
      <div className={styles.pagination} />
      <div className={styles.gap4} />
    </div>
  );
}
