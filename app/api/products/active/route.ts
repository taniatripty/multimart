import { getallActiveProductsService } from "@/services/products/products.services";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result =
      await getallActiveProductsService();

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