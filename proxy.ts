import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { UserRole } from "@/lib/types";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const role = token.role as UserRole;

  // ADMIN
  if (
    pathname.startsWith("/adminDashboard") &&
    role !== UserRole.ADMIN
  ) {
    return NextResponse.redirect(
      new URL("/userDashboard", request.url)
    );
  }

  // SELLER
  if (
    pathname.startsWith("/sellerDashboard") &&
    role !== UserRole.SELLER
  ) {
    return NextResponse.redirect(
      new URL("/userDashboard", request.url)
    );
  }

  // USER
  if (pathname.startsWith("/userDashboard")) {
    if (role === UserRole.ADMIN) {
      return NextResponse.redirect(
        new URL("/adminDashboard", request.url)
      );
    }

    if (role === UserRole.SELLER) {
      return NextResponse.redirect(
        new URL("/sellerDashboard", request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/adminDashboard/:path*",
    "/sellerDashboard/:path*",
    "/userDashboard/:path*",
  ],
};