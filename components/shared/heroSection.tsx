"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Store, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Background Blur */}
      <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-amber-500/20 blur-3xl" />
      <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />

      <div className="container relative mx-auto grid min-h-[85vh] items-center gap-16 px-6 py-20 lg:grid-cols-2">
        {/* Left */}
        <div>
          <span className="inline-flex rounded-full bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-400">
            🚀 Trusted Multi-Vendor Marketplace
          </span>

          <h1 className="mt-6 text-5xl font-extrabold leading-tight text-white lg:text-6xl">
            Shop Smarter with
            <span className="text-amber-400"> MultiMart</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            Discover thousands of products from trusted vendors. Find amazing
            deals on electronics, fashion, home essentials, beauty, and much
            more—all in one place.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button size="lg" className="bg-amber-400 text-slate-900 hover:bg-amber-500">
              <Link href="/allProducts" className="flex items-center gap-2">
                Shop Now
                <ArrowRight size={18} />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-slate-700 bg-transparent text-white hover:bg-slate-800"
            >
              <Link href="/becomeSeller">
                Become a Seller
              </Link>
            </Button>
          </div>

          {/* Features */}
          <div className="mt-14 grid grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <Store className="text-amber-400" />
              <div>
                <h3 className="font-bold text-white">500+</h3>
                <p className="text-sm text-slate-400">Trusted Sellers</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Truck className="text-amber-400" />
              <div>
                <h3 className="font-bold text-white">Fast</h3>
                <p className="text-sm text-slate-400">Delivery</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ShieldCheck className="text-amber-400" />
              <div>
                <h3 className="font-bold text-white">Secure</h3>
                <p className="text-sm text-slate-400">Payments</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="relative flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700"
            alt="Shopping"
            className="w-full max-w-lg rounded-3xl shadow-2xl"
          />

          <div className="absolute -left-10 top-10 rounded-2xl bg-white p-5 shadow-xl">
            <p className="text-sm text-slate-500">Products</p>
            <h3 className="text-2xl font-bold text-slate-900">10K+</h3>
          </div>

          <div className="absolute -right-8 bottom-10 rounded-2xl bg-amber-400 p-5 shadow-xl">
            <p className="text-sm text-slate-900">Happy Customers</p>
            <h3 className="text-2xl font-bold text-slate-900">50K+</h3>
          </div>
        </div>
      </div>
    </section>
  );
}