

import { collectionNames, getCollection } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export interface AddToWishlistPayload {
  userId: string;
  productId: string;
}

interface WishlistDocument {
  _id?: ObjectId;

  userId: string;
  productId: string;

  sellerId: string;

  productName: string;
  thumbnail: string;

  price: number;
  salePrice: number;

  stock: number;

  createdAt: Date;
  updatedAt: Date;
}

interface ProductDocument {
  _id?: ObjectId;

  sellerId: string;

  name: string;
  thumbnail: string;

  price: number;
  salePrice: number;

  stock: number;

  status: string;
}

export async function addToWishlistService(
  payload: AddToWishlistPayload
) {
  if (!ObjectId.isValid(payload.userId)) {
    return {
      success: false,
      status: 400,
      message: "Invalid user id.",
    };
  }

  if (!ObjectId.isValid(payload.productId)) {
    return {
      success: false,
      status: 400,
      message: "Invalid product id.",
    };
  }

  const wishlistCollection =
    await getCollection<WishlistDocument>(
      collectionNames.WISHLIST
    );

  const productCollection =
    await getCollection<ProductDocument>(
      collectionNames.PRODUCTS
    );

  // Check product
  const product = await productCollection.findOne({
    _id: new ObjectId(payload.productId),
  });

  if (!product) {
    return {
      success: false,
      status: 404,
      message: "Product not found.",
    };
  }

  if (product.status !== "active") {
    return {
      success: false,
      status: 400,
      message: "Only active products can be added to wishlist.",
    };
  }

  // Prevent duplicate
  const exists = await wishlistCollection.findOne({
    userId: payload.userId,
    productId: payload.productId,
  });

  if (exists) {
    return {
      success: false,
      status: 409,
      message: "Product already exists in your wishlist.",
    };
  }

  const result = await wishlistCollection.insertOne({
    userId: payload.userId,
    productId: payload.productId,

    sellerId: product.sellerId,

    productName: product.name,
    thumbnail: product.thumbnail,

    price: product.price,
    salePrice: product.salePrice,

    stock: product.stock,

    createdAt: new Date(),
    updatedAt: new Date(),
  });

  if (!result.insertedId) {
    return {
      success: false,
      status: 500,
      message: "Failed to add product to wishlist.",
    };
  }

  return {
    success: true,
    status: 201,
    message: "Product added to wishlist successfully.",
  };
}

export async function getMyWishlistService(
  userId: string
) {
  if (!ObjectId.isValid(userId)) {
    return {
      success: false,
      status: 400,
      message: "Invalid user id.",
    };
  }

  const wishlistCollection =
    await getCollection<WishlistDocument>(
      collectionNames.WISHLIST
    );

  const wishlist = await wishlistCollection
    .find({
      userId,
    })
    .sort({
      createdAt: -1,
    })
    .toArray();

  return {
    success: true,
    status: 200,
    data: wishlist,
  };
}



export async function removeWishlistItemService(id: string) {
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid wishlist item id.");
  }

  const wishlistCollection = await getCollection(
    collectionNames.WISHLIST
  );

  const wishlistItem = await wishlistCollection.findOne({
    _id: new ObjectId(id),
  });

  if (!wishlistItem) {
    throw new Error("Wishlist item not found.");
  }

  const result = await wishlistCollection.deleteOne({
    _id: new ObjectId(id),
  });

  if (!result.deletedCount) {
    throw new Error("Failed to remove wishlist item.");
  }

  return {
    success: true,
    message: "Item removed from wishlist successfully.",
  };
}