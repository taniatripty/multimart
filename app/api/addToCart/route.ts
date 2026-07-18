import { addToCartService } from "@/services/addToCart/addToCart.services";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = await addToCartService(body);

    return NextResponse.json(result, {
      status: 201,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to add product to cart.",
      },
      {
        status: 400,
      }
    );
  }
}