// lib/types.ts
import { ObjectId } from "mongodb";

export type UserRole = "admin" | "user";

export interface UserDocument {
  _id?: ObjectId | string;
  name: string;
  email: string;
  password?: string;
  image?: string | null;
  role?: UserRole;
  emailVerified?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}