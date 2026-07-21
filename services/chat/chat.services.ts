import { ObjectId } from "mongodb";

import {
  collectionNames,
  getCollection,
} from "@/lib/dbConnect";

interface CreateChatPayload {
  orderId: string;
  senderId: string;
  receiverId: string;
  message: string;
}

export async function createChatService(
  payload: CreateChatPayload
) {
  const {
    orderId,
    senderId,
    receiverId,
    message,
  } = payload;

  if (!ObjectId.isValid(orderId)) {
    throw new Error("Invalid order id.");
  }

  if (!message.trim()) {
    throw new Error("Message is required.");
  }

  const orderCollection = await getCollection(
    collectionNames.ORDERS
  );

  const messageCollection = await getCollection(
    collectionNames.CHATS
  );

  const order = await orderCollection.findOne({
    _id: new ObjectId(orderId),
  });

  if (!order) {
    throw new Error("Order not found.");
  }

  // Security: only buyer and seller of this order can chat
  if (
    (order.userId !== senderId &&
      order.sellerId !== senderId) ||
    (order.userId !== receiverId &&
      order.sellerId !== receiverId)
  ) {
    throw new Error("Unauthorized.");
  }

  const chat = {
    orderId,

    senderId,
    receiverId,

    message,

    isRead: false,

    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result =
    await messageCollection.insertOne(chat);

  return {
    _id: result.insertedId,
    ...chat,
  };
}



export async function getChatService(
  orderId: string
) {
  if (!ObjectId.isValid(orderId)) {
    throw new Error("Invalid order id.");
  }

  const orderCollection = await getCollection(
    collectionNames.ORDERS
  );

  const messageCollection = await getCollection(
    collectionNames.CHATS
  );

  const order = await orderCollection
    .aggregate([
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

          productId: 1,
          productName: 1,
          thumbnail: 1,

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
    ])
    .next();

  if (!order) {
    throw new Error("Order not found.");
  }

  const messages = await messageCollection
    .find({
      orderId,
    })
    .sort({
      createdAt: 1,
    })
    .toArray();

  return {
    order,
    messages,
  };
}