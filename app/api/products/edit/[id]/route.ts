import { NextRequest, NextResponse } from "next/server";

import { updateProductService } from "@/services/products/editProdut/editproduct.services";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
   

   

    const productId = params.id;

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product ID is required." },
        { status: 400 }
      );
    }

    const body = await req.json();

    // Map frontend fields to service payload
    const payload = {
      name: body.name,
      shortDescription: body.shortDescription,
      description: body.description,
      
      subcategory: body.subcategory,
      
      price: body.price,
      discount: body.discount,
      stock: body.stock,
      thumbnail: body.thumbnail,
      colors: body.colors,
      sizes: body.sizes,
      features: body.features,
      active: body.active,
     sellerId:body.id
    };

    const result = await updateProductService(productId, payload);

    return NextResponse.json(
      { success: true, data: result },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Update product error:", error);

    const message =
      error instanceof Error ? error.message : "Failed to update product.";

    return NextResponse.json(
      { success: false, message },
      { status: 400 }
    );
  }
}