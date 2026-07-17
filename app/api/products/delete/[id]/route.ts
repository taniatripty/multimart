import { deleteProductService } from "@/services/products/products.services";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await params;

    const body = await request.json();

    const result = await deleteProductService(
      id,
      body.status
    );

    return NextResponse.json(result, {
      status: result.status,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        status: 500,
        message: "Internal server error.",
      },
      {
        status: 500,
      }
    );
  }
}