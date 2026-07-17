import { collectionNames, getCollection } from "@/lib/dbConnect";
import { SellerStatus, UserRole } from "@/lib/types";
import { ObjectId } from "mongodb";


export type UpdateProductPayload = {
  name?: string;
  shortDescription?: string;
  description?: string;
  category?: string;

  subcategory?: string;
  
  brandId?:string,
  salePrice?:number,
  price?: number;
  discount?: number;
  stock?: number;
  thumbnail?: string;
  colors?: string[];
  sizes?: string[];
  features?: string[];
  active?: boolean; // if you want to control visibility separately
  seller: string; // seller ID (string)
};

export async function updateProductService(
  productId: string,
  payload: UpdateProductPayload
) {
  const productCollection = await getCollection(collectionNames.PRODUCTS);
  const userCollection = await getCollection(collectionNames.TEST_USER);

  const productObjectId = new ObjectId(productId);
  const existingProduct = await productCollection.findOne({
    _id: productObjectId,
  });

  if (!existingProduct) {
    throw new Error("Product not found.");
  }

  // Ensure seller ownership
  if (existingProduct.sellerId !== payload.seller) {
    throw new Error("You are not authorized to update this product.");
  }

  const seller = await userCollection.findOne({
    _id: new ObjectId(payload.seller),
  });

  if (!seller) {
    throw new Error("Seller account not found.");
  }

  if (seller.role !== UserRole.SELLER) {
    throw new Error("Only registered sellers can update products.");
  }

  if (seller.sellerStatus !== SellerStatus.APPROVED) {
    throw new Error(
      "Your seller account has not been approved yet. Please wait for admin approval before updating products."
    );
  }

  // Build update object only with provided fields
  const updateDoc: Partial<UpdateProductPayload & { updatedAt: Date }> = {
    updatedAt: new Date(),
  };

  if (payload.name !== undefined) {
    if (!payload.name.trim()) {
      throw new Error("Product name cannot be empty.");
    }
    updateDoc.name = payload.name;
  }

  if (payload.shortDescription !== undefined) {
    updateDoc.shortDescription = payload.shortDescription || "";
  }

  if (payload.description !== undefined) {
    updateDoc.description = payload.description || "";
  }

 

  if (payload.subcategory !== undefined) {
    updateDoc.subcategory = payload.subcategory || "";
  }

  

  if (payload.price !== undefined) {
    if (payload.price <= 0) {
      throw new Error("Price must be greater than 0.");
    }
    updateDoc.price = payload.price;
  }

  if (payload.discount !== undefined) {
    if (payload.discount < 0 || payload.discount > 100) {
      throw new Error("Discount must be between 0 and 100.");
    }
    updateDoc.discount = payload.discount;
  }

  if (payload.stock !== undefined) {
    if (payload.stock < 0) {
      throw new Error("Stock cannot be negative.");
    }
    updateDoc.stock = payload.stock;
  }

  if (payload.thumbnail !== undefined) {
    updateDoc.thumbnail = payload.thumbnail || "";
  }

  if (payload.colors !== undefined) {
    updateDoc.colors = payload.colors || [];
  }

  if (payload.sizes !== undefined) {
    updateDoc.sizes = payload.sizes || [];
  }

  if (payload.features !== undefined) {
    updateDoc.features = payload.features || [];
  }

  if (payload.active !== undefined) {
    // If you have a separate `active` field; otherwise ignore or map to status
    updateDoc.active = payload.active;
  }

  // Recalculate salePrice if price/discount changed
  const currentPrice =
    updateDoc.price ?? (existingProduct.price as number);
  const currentDiscount =
    updateDoc.discount ?? (existingProduct.discount as number);

  const salePrice =
    currentDiscount > 0
      ? Number(
          (
            currentPrice -
            currentPrice * (currentDiscount / 100)
          ).toFixed(2)
        )
      : currentPrice;

  updateDoc.salePrice = salePrice;

  const result = await productCollection.updateOne(
    { _id: productObjectId },
    { $set: updateDoc }
  );

  if (result.modifiedCount === 0 && result.matchedCount === 0) {
    throw new Error("Failed to update product.");
  }

  return {
    success: true,
    productId,
  };
}