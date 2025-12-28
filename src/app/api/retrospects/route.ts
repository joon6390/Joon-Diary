import { NextRequest, NextResponse } from "next/server";
import { RetrospectData } from "@/components/diaries-detail/hooks/index.retrospect.form.hook";
import { supabase } from "@/commons/lib/supabase";

/**
 * 회고 목록 조회
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const diaryId = searchParams.get("diaryId");

    let query = supabase.from("retrospects").select("*");

    // diaryId가 있으면 필터링
    if (diaryId) {
      query = query.eq("diaryId", parseInt(diaryId));
    }

    query = query.order("createdAt", { ascending: true });

    const { data, error } = await query;

    if (error) {
      console.error("회고 조회 중 오류:", error);
      return NextResponse.json(
        { error: "회고 조회에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ retrospects: data || [] });
  } catch (error) {
    console.error("회고 조회 중 오류:", error);
    return NextResponse.json(
      { error: "회고 조회에 실패했습니다." },
      { status: 500 }
    );
  }
}

/**
 * 회고 생성
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from("retrospects")
      .insert({
        content: body.content,
        diaryId: body.diaryId,
        userId: body.userId,
        userName: body.userName,
      })
      .select()
      .single();

    if (error) {
      console.error("회고 생성 중 오류:", error);
      return NextResponse.json(
        { error: "회고 생성에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json(data as RetrospectData, { status: 201 });
  } catch (error) {
    console.error("회고 생성 중 오류:", error);
    return NextResponse.json(
      { error: "회고 생성에 실패했습니다." },
      { status: 500 }
    );
  }
}

