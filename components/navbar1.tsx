"use client";

import { Heart, Menu, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  { title: "Shop", href: "/products" },
  { title: "Deals", href: "/deals" },
  { title: "Brands", href: "/brands" },
  { title: "Vendors", href: "/vendors" },
  { title: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();

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
          {menu.map((item) => (
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
                  {menu.map((item) => (
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
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}