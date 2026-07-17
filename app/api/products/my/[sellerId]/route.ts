import { getMyProductsService } from "@/services/products/products.services";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ sellerId: string }>;
  }
) {
  try {
    const { sellerId } = await params;

    const result =
      await getMyProductsService(sellerId);

    return NextResponse.json(result, {
      status: result.status,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error.",
      },
      {
        status: 500,
      }
    );
  }
}