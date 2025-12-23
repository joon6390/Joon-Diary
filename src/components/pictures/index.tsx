"use client";

import { useState } from "react";
import Image from "next/image";
import { SelectBox } from "@/commons/components/selectbox";
import styles from "./styles.module.css";

// Mock 데이터: 강아지 사진 목록 (10개)
const mockDogImages = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  src: "/images/dog-1.jpg",
  alt: `강아지 사진 ${index + 1}`,
}));

// 필터 옵션
const filterOptions = [
  { value: "default", label: "기본" },
  { value: "recent", label: "최신순" },
  { value: "oldest", label: "오래된순" },
];

export default function Pictures() {
  const [selectedFilter, setSelectedFilter] = useState<string>("default");

  return (
    <div className={styles.container}>
      <div className={styles.gap1} />
      <div className={styles.filter}>
        <SelectBox
          options={filterOptions}
          value={selectedFilter}
          onChange={setSelectedFilter}
          placeholder="기본"
          variant="primary"
          theme="light"
          size="medium"
          className={styles.selectbox}
        />
      </div>
      <div className={styles.gap2} />
      <div className={styles.main}>
        {mockDogImages.map((image) => (
          <div key={image.id} className={styles.imageWrapper}>
            <Image
              src={image.src}
              alt={image.alt}
              width={640}
              height={640}
              className={styles.image}
            />
          </div>
        ))}
      </div>
      <div className={styles.gap3} />
    </div>
  );
}
