import { collectionNames, getCollection } from "@/lib/dbConnect";
import { UserRole } from "@/lib/types";

export async function getAllSellerService() {
  const userCollection = await getCollection(
    collectionNames.TEST_USER
  );

  const sellers = await userCollection
    .find({
      role: UserRole.SELLER,
    })
    .project({
      password: 0,
    })
    .sort({
      createdAt: -1,
    })
    .toArray();

  return {
    success: true,
    status: 200,
    message: "Sellers fetched successfully.",
    data: sellers,
  };
}