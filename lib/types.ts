import { ObjectId } from "mongodb";

export enum UserRole {
  USER = "user",
  SELLER = "seller",
  ADMIN = "admin",
}

export enum SellerStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export interface UserDocument {
  _id?: ObjectId | string;

  name: string;
  email: string;
  password?: string;
  image?: string | null;

  role?: UserRole;

  sellerStatus?: SellerStatus;

  shopName?: string;
  phone?: string;
  address?: string;
  website?: string;
  description?: string;

  emailVerified?: Date | null;

  createdAt?: Date;
  updatedAt?: Date;
}