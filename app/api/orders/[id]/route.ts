import { getSingleOrderService } from "@/services/orders/orders.services";
import { updateOrderStatusService } from "@/services/orders/sellerOrders/sellerorders.services";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await params;

    const order = await getSingleOrderService(
      id
    );

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch order.",
      },
      {
        status: 400,
      }
    );
  }
}

interface RouteProps {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(request: NextRequest, { params }: RouteProps) {
  try {
    const { id } = await params;

    const body = await request.json();

    const result = await updateOrderStatusService(id, body.orderStatus);

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
      },
    );
  }
}
