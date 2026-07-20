import { collectionNames, getCollection } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";




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