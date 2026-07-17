import { updateProductService } from "@/services/products/editProdut/editproduct.services";
import { NextRequest, NextResponse } from "next/server";


export async function PUT(
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

    const result = await updateProductService(id, body);

    return NextResponse.json(result, {
      status: result.status,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        status: 500,
        message:
          error instanceof Error
            ? error.message
            : "Internal server error.",
      },
      {
        status: 500,
      }
    );
  }
}