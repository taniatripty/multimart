import { createOrderService } from "@/services/userOrders/userorders.services";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const order = await createOrderService(body);

    return NextResponse.json({
      success: true,
      message: "Order created successfully.",
      data: order,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to create order.",
      },
      {
        status: 400,
      },
    );
  }
}
