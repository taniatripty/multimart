import { NextRequest, NextResponse } from "next/server";

import { SellerStatus } from "@/lib/types";
import { updateSellerStatusService } from "@/services/seller/seller.services";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(
  request: NextRequest,
  { params }: Params
) {
  try {
    const { id } = await params;

    const body = await request.json();

    const { status } = body;

    if (
      status !== SellerStatus.APPROVED &&
      status !== SellerStatus.REJECTED
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid status.",
        },
        {
          status: 400,
        }
      );
    }

    const result = await updateSellerStatusService(
      id,
      status
    );

    return NextResponse.json(
      {
        success: result.success,
        message: result.message,
      },
      {
        status: result.status,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}