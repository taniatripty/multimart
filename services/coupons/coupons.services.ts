import { collectionNames, getCollection } from "@/lib/dbConnect";

interface CreateCouponPayload {
  code: string;
  description: string;

  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;

  minimumPurchase: number;
  maximumDiscount: number;

  usageLimit: number;

  startDate: string;
  expireDate: string;

  status: "ACTIVE" | "INACTIVE";
}

export async function createCouponService(
  body: CreateCouponPayload
) {
  const couponCollection = await getCollection(
    collectionNames.COUPONS
  );

  const couponCode = body.code.trim().toUpperCase();

  const existingCoupon = await couponCollection.findOne({
    code: couponCode,
  });

  if (existingCoupon) {
    throw new Error("Coupon code already exists.");
  }

  const coupon = {
    code: couponCode,

    description: body.description,

    discountType: body.discountType,

    discountValue: Number(body.discountValue),

    minimumPurchase: Number(body.minimumPurchase),

    maximumDiscount: Number(body.maximumDiscount),

    usageLimit: Number(body.usageLimit),

    usedCount: 0,

    startDate: new Date(body.startDate),

    expireDate: new Date(body.expireDate),

    status: body.status,

    createdAt: new Date(),

    updatedAt: new Date(),
  };

  const result = await couponCollection.insertOne(coupon);

  return result;
}