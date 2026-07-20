import { collectionNames, getCollection } from "@/lib/dbConnect";

interface ApplyCouponPayload {
  code: string;
  subtotal: number;
}

export async function applyCouponService(
  body: ApplyCouponPayload
) {
  const couponCollection = await getCollection(
    collectionNames.COUPONS
  );

  const coupon = await couponCollection.findOne({
    code: body.code.trim().toUpperCase(),
  });

  if (!coupon) {
    throw new Error("Coupon not found.");
  }

  if (coupon.status !== "ACTIVE") {
    throw new Error("Coupon is inactive.");
  }

  const now = new Date();

  if (now < coupon.startDate) {
    throw new Error("Coupon is not active yet.");
  }

  if (now > coupon.expireDate) {
    throw new Error("Coupon has expired.");
  }

  if (coupon.usedCount >= coupon.usageLimit) {
    throw new Error("Coupon usage limit exceeded.");
  }

  if (body.subtotal < coupon.minimumPurchase) {
    throw new Error(
      `Minimum purchase ৳${coupon.minimumPurchase} required.`
    );
  }

  let discount = 0;

  if (coupon.discountType === "PERCENTAGE") {
    discount =
      body.subtotal * (coupon.discountValue / 100);

    discount = Math.min(
      discount,
      coupon.maximumDiscount
    );
  } else {
    discount = coupon.discountValue;
  }

  discount = Math.min(discount, body.subtotal);

  return {
    _id: coupon._id.toString(),
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    discount,
    maximumDiscount: coupon.maximumDiscount,
    minimumPurchase: coupon.minimumPurchase,
  };
}