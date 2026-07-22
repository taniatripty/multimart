

import { ObjectId } from "mongodb";

import { collectionNames, getCollection } from "@/lib/dbConnect";
import { UserRole } from "@/lib/types";

interface CreateOrderPayload {
  userId: string;
  sellerId: string;

  productId: string;
  cartId: string;
  addressId: string;

  quantity: number;

  shippingFee: number;

  couponId?: string;
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

    couponId,
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

  const couponCollection = await getCollection(
    collectionNames.COUPONS
  );

  // ---------------- CART ----------------

  const cart = await cartCollection.findOne({
    _id: new ObjectId(cartId),
  });

  if (!cart) {
    throw new Error("Cart item not found.");
  }

  // ---------------- PRODUCT ----------------

  const product = await productCollection.findOne({
    _id: new ObjectId(productId),
  });

  if (!product) {
    throw new Error("Product not found.");
  }

  if (product.stock < quantity) {
    throw new Error("Insufficient stock.");
  }

  // ---------------- ADDRESS ----------------

  const address = await addressCollection.findOne({
    _id: new ObjectId(addressId),
  });

  if (!address) {
    throw new Error("Shipping address not found.");
  }

  const subtotal = product.salePrice * quantity;

  // ---------------- COUPON ----------------

  let discount = 0;
  let coupon = null;

  if (couponId) {
    if (!ObjectId.isValid(couponId)) {
      throw new Error("Invalid coupon.");
    }

    coupon = await couponCollection.findOne({
      _id: new ObjectId(couponId),
    });

    if (!coupon) {
      throw new Error("Coupon not found.");
    }

    if (coupon.status !== "ACTIVE") {
      throw new Error("Coupon is inactive.");
    }

    const now = new Date();

    if (now < coupon.startDate) {
      throw new Error("Coupon is not active yet.");
    }

    if (now > coupon.expireDate) {
      throw new Error("Coupon expired.");
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      throw new Error("Coupon usage limit exceeded.");
    }

    if (subtotal < coupon.minimumPurchase) {
      throw new Error(
        `Minimum purchase ৳${coupon.minimumPurchase} required.`
      );
    }

    if (coupon.discountType === "PERCENTAGE") {
      discount =
        subtotal * (coupon.discountValue / 100);

      discount = Math.min(
        discount,
        coupon.maximumDiscount
      );
    } else {
      discount = coupon.discountValue;
    }

    discount = Math.min(discount, subtotal);
  }

  const grandTotal =
    subtotal + shippingFee - discount;

  // ---------------- ORDER ----------------

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

    totalSalePrice: subtotal,

    discount,

    shippingFee,

    grandTotal,

    couponId: coupon ? coupon._id.toString() : null,

    address: {
      phone: address.phone,
      division: address.division,
      district: address.district,
      area: address.area,
      postalCode: address.postalCode,
      address: address.address,
    },

    paymentMethod: "STRIPE",
    paymentStatus: "Unpaid",

    orderStatus: "PENDING",

    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result =
    await orderCollection.insertOne(order);

  // ---------------- UPDATE STOCK ----------------

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

  // ---------------- REMOVE CART ----------------

  await cartCollection.deleteOne({
    _id: new ObjectId(cartId),
  });

  // ---------------- UPDATE COUPON ----------------

  if (coupon) {
    await couponCollection.updateOne(
      {
        _id: coupon._id,
      },
      {
        $inc: {
          usedCount: 1,
        },
      }
    );
  }

  return {
    _id: result.insertedId,
    ...order,
  };
}

