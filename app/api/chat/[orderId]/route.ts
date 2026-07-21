import { getChatService } from "@/services/chat/chat.services";
import { NextRequest, NextResponse } from "next/server";



export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      orderId: string;
    }>;
  }
) {
  try {
    const { orderId } = await params;

    const data = await getChatService(
      orderId
    );

    return NextResponse.json({
      success: true,
      order: data.order,
      messages: data.messages,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to load chat.",
      },
      {
        status: 400,
      }
    );
  }
}