import { collectionNames, getCollection } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";



export async function createReviewService(data: {
  productId: string;
  orderId: string;
  userId: string;
  sellerId: string;
  rating: number;
  review: string;
}) {
  if (
    !ObjectId.isValid(data.productId) ||
    !ObjectId.isValid(data.orderId) ||
    !ObjectId.isValid(data.userId) ||
    !ObjectId.isValid(data.sellerId)
  ) {
    throw new Error("Invalid id.");
  }

  const reviewsCollection = await getCollection(
    collectionNames.REVIEWS
  );

  const productCollection = await getCollection(
    collectionNames.PRODUCTS
  );

  const existingReview = await reviewsCollection.findOne({
    orderId: new ObjectId(data.orderId),
    userId: new ObjectId(data.userId),
  });

  if (existingReview) {
    throw new Error("You have already reviewed this order.");
  }

  const reviewDoc = {
    productId: new ObjectId(data.productId),
    orderId: new ObjectId(data.orderId),
    userId: new ObjectId(data.userId),
    sellerId: new ObjectId(data.sellerId),
    rating: Number(data.rating),
    review: data.review,
    createdAt: new Date(),
  };

  const result = await reviewsCollection.insertOne(reviewDoc);

  const reviews = await reviewsCollection
    .find({
      productId: new ObjectId(data.productId),
    })
    .toArray();

  const totalReviews = reviews.length;

  const totalRating = reviews.reduce(
    (sum, item) => sum + Number(item.rating),
    0
  );

  const averageRating =
    totalReviews > 0
      ? Number((totalRating / totalReviews).toFixed(1))
      : 0;

  await productCollection.updateOne(
    {
      _id: new ObjectId(data.productId),
    },
    {
      $set: {
        totalReviews,
        averageRating,
        updatedAt: new Date(),
      },
    }
  );

  return {
    success: true,
    message: "Review submitted successfully.",
    insertedId: result.insertedId,
  };
}