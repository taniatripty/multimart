import { createOrderService, getAllOrdersService } from "@/services/orders/orders.services";

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



export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User id is required.",
        },
        { status: 400 }
      );
    }

    const orders = await getAllOrdersService(userId);

    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch orders.",
      },
      { status: 403 }
    );
  }
}