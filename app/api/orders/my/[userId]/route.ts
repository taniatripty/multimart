import { getMyOrdersService } from "@/services/orders/userOrders/userorders.services";
import { NextRequest, NextResponse } from "next/server";

interface RouteProps {
  params: Promise<{
    userId: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteProps) {
  try {
    const { userId } = await params;

    const orders = await getMyOrdersService(userId);

    return NextResponse.json({
      success: true,
      message: "Orders fetched successfully.",
      data: orders,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch orders.",
      },
      {
        status: 400,
      },
    );
  }
}
