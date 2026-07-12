import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import { becomeSellerService } from "@/services/seller/seller.services";



export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const body = await req.json();

    const result = await becomeSellerService({
      email: session.user.email,
      shopName: body.shopName,
      phone: body.phone,
      address: body.address,
      website: body.website,
      description: body.description,
    });

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