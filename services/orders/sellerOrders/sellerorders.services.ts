import { collectionNames, getCollection } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

;

export async function getSellerOrdersService(sellerId: string) {
  if (!sellerId) {
    throw new Error("Seller id is required.");
  }

  const orderCollection = await getCollection(
    collectionNames.ORDERS
  );

 

  const orders = await orderCollection
    .find({
      sellerId,
    })
    .sort({
      createdAt: -1,
    })
    .toArray();

  return orders;
}



const VALID_STATUS = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

// export async function updateOrderStatusService(
//   orderId: string,
//   orderStatus: string
// ) {
//   if (!ObjectId.isValid(orderId)) {
//     throw new Error("Invalid order id.");
//   }

//   if (!VALID_STATUS.includes(orderStatus)) {
//     throw new Error("Invalid order status.");
//   }

//   const orderCollection = await getCollection(
//     collectionNames.ORDERS
//   );

//   const productCollection = await getCollection(
//     collectionNames.PRODUCTS
//   );

//   const order = await orderCollection.findOne({
//     _id: new ObjectId(orderId),
//   });

//   if (!order) {
//     throw new Error("Order not found.");
//   }

//   // Already same status
//   if (order.orderStatus === orderStatus) {
//     throw new Error(`Order is already ${orderStatus}.`);
//   }

//   // Restore stock only once when cancelling
//   if (
//     orderStatus === "CANCELLED" &&
//     order.orderStatus !== "CANCELLED"
//   ) {
//     await productCollection.updateOne(
//       {
//         _id: new ObjectId(order.productId),
//       },
//       {
//         $inc: {
//           stock: order.quantity,
//         },
//       }
//     );
//   }

//   const result = await orderCollection.updateOne(
//     {
//       _id: new ObjectId(orderId),
//     },
//     {
//       $set: {
//         orderStatus,
//         updatedAt: new Date(),
//       },
//     }
//   );

//   if (!result.modifiedCount) {
//     throw new Error("Failed to update order.");
//   }

//   return {
//     success: true,
//     message: `Order marked as ${orderStatus}.`,
//   };
// }

export async function updateOrderStatusService(
  orderId: string,
  orderStatus: string
) {
  if (!ObjectId.isValid(orderId)) {
    throw new Error("Invalid order id.");
  }

  if (!VALID_STATUS.includes(orderStatus)) {
    throw new Error("Invalid order status.");
  }

  const orderCollection = await getCollection(
    collectionNames.ORDERS
  );

  const productCollection = await getCollection(
    collectionNames.PRODUCTS
  );

  const order = await orderCollection.findOne({
    _id: new ObjectId(orderId),
  });

  if (!order) {
    throw new Error("Order not found.");
  }

  if (order.orderStatus === orderStatus) {
    throw new Error(`Order is already ${orderStatus}.`);
  }

  // Restore stock when cancelling
  if (
    orderStatus === "CANCELLED" &&
    order.orderStatus !== "CANCELLED"
  ) {
    await productCollection.updateOne(
      {
        _id: new ObjectId(order.productId),
      },
      {
        $inc: {
          stock: order.quantity,
        },
      }
    );
  }

  // Increase totalSold only once
  if (
    orderStatus === "DELIVERED" &&
    order.orderStatus !== "DELIVERED" &&
    order.paymentStatus === "PAID"
  ) {
    await productCollection.updateOne(
      {
        _id: new ObjectId(order.productId),
      },
      {
        $inc: {
          totalSold: order.quantity,
        },
      }
    );
  }

  const result = await orderCollection.updateOne(
    {
      _id: new ObjectId(orderId),
    },
    {
      $set: {
        orderStatus,
        updatedAt: new Date(),
      },
    }
  );

  if (!result.modifiedCount) {
    throw new Error("Failed to update order.");
  }

  return {
    success: true,
    message: `Order marked as ${orderStatus}.`,
  };
}