export async function getAllOrdersService(userId: string) {
  if (!ObjectId.isValid(userId)) {
    throw new Error("Invalid user id.");
  }

  const userCollection = await getCollection(
    collectionNames.TEST_USER
  );

  const orderCollection = await getCollection(
    collectionNames.ORDERS
  );

  // Check logged-in user
  const user = await userCollection.findOne({
    _id: new ObjectId(userId),
  });

  if (!user) {
    throw new Error("User not found.");
  }

  if (user.role !== UserRole.ADMIN) {
    throw new Error("Unauthorized access.");
  }

  const orders = await orderCollection
    .aggregate([
      {
        $addFields: {
          userObjectId: {
            $toObjectId: "$userId",
          },
          sellerObjectId: {
            $toObjectId: "$sellerId",
          },
        },
      },

      {
        $lookup: {
          from: collectionNames.TEST_USER,
          localField: "userObjectId",
          foreignField: "_id",
          as: "user",
        },
      },

      {
        $unwind: "$user",
      },

      {
        $lookup: {
          from: collectionNames.TEST_USER,
          localField: "sellerObjectId",
          foreignField: "_id",
          as: "seller",
        },
      },

      {
        $unwind: "$seller",
      },

      {
        $project: {
          _id: 1,

          userId: 1,
          sellerId: 1,
          productId: 1,

          productName: 1,
          thumbnail: 1,

          quantity: 1,

          price: 1,
          salePrice: 1,

          totalPrice: 1,
          totalSalePrice: 1,

          shippingFee: 1,

          address: 1,

          paymentMethod: 1,
          paymentStatus: 1,
          orderStatus: 1,

          createdAt: 1,
          updatedAt: 1,

          user: {
            _id: "$user._id",
            name: "$user.name",
            email: "$user.email",
            image: "$user.image",
          },

          seller: {
            _id: "$seller._id",
            name: "$seller.name",
            email: "$seller.email",
            image: "$seller.image",
          },
        },
      },

      {
        $sort: {
          createdAt: -1,
        },
      },
    ])
    .toArray();

  return orders;
}

export async function getSingleOrderService(
  orderId: string
) {
  if (!ObjectId.isValid(orderId)) {
    throw new Error("Invalid order id.");
  }

  const orderCollection = await getCollection(
    collectionNames.ORDERS
  );

  const order = await orderCollection.aggregate([
    {
      $match: {
        _id: new ObjectId(orderId),
      },
    },

    {
      $addFields: {
        userObjectId: {
          $toObjectId: "$userId",
        },
        sellerObjectId: {
          $toObjectId: "$sellerId",
        },
        productObjectId: {
          $toObjectId: "$productId",
        },
      },
    },

    {
      $lookup: {
        from: collectionNames.TEST_USER,
        localField: "userObjectId",
        foreignField: "_id",
        as: "user",
      },
    },

    {
      $unwind: "$user",
    },

    {
      $lookup: {
        from: collectionNames.TEST_USER,
        localField: "sellerObjectId",
        foreignField: "_id",
        as: "seller",
      },
    },

    {
      $unwind: "$seller",
    },

    {
      $lookup: {
        from: collectionNames.PRODUCTS,
        localField: "productObjectId",
        foreignField: "_id",
        as: "product",
      },
    },

    {
      $unwind: "$product",
    },

    {
      $project: {
        _id: 1,

        userId: 1,
        sellerId: 1,
        productId: 1,

        productName: 1,
        thumbnail: 1,

        quantity: 1,
        price: 1,
        salePrice: 1,
        totalPrice: 1,
        totalSalePrice: 1,

        shippingFee: 1,

        address: 1,

        paymentMethod: 1,
        paymentStatus: 1,
        orderStatus: 1,

        couponId: 1,
        discount: 1,

        createdAt: 1,
        updatedAt: 1,

        user: {
          _id: "$user._id",
          name: "$user.name",
          email: "$user.email",
          image: "$user.image",
        },

        seller: {
          _id: "$seller._id",
          name: "$seller.name",
          email: "$seller.email",
          image: "$seller.image",
        },

        product: {
          _id: "$product._id",
          name: "$product.name",
          thumbnail: "$product.thumbnail",
          stock: "$product.stock",
        },
      },
    },
  ]).toArray();

  if (!order.length) {
    throw new Error("Order not found.");
  }

  return order[0];
}