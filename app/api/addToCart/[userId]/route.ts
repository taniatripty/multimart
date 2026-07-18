import { getMyCartService } from "@/services/addToCart/addToCart.services";
import { NextRequest, NextResponse } from "next/server";


interface Params {
  params: Promise<{
    userId: string;
  }>;
}

export async function GET(
  req: NextRequest,
  { params }: Params
) {
  try {
    const { userId } = await params;

    const result = await getMyCartService(userId);

    return NextResponse.json(result, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch cart.",
      },
      {
        status: 400,
      }
    );
  }
}