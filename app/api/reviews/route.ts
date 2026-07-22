import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { createReviewService } from "@/services/reviews/reviews.services";



export async function POST(req: NextRequest) {
  try {
   

    const body = await req.json();

    const {
      productId,
      orderId,
      sellerId,
      userId,
      rating,
      review,
    } = body;

    if (!productId || !orderId) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields.",
        },
        {
          status: 400,
        },
      );
    }

  

    

    
    const result = await createReviewService(body);

    return NextResponse.json({
      success: true,
      message: "Review submitted successfully.",
      insertedId: result.insertedId,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      },
      {
        status: 500,
      },
    );
  }
}