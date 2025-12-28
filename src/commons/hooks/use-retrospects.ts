"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RetrospectData } from "@/components/diaries-detail/hooks/index.retrospect.form.hook";

/**
 * 회고 목록 조회 Hook
 */
export function useRetrospects(diaryId?: number) {
  return useQuery({
    queryKey: ["retrospects", diaryId],
    queryFn: async () => {
      const url = diaryId
        ? `/api/retrospects?diaryId=${diaryId}`
        : "/api/retrospects";
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error("회고 조회에 실패했습니다.");
      }

      const data = await res.json();
      return (data.retrospects || []) as RetrospectData[];
    },
    enabled: diaryId !== undefined,
  });
}

/**
 * 회고 생성 Hook
 */
export function useCreateRetrospect() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      retrospect: Omit<RetrospectData, "id" | "createdAt">
    ) => {
      const res = await fetch("/api/retrospects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(retrospect),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "회고 생성에 실패했습니다.");
      }

      return (await res.json()) as RetrospectData;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["retrospects", variables.diaryId],
      });
    },
  });
}

