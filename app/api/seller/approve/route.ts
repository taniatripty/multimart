

import { getAllApproveSellerService } from "@/services/user/user.services";
import { NextResponse } from "next/server";



export async function GET() {
  try {
    const result = await getAllApproveSellerService();

    return NextResponse.json(
      {
        success: result.success,
        message: result.message,
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