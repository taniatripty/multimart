import { getSellerOrdersService } from "@/services/orders/sellerOrders/sellerorders.services";
import { NextRequest, NextResponse } from "next/server";

interface RouteProps {
  params: Promise<{
    sellerId: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteProps) {
  try {
    const { sellerId } = await params;

    const orders = await getSellerOrdersService(sellerId);

    return NextResponse.json({
      success: true,
      message: "Seller orders fetched successfully.",
      data: orders,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch seller orders.",
      },
      {
        status: 400,
      },
    );
  }
}
