import { collectionNames, getCollection } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

interface AddToCartPayload {
  userId: string;
  productId: string;
  quantity: number;
}

export async function addToCartService(
  payload: AddToCartPayload
) {
  const { userId, productId, quantity } = payload;

  if (!userId) {
    throw new Error("Please login first.");
  }

  if (!ObjectId.isValid(productId)) {
    throw new Error("Invalid product id.");
  }

  if (!quantity || quantity < 1) {
    throw new Error("Quantity must be at least 1.");
  }

  const productCollection = await getCollection(
    collectionNames.PRODUCTS
  );

  const cartCollection = await getCollection(
    collectionNames.CART
  );

  const product = await productCollection.findOne({
    _id: new ObjectId(productId),
  });

  if (!product) {
    throw new Error("Product not found.");
  }

  if (product.status !== "active") {
    throw new Error("This product is not available.");
  }

  if (product.stock < quantity) {
    throw new Error(
      `Only ${product.stock} item(s) available in stock.`
    );
  }

  const existingCart = await cartCollection.findOne({
    userId,
    productId,
  });

  const totalPrice = product.price * quantity;
  const totalSalePrice = product.salePrice * quantity;

  if (existingCart) {
    const newQuantity = existingCart.quantity + quantity;

    if (newQuantity > product.stock) {
      throw new Error(
        `You can only add ${product.stock} item(s).`
      );
    }

    await cartCollection.updateOne(
      {
        _id: existingCart._id,
      },
      {
        $set: {
          quantity: newQuantity,
          totalPrice: product.price * newQuantity,
          totalSalePrice:
            product.salePrice * newQuantity,
          updatedAt: new Date(),
        },
      }
    );

    return {
      success: true,
      message: "Cart updated successfully.",
    };
  }

  await cartCollection.insertOne({
    userId,
    productId,
    sellerId: product.sellerId,

    name: product.name,
    thumbnail: product.thumbnail,

    price: product.price,
    salePrice: product.salePrice,

    quantity,

    totalPrice,
    totalSalePrice,

    stock: product.stock,

    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return {
    success: true,
    message: "Product added to cart.",
  };
}



export async function getMyCartService(userId: string) {
  if (!userId) {
    throw new Error("User id is required.");
  }

  const cartCollection = await getCollection(
    collectionNames.CART
  );

  const carts = await cartCollection
    .find({
      userId,
    })
    .sort({
      createdAt: -1,
    })
    .toArray();

  return {
    success: true,
    message: "Cart fetched successfully.",
    data: carts,
  };
}

export async function removeCartItemService(id: string) {
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid cart item id.");
  }

  const cartCollection = await getCollection(
    collectionNames.CART
  );

  const cartItem = await cartCollection.findOne({
    _id: new ObjectId(id),
  });

  if (!cartItem) {
    throw new Error("Cart item not found.");
  }

  const result = await cartCollection.deleteOne({
    _id: new ObjectId(id),
  });

  if (!result.deletedCount) {
    throw new Error("Failed to remove cart item.");
  }

  return {
    success: true,
    message: "Item removed from cart successfully.",
  };
}