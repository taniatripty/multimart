
"use server";

import bcrypt from "bcryptjs";
import { getCollection } from "@/lib/dbConnect";

export interface Credentials {
  email?: string;
  password?: string;
}

export async function LoginUser(credentials: Credentials | undefined) {
  if (!credentials?.email || !credentials?.password) {
    return null;
  }

  const usersCollection = await getCollection("users");

  const user = await usersCollection.findOne({ email: credentials.email });

  if (!user ) {
    return null;
  }

  const isValid = await bcrypt.compare(credentials.password, user.password);
  if (!isValid) {
    return null;
  }

  return {
    id: user._id.toString(),
    name: user.name ?? "",
    email: user.email ?? "",
    role: user.role ?? "user",
    image: user.image ?? null,
  };
}