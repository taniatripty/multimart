import { getUserAddressService } from "@/services/address/address.services";
import { NextRequest, NextResponse } from "next/server";


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    const address = await getUserAddressService(userId);

    return NextResponse.json({
      success: true,
      data: address,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch address.",
      },
      {
        status: 400,
      }
    );
  }
}