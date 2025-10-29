import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const GET = async (request: NextRequest) => {
  try {
    const supabase = await createClient();

    // 获取当前用户
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({
        error: "未授权",
        success: false,
      }, { status: 401 });
    }

    // 获取用户的聊天记录
    const { data: chats, error: chatsError } = await supabase
      .from("chats")
      .select("*")
      .eq("user_id", user.id)
      .eq("model", "Deepseek")
      .order("created_at", { ascending: false })
      .limit(10);

    if (chatsError) {
      console.error("获取聊天记录失败:", chatsError);
      return NextResponse.json({
        error: "获取聊天记录失败",
        success: false,
      }, { status: 500 });
    }

    // 手动获取每个聊天的交易记录
    const chatsWithTradings = await Promise.all(
      (chats || []).map(async (chat) => {
        const { data: tradings } = await supabase
          .from("tradings")
          .select("*")
          .eq("chat_id", chat.id)
          .order("created_at", { ascending: false })
          .limit(10);

        return {
          ...chat,
          tradings: tradings || [],
        };
      })
    );

    return NextResponse.json({
      data: chatsWithTradings,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json({
      error: "服务器错误",
      success: false,
    }, { status: 500 });
  }
};
