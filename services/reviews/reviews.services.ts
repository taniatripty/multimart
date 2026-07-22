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
 
  const reviewsCollection = await getCollection(
      collectionNames.REVIEWS
    );
  const existingReview = await reviewsCollection.findOne({
    orderId: data.orderId,
    userId: data.userId,
  });

  if (existingReview) {
    throw new Error("You have already reviewed this order.");
  }

  const reviewDoc = {
    productId:data.productId,
    orderId:data.orderId,

    userId:data.userId,
   sellerId:data.sellerId,
   

    rating: Number(data.rating),

    review: data.review,

    createdAt: new Date(),
  };

  const result = await reviewsCollection.insertOne(reviewDoc);

  return result;
}