
import { LoginUser } from "@/app/actions/auth/loginUser";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { collectionNames, getCollection } from "./dbConnect";


declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: "admin" | "user" |"seller";
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: "admin" | "user" | "seller";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: "admin" | "user" | "seller" ;
  }
}
// ===========================================================

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email" },
        password: { label: "Password" },
      },
      async authorize(credentials) {
        const user = await LoginUser(credentials);
        if (!user) throw new Error("Invalid credentials");
        return user;
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: "/login",
  },

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      const usersCollection = await getCollection(collectionNames.TEST_USER);

      if (user?.email) {
        let dbUser = await usersCollection.findOne({ email: user.email });

        if (!dbUser) {
          // New Google user
          const newUser = {
            name: user.name ?? "",
            email: user.email ?? "",
            image: user.image ?? null,
            role: "user" as "admin" | "user",
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          const result = await usersCollection.insertOne(newUser);
          dbUser = {
            ...newUser,
            _id: result.insertedId,
          };
        }

        token.id = dbUser._id.toString();
        token.role = dbUser.role ?? "user";
      }

      // Refresh role on each request (optional but fine)
      if (token?.email) {
        const dbUser = await usersCollection.findOne({ email: token.email });
        if (dbUser?.role) {
          token.role = dbUser.role;
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = (token.role as "admin" | "user") ?? "user";
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
