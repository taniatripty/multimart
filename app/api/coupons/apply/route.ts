import { applyCouponService } from "@/services/coupons/applycoupons.services";
import { NextRequest, NextResponse } from "next/server";



export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const coupon = await applyCouponService(body);

    return NextResponse.json({
      success: true,
      message: "Coupon applied successfully.",
      data: coupon,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to apply coupon.",
      },
      {
        status: 400,
      }
    );
  }
}