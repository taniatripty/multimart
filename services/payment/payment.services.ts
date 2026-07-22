import { collectionNames, getCollection } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import Stripe from "stripe";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY!
);

export async function createPaymentIntentService(
  amount: number
) {
  if (!amount || amount <= 0) {
    throw new Error("Invalid payment amount.");
  }

  const paymentIntent =
    await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "bdt",

      automatic_payment_methods: {
        enabled: true,
      },

      metadata: {
        amount: amount.toString(),
      },
    });

  return paymentIntent.client_secret;
}

interface UpdatePaymentPayload {
  orderId: string;
  transactionId: string;
}

export async function updatePaymentService(
  payload: UpdatePaymentPayload
) {
  const { orderId, transactionId } = payload;

  if (!ObjectId.isValid(orderId)) {
    throw new Error("Invalid order id.");
  }

  const orderCollection = await getCollection(
    collectionNames.ORDERS
  );

  const result = await orderCollection.updateOne(
    {
      _id: new ObjectId(orderId),
    },
    {
      $set: {
        paymentStatus: "PAID",
        transactionId,
        paidAt: new Date(),
        updatedAt: new Date(),
      },
    }
  );

  if (!result.modifiedCount) {
    throw new Error("Order payment update failed.");
  }

  return {
    updated: true,
  };
}