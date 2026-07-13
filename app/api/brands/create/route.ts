import { createBrandService, getBrandsService } from "@/services/createBrands/createBrands.services";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = await createBrandService(body);

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

export async function GET() {
  try {
    const result = await getBrandsService();

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