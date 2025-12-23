"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SelectBox } from "@/commons/components/selectbox";
import { useBindingHook } from "./hooks/index.binding.hook";
import styles from "./styles.module.css";

// 필터 옵션
const filterOptions = [
  { value: "default", label: "기본" },
  { value: "recent", label: "최신순" },
  { value: "oldest", label: "오래된순" },
];

export default function Pictures() {
  const [selectedFilter, setSelectedFilter] = useState<string>("default");
  const { dogs, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useBindingHook();
  const observerTarget = useRef<HTMLDivElement>(null);

  // 무한 스크롤: 마지막 2개만 남았을 때 추가 로드
  useEffect(() => {
    if (dogs.length < 2 || !hasNextPage || isFetchingNextPage) {
      return;
    }

    const currentTarget = observerTarget.current;
    if (!currentTarget) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px",
      }
    );

    observer.observe(currentTarget);

    return () => {
      observer.unobserve(currentTarget);
    };
  }, [dogs.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 스플래시 스크린 표시 여부 결정 (초기 로딩 중일 때만)
  const showSplash = isLoading && dogs.length === 0;

  return (
    <div className={styles.container} data-testid="pictures-container">
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
      <div className={styles.main} data-testid="pictures-main">
        {/* 스플래시 스크린: 초기 로딩 중일 때 6개 표시 */}
        {showSplash &&
          Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`splash-${index}`}
              className={styles.splashScreen}
              data-testid={`splash-screen-${index}`}
            />
          ))}

        {/* 강아지 이미지 목록 */}
        {dogs.map((dog, index) => (
          <div key={dog.id}>
            <div className={styles.imageWrapper}>
              <Image
                src={dog.src}
                alt={dog.alt}
                width={640}
                height={640}
                className={styles.image}
                data-testid={`dog-image-${dog.id}`}
                unoptimized
              />
            </div>
            {/* 무한 스크롤 감지용 타겟: 마지막에서 2번째 이미지 다음에 배치 */}
            {hasNextPage &&
              !isFetchingNextPage &&
              index === dogs.length - 2 && (
                <div
                  ref={observerTarget}
                  className={styles.scrollTarget}
                  data-testid="scroll-target"
                />
              )}
          </div>
        ))}

        {/* 다음 페이지 로딩 중 스플래시 스크린 */}
        {isFetchingNextPage &&
          Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`splash-next-${index}`}
              className={styles.splashScreen}
              data-testid={`splash-screen-next-${index}`}
            />
          ))}
      </div>
      <div className={styles.gap3} />
    </div>
  );
}
