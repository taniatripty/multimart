import { collectionNames, getCollection } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export interface UpdateProductPayload {
  name?: string;
  shortDescription?: string;
  description?: string;

  category?: string;
  subcategory?: string;

  brand?: string;

  price?: number;
  discount?: number;
  stock?: number;

  thumbnail?: string;

  colors?: string[];
  sizes?: string[];
  features?: string[];
}

interface ProductDocument {
  _id?: ObjectId;

  name: string;
  shortDescription: string;
  description: string;

  categoryId: string;
  subcategory: string;

  brandId: string;

  sellerId: string;
  storeId?: string;

  price: number;
  discount: number;
  salePrice: number;

  stock: number;

  thumbnail: string;

  colors: string[];
  sizes: string[];
  features: string[];

  status: string;

  averageRating: number;
  totalReviews: number;
  totalSold: number;
  views: number;

  createdAt: Date;
  updatedAt: Date;
}

export async function updateProductService(
  id: string,
  payload: UpdateProductPayload
) {
  if (!ObjectId.isValid(id)) {
    return {
      success: false,
      status: 400,
      message: "Invalid product id.",
    };
  }

  const productCollection =
    await getCollection<ProductDocument>(
      collectionNames.PRODUCTS
    );

  const product = await productCollection.findOne({
    _id: new ObjectId(id),
  });

  if (!product) {
    return {
      success: false,
      status: 404,
      message: "Product not found.",
    };
  }

  const updateData: Partial<ProductDocument> = {};

  if (payload.name !== undefined)
    updateData.name = payload.name.trim();

  if (payload.shortDescription !== undefined)
    updateData.shortDescription =
      payload.shortDescription;

  if (payload.description !== undefined)
    updateData.description =
      payload.description;

  if (payload.category !== undefined)
    updateData.categoryId = payload.category;

  if (payload.subcategory !== undefined)
    updateData.subcategory =
      payload.subcategory;

  if (payload.brand !== undefined)
    updateData.brandId = payload.brand;

  if (payload.price !== undefined)
    updateData.price = payload.price;

  if (payload.discount !== undefined)
    updateData.discount = payload.discount;

  if (payload.stock !== undefined)
    updateData.stock = payload.stock;

  if (payload.thumbnail !== undefined)
    updateData.thumbnail = payload.thumbnail;

  if (payload.colors !== undefined)
    updateData.colors = payload.colors;

  if (payload.sizes !== undefined)
    updateData.sizes = payload.sizes;

  if (payload.features !== undefined)
    updateData.features = payload.features;

  // Recalculate sale price
  const price =
    updateData.price ?? product.price;

  const discount =
    updateData.discount ?? product.discount;

  updateData.salePrice =
    discount > 0
      ? Number(
          (
            price -
            price * (discount / 100)
          ).toFixed(2)
        )
      : price;

  updateData.updatedAt = new Date();

  await productCollection.updateOne(
    {
      _id: new ObjectId(id),
    },
    {
      $set: updateData,
    }
  );

  return {
    success: true,
    status: 200,
    message: "Product updated successfully.",
  };
}