import { createCouponService } from "@/services/coupons/coupons.services";
import { NextRequest, NextResponse } from "next/server";



export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    await createCouponService(body);

    return NextResponse.json({
      success: true,
      message: "Coupon created successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create coupon.",
      },
      {
        status: 400,
      }
    );
  }
}