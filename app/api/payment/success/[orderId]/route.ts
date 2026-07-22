import { updatePaymentService } from "@/services/payment/payment.services";
import { NextRequest, NextResponse } from "next/server";



export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    const body = await request.json();

    const result = await updatePaymentService({
      orderId,
      transactionId: body.transactionId,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Payment update failed.",
      },
      {
        status: 500,
      }
    );
  }
}