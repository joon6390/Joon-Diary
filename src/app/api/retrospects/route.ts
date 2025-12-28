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

/**
 * 회고 수정
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, content } = body;

    if (!id || !content) {
      return NextResponse.json(
        { error: "ID와 내용은 필수입니다." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("retrospects")
      .update({ content })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("회고 수정 중 오류:", error);
      return NextResponse.json(
        { error: "회고 수정에 실패했습니다." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "회고를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(data as RetrospectData);
  } catch (error) {
    console.error("회고 수정 중 오류:", error);
    return NextResponse.json(
      { error: "회고 수정에 실패했습니다." },
      { status: 500 }
    );
  }
}

/**
 * 회고 삭제
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

    const { error } = await supabase.from("retrospects").delete().eq("id", id);

    if (error) {
      console.error("회고 삭제 중 오류:", error);
      return NextResponse.json(
        { error: "회고 삭제에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("회고 삭제 중 오류:", error);
    return NextResponse.json(
      { error: "회고 삭제에 실패했습니다." },
      { status: 500 }
    );
  }
}
