

"use server";

import bcrypt from "bcryptjs";

import { collectionNames, getCollection } from "@/lib/dbConnect";
import { UserRole, type UserDocument } from "@/lib/types";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  image:string
}

export async function RegisterUser(data: RegisterInput) {
  if (data.password !== data.confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const usersCollection = await getCollection<UserDocument>(collectionNames.TEST_USER);

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
    image: data.image,
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