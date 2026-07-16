
"use client";

import { Heart, Menu, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRole } from "@/lib/types";
import { useSession, signOut } from "next-auth/react";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const menu = [
  { title: "Home", href: "/" },
  { title: "Shop", href: "/allProducts" },
  { title: "Become a seller", href: "/becomeSeller" },
  { title: "Deals", href: "/deals" },
  { title: "Brands", href: "/brands" },
  { title: "seller", href: "/allSeller" },
  { title: "Contact", href: "/contact" },
  { title: "About Us", href: "/aboutUs" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const role = session?.user?.role;
  const dashboardRoute =
    role === UserRole.SELLER
      ? "/sellerDashboard"
      : role === UserRole.USER
      ? "/userDashboard"
      : "/adminDashboard";

  const navMenu = [...menu];

  if (session?.user) {
    navMenu.push({
      title: "Dashboard",
      href: dashboardRoute,
    });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900 shadow-lg">
      <div className="container mx-auto flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-3xl font-extrabold tracking-tight"
        >
          <span className="text-white">Multi</span>
          <span className="text-amber-400">Mart</span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navMenu.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                "relative text-sm font-medium text-slate-300 transition-all duration-200 hover:text-white",
                pathname === item.href &&
                  "text-amber-400 after:absolute after:-bottom-5 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-amber-400"
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-slate-300 hover:bg-slate-800 hover:text-amber-400"
          >
            <Heart className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full text-slate-300 hover:bg-slate-800 hover:text-amber-400"
          >
            <ShoppingCart className="h-5 w-5" />

            <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 p-0 text-[10px] font-bold text-slate-900">
              2
            </Badge>
          </Button>

          {/* Desktop User Profile */}
          <div className="hidden items-center gap-2 lg:flex">
            {session?.user ? (
              <div className="group relative flex items-center">
                {/* Profile Image with Hover Effect */}
                <div className="relative">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "Profile"}
                      className="h-9 w-9 rounded-full object-cover ring-2 ring-slate-700 transition-all duration-200 group-hover:ring-amber-400"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-400 text-slate-900 ring-2 ring-slate-700 transition-all duration-200 group-hover:ring-amber-400">
                      <User className="h-5 w-5" />
                    </div>
                  )}
                </div>

                {/* Hover Name Tooltip */}
                <div className="absolute top-full right-0 mt-2 hidden whitespace-nowrap rounded-md bg-slate-800 px-3 py-2 text-sm font-medium text-white shadow-lg group-hover:block">
                  <div className="flex items-center gap-2">
                    {session.user.image && (
                      <img
                        src={session.user.image}
                        alt={session.user.name || "Profile"}
                        className="h-6 w-6 rounded-full object-cover"
                      />
                    )}
                    <span>{session.user.name || session.user.email}</span>
                  </div>
                  {/* Tooltip Arrow */}
                  <div className="absolute -top-1 right-4 h-2 w-2 rotate-45 bg-slate-800" />
                </div>

                {/* Logout Button */}
                <Button
                  size="sm"
                  variant="outline"
                  className="ml-2 border-amber-400 bg-transparent text-amber-400 hover:bg-amber-400 hover:text-slate-900"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="text-slate-200 hover:bg-slate-800 hover:text-white"
                >
                  <Link href="/login">Login</Link>
                </Button>

                <Button className="bg-amber-400 text-slate-900 hover:bg-amber-300">
                  <Link href="/register">Register</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-slate-800"
                  />
                }
              >
                <Menu className="h-5 w-5" />
              </SheetTrigger>

              <SheetContent
                side="left"
                className="w-72 border-r border-slate-800 bg-slate-900 text-white"
              >
                <SheetHeader>
                  <SheetTitle className="text-left text-3xl font-extrabold">
                    <span className="text-white">Multi</span>
                    <span className="text-amber-400">Mart</span>
                  </SheetTitle>
                </SheetHeader>

                <nav className="mt-8 flex flex-col gap-2">
                  {navMenu.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className={cn(
                        "rounded-lg px-4 py-3 text-sm font-medium text-slate-300 transition-all hover:bg-slate-800 hover:text-white",
                        pathname === item.href &&
                          "bg-slate-800 text-amber-400"
                      )}
                    >
                      {item.title}
                    </Link>
                  ))}
                </nav>

                <div className="mt-8 border-t border-slate-700 pt-6">
                  {session?.user ? (
                    <div className="space-y-4">
                      {/* Mobile Profile */}
                      <div className="flex items-center gap-3">
                        {session.user.image ? (
                          <img
                            src={session.user.image}
                            alt={session.user.name || "Profile"}
                            className="h-12 w-12 rounded-full object-cover ring-2 ring-amber-400"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-400 text-slate-900 ring-2 ring-amber-400">
                            <User className="h-6 w-6" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-slate-300">Signed in as</p>
                          <p className="font-semibold text-amber-400">
                            {session.user.name || session.user.email}
                          </p>
                        </div>
                      </div>

                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => signOut({ callbackUrl: "/" })}
                      >
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full">
                        <Link href="/login">Login</Link>
                      </Button>

                      <Button className="w-full bg-amber-400 text-slate-900 hover:bg-amber-300">
                        <Link href="/register">Register</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}