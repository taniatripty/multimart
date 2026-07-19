import { collectionNames, getCollection } from "@/lib/dbConnect";

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