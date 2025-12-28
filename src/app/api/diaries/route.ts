import { NextRequest, NextResponse } from "next/server";
import { DiaryData } from "@/components/diaries/hooks/index.binding.hook";
import { supabase } from "@/commons/lib/supabase";

/**
 * 일기 목록 조회
 */
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("diaries")
      .select("*")
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("일기 조회 중 오류:", error);
      return NextResponse.json(
        { error: "일기 조회에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ diaries: data || [] });
  } catch (error) {
    console.error("일기 조회 중 오류:", error);
    return NextResponse.json(
      { error: "일기 조회에 실패했습니다." },
      { status: 500 }
    );
  }
}

/**
 * 일기 생성
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from("diaries")
      .insert({
        title: body.title,
        content: body.content,
        emotion: body.emotion,
        userId: body.userId,
        userName: body.userName,
      })
      .select()
      .single();

    if (error) {
      console.error("일기 생성 중 오류:", error);
      return NextResponse.json(
        { error: "일기 생성에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json(data as DiaryData, { status: 201 });
  } catch (error) {
    console.error("일기 생성 중 오류:", error);
    return NextResponse.json(
      { error: "일기 생성에 실패했습니다." },
      { status: 500 }
    );
  }
}

/**
 * 일기 수정
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from("diaries")
      .update({
        title: body.title,
        content: body.content,
        emotion: body.emotion,
        // userId와 userName은 업데이트하지 않음 (기존 값 유지)
      })
      .eq("id", body.id)
      .select()
      .single();

    if (error) {
      console.error("일기 수정 중 오류:", error);
      return NextResponse.json(
        { error: "일기 수정에 실패했습니다." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "일기를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(data as DiaryData);
  } catch (error) {
    console.error("일기 수정 중 오류:", error);
    return NextResponse.json(
      { error: "일기 수정에 실패했습니다." },
      { status: 500 }
    );
  }
}

/**
 * 일기 삭제
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get("id") || "0");

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "유효하지 않은 ID입니다." },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("diaries").delete().eq("id", id);

    if (error) {
      console.error("일기 삭제 중 오류:", error);
      return NextResponse.json(
        { error: "일기 삭제에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("일기 삭제 중 오류:", error);
    return NextResponse.json(
      { error: "일기 삭제에 실패했습니다." },
      { status: 500 }
    );
  }
}
