import { collectionNames, getCollection } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";



interface CreateOrderPayload {
  userId: string;
  sellerId: string;
  productId: string;
  cartId: string;
  addressId: string;
  quantity: number;
  shippingFee: number;
}

export async function createOrderService(
  payload: CreateOrderPayload
) {
  const {
    userId,
    sellerId,
    productId,
    cartId,
    addressId,
    quantity,
    shippingFee,
  } = payload;

  if (
    !ObjectId.isValid(productId) ||
    !ObjectId.isValid(cartId) ||
    !ObjectId.isValid(addressId)
  ) {
    throw new Error("Invalid id.");
  }

  const productCollection = await getCollection(
    collectionNames.PRODUCTS
  );

  const cartCollection = await getCollection(
    collectionNames.CART
  );

  const orderCollection = await getCollection(
    collectionNames.ORDERS
  );

  const addressCollection = await getCollection(
    collectionNames.ADDRESS
  );

  // Cart Item
  const cart = await cartCollection.findOne({
    _id: new ObjectId(cartId),
  });

  if (!cart) {
    throw new Error("Cart item not found.");
  }

  // Product
  const product = await productCollection.findOne({
    _id: new ObjectId(productId),
  });

  if (!product) {
    throw new Error("Product not found.");
  }

  if (product.stock < quantity) {
    throw new Error("Insufficient stock.");
  }

  // Address
  const address = await addressCollection.findOne({
    _id: new ObjectId(addressId),
  });

  if (!address) {
    throw new Error("Shipping address not found.");
  }

  const order = {
    userId,
    sellerId,

    productId,

    productName: product.name,
    thumbnail: product.thumbnail,

    quantity,

    price: product.price,
    salePrice: product.salePrice,

    totalPrice: product.price * quantity,
    totalSalePrice: product.salePrice * quantity,

    shippingFee,

    address: {
      phone: address.phone,
      division: address.division,
      district: address.district,
      area: address.area,
      postalCode: address.postalCode,
      address: address.address,
    },

    

    paymentStatus: "Unpaid",

    orderStatus: "PENDING",

    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await orderCollection.insertOne(order);

  // Update stock
  await productCollection.updateOne(
    {
      _id: new ObjectId(productId),
    },
    {
      $inc: {
        stock: -quantity,
      },
    }
  );

  // Remove from cart
  await cartCollection.deleteOne({
    _id: new ObjectId(cartId),
  });

  return {
    _id: result.insertedId,
    ...order,
  };
}

export async function getMyOrdersService(userId: string) {
  if (!userId) {
    throw new Error("User id is required.");
  }

  const orderCollection = await getCollection(
    collectionNames.ORDERS
  );

  const orders = await orderCollection
    .find({
      userId,
    })
    .sort({
      createdAt: -1,
    })
    .toArray();

  return orders;
}