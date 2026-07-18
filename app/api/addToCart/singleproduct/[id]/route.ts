import { getSingleCartItemService } from "@/services/addToCart/addToCart.services";
import { NextRequest, NextResponse } from "next/server";



interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: Params
) {
  try {
    const { id } = await params;

    const cart = await getSingleCartItemService(id);

    return NextResponse.json(
      {
        success: true,
        message: "Cart item fetched successfully.",
        data: cart,
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
            : "Failed to fetch cart item.",
      },
      {
        status: 400,
      }
    );
  }
}