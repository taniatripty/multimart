import { updateOrderStatusService } from "@/services/sellerOrders/sellerorders.services";
import { NextRequest, NextResponse } from "next/server";



interface RouteProps {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteProps
) {
  try {
    const { id } = await params;

    const body = await request.json();

    const result = await updateOrderStatusService(
      id,
      body.orderStatus
    );

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update order status.",
      },
      {
        status: 400,
      }
    );
  }
}