import { createProductService, getProductsService } from "@/services/products/products.services";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = await createProductService(body);

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully.",
        data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Product Error:", error);

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

export async function GET() {
  try {
    const result =
      await getProductsService();

    return NextResponse.json(
      {
        success: result.success,
        data: result.data,
      },
      {
        status: result.status,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}