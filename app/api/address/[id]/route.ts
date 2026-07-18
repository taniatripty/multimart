
import { getSingleAddressService } from "@/services/address/address.services";
import { NextRequest, NextResponse } from "next/server";


export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log(id)

    const address = await getSingleAddressService(id);

    return NextResponse.json(
      {
        success: true,
        message: "Address retrieved successfully.",
        data: address,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Something went wrong.",
      },
      { status: 404 }
    );
  }
}

