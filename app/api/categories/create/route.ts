import { createCategoryService } from "@/services/createCategory/createCategory.services";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = await createCategoryService(body);

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