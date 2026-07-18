import { getMyWishlistService } from "@/services/wishlist/wishlist.services";
import { NextRequest, NextResponse } from "next/server";


interface Params {
  params: Promise<{
    userId: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: Params
) {
  try {
    const { userId } = await params;

    const result =
      await getMyWishlistService(userId);

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