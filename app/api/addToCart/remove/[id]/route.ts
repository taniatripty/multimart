import { removeCartItemService } from "@/services/addToCart/addToCart.services";
import { NextRequest, NextResponse } from "next/server";


interface RouteProps {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(
  req: NextRequest,
  { params }: RouteProps
) {
  try {
    const { id } = await params;

    const result = await removeCartItemService(id);

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
            : "Failed to remove cart item.",
      },
      {
        status: 400,
      }
    );
  }
}