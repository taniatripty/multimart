import { createChatService } from "@/services/chat/chat.services";
import { NextRequest, NextResponse } from "next/server";



export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();

    const data = await createChatService(body);

    return NextResponse.json({
      success: true,
      data,
      message: "Message sent successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to send message.",
      },
      {
        status: 400,
      }
    );
  }
}