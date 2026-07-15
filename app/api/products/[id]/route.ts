import { getSingleProductService, updateProductStatusService } from "@/services/products/products.services";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    const result = await getSingleProductService(id);

    return NextResponse.json(
      {
        success: result.success,
        message: result.message,
        data: result.data ?? null,
      },
      {
        status: result.status,
      }
    );
  } catch (error) {
    console.error("Get Product Error:", error);

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

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    const body = await req.json();

    const result = await updateProductStatusService(
      id,
      body.status
    );

    return NextResponse.json(
      {
        success: result.success,
        message: result.message,
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