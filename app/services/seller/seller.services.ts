import { getCollection } from "@/lib/dbConnect";
import {
  SellerStatus,
  UserDocument,
  UserRole,
} from "@/lib/types";

export interface BecomeSellerPayload {
  email: string;
  shopName: string;
  phone: string;
  address: string;
  website?: string;
  description: string;
}

export async function becomeSellerService(
  payload: BecomeSellerPayload
) {
  const usersCollection = await getCollection<UserDocument>("users");

  const user = await usersCollection.findOne({
    email: payload.email,
  });

  if (!user) {
    return {
      success: false,
      status: 404,
      message: "User not found.",
    };
  }

  if (user.role === UserRole.SELLER) {
    return {
      success: false,
      status: 409,
      message: "You are already a seller.",
    };
  }

  if (user.sellerStatus === SellerStatus.PENDING) {
    return {
      success: false,
      status: 409,
      message: "Your seller request is already pending.",
    };
  }

  const result = await usersCollection.updateOne(
    { email: payload.email },
    {
      $set: {
        // User remains USER until approved by admin
        sellerStatus: SellerStatus.PENDING,
        role:UserRole.SELLER,
        shopName: payload.shopName,
        phone: payload.phone,
        address: payload.address,
        website: payload.website ?? "",
        description: payload.description,

        updatedAt: new Date(),
      },
    }
  );

  if (result.modifiedCount === 0) {
    return {
      success: false,
      status: 400,
      message: "Failed to submit seller request.",
    };
  }

  return {
    success: true,
    status: 200,
    message:
      "Seller request submitted successfully. Please wait for admin approval.",
  };
}