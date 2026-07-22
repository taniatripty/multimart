import { createPaymentIntentService } from "@/services/payment/payment.services";
import { NextRequest, NextResponse } from "next/server";



export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const clientSecret =
      await createPaymentIntentService(body.amount);

    return NextResponse.json(
      {
        success: true,
        clientSecret,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create payment intent.",
      },
      {
        status: 500,
      }
    );
  }
}