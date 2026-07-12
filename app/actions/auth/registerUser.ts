

"use server";

import bcrypt from "bcryptjs";

import { getCollection } from "@/lib/dbConnect";
import { UserRole, type UserDocument } from "@/lib/types";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export async function RegisterUser(data: RegisterInput) {
  if (data.password !== data.confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const usersCollection = await getCollection<UserDocument>("users");

  const existing = await usersCollection.findOne({
    email: data.email,
  });

  if (existing) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  const newUser: UserDocument = {
    name: data.name,
    email: data.email,
    password: hashedPassword,
    image: null,
    role:UserRole.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await usersCollection.insertOne(newUser);

  return {
    id: result.insertedId.toString(),
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    image: newUser.image,
     createdAt: new Date(),
    updatedAt: new Date(),
  };
}