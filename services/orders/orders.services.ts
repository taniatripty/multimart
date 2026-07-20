// import { collectionNames, getCollection } from "@/lib/dbConnect";


// export async function getAllOrdersService() {
//   const orderCollection = await getCollection(
//     collectionNames.ORDERS
//   );

//   const orders = await orderCollection
//     .aggregate([
//       {
//         $addFields: {
//           userObjectId: {
//             $toObjectId: "$userId",
//           },
//           sellerObjectId: {
//             $toObjectId: "$sellerId",
//           },
//         },
//       },

//       {
//         $lookup: {
//           from: collectionNames.TEST_USER,
//           localField: "userObjectId",
//           foreignField: "_id",
//           as: "user",
//         },
//       },

//       {
//         $unwind: "$user",
//       },

//       {
//         $lookup: {
//           from: collectionNames.TEST_USER,
//           localField: "sellerObjectId",
//           foreignField: "_id",
//           as: "seller",
//         },
//       },

//       {
//         $unwind: "$seller",
//       },

//       {
//         $project: {
//           _id: 1,

//           userId: 1,
//           sellerId: 1,
//           productId: 1,

//           productName: 1,
//           thumbnail: 1,

//           quantity: 1,

//           price: 1,
//           salePrice: 1,

//           totalPrice: 1,
//           totalSalePrice: 1,

//           shippingFee: 1,

//           address: 1,

//           paymentMethod: 1,
//           paymentStatus: 1,
//           orderStatus: 1,

//           createdAt: 1,
//           updatedAt: 1,

//           user: {
//             _id: "$user._id",
//             name: "$user.name",
//             email: "$user.email",
//             image: "$user.image",
//           },

//           seller: {
//             _id: "$seller._id",
//             name: "$seller.name",
//             email: "$seller.email",
//             image: "$seller.image",
//           },
//         },
//       },

//       {
//         $sort: {
//           createdAt: -1,
//         },
//       },
//     ])
//     .toArray();

//   return orders;
// }


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
    paymentMethod:"STRIPE",
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