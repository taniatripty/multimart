import { createAddressService, getAllAddressesService } from "@/services/address/address.services";
import { NextResponse } from "next/server";



export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = await createAddressService(body);

    return NextResponse.json(
      {
        success: true,
        message: "Address created successfully.",
        data: result,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to create address.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      {
        status: 400,
      }
    );
  }
}

export async function GET() {
  try {
    const addresses = await getAllAddressesService();

    return NextResponse.json(
      {
        success: true,
        message: "Addresses retrieved successfully.",
        data: addresses,
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
      { status: 500 }
    );
  }
}
