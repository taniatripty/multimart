"use client";

import Link from "next/link";
import {
 
  Mail,
  MapPin,
  Phone,
  
} from "lucide-react";

import { FaFacebook ,FaTwitter, FaInstagram } from "react-icons/fa";
export default function Footer() {
  return (
    <footer className="mt-20 bg-slate-950 text-slate-300">
      {/* Top */}
      <div className="container mx-auto grid gap-12 px-6 py-16 md:grid-cols-2 lg:grid-cols-5">
        {/* Brand */}
        <div className="lg:col-span-2">
          <Link href="/" className="text-3xl font-extrabold">
            <span className="text-white">Multi</span>
            <span className="text-amber-400">Mart</span>
          </Link>

          <p className="mt-5 max-w-sm leading-7 text-slate-400">
            MultiMart is a modern multi-vendor marketplace where customers can
            discover quality products from trusted sellers across multiple
            categories.
          </p>

          <div className="mt-6 space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-amber-400" />
              <span>Dhaka, Bangladesh</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone size={18} className="text-amber-400" />
              <span>+880 1234-567890</span>
            </div>

            <div className="flex items-center gap-3">
              <Mail size={18} className="text-amber-400" />
              <span>support@multimart.com</span>
            </div>
          </div>
        </div>

        {/* Shop */}
        <div>
          <h3 className="mb-5 text-lg font-semibold text-white">Shop</h3>

          <ul className="space-y-3">
            <li>
              <Link href="/products" className="hover:text-amber-400">
                All Products
              </Link>
            </li>

            <li>
              <Link href="/deals" className="hover:text-amber-400">
                Deals
              </Link>
            </li>

            <li>
              <Link href="/brands" className="hover:text-amber-400">
                Brands
              </Link>
            </li>

            <li>
              <Link href="/categories" className="hover:text-amber-400">
                Categories
              </Link>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="mb-5 text-lg font-semibold text-white">Company</h3>

          <ul className="space-y-3">
            <li>
              <Link href="/about" className="hover:text-amber-400">
                About Us
              </Link>
            </li>

            <li>
              <Link href="/vendors" className="hover:text-amber-400">
                Vendors
              </Link>
            </li>

            <li>
              <Link href="/blog" className="hover:text-amber-400">
                Blog
              </Link>
            </li>

            <li>
              <Link href="/contact" className="hover:text-amber-400">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="mb-5 text-lg font-semibold text-white">Support</h3>

          <ul className="space-y-3">
            <li>
              <Link href="/faq" className="hover:text-amber-400">
                FAQ
              </Link>
            </li>

            <li>
              <Link href="/privacy-policy" className="hover:text-amber-400">
                Privacy Policy
              </Link>
            </li>

            <li>
              <Link href="/terms" className="hover:text-amber-400">
                Terms & Conditions
              </Link>
            </li>

            <li>
              <Link href="/returns" className="hover:text-amber-400">
                Return Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-800" />

      {/* Bottom */}
      <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-6 py-6 md:flex-row">
        <p className="text-sm text-slate-400">
          © {new Date().getFullYear()} MultiMart. All rights reserved.
        </p>

        <div className="flex items-center gap-4">
          <Link
            href="#"
            className="rounded-full bg-slate-800 p-2 transition hover:bg-amber-400 hover:text-slate-900"
          >
            <FaFacebook size={18} />
          </Link>

          <Link
            href="#"
            className="rounded-full bg-slate-800 p-2 transition hover:bg-amber-400 hover:text-slate-900"
          >
            <FaTwitter size={18} />
          </Link>

          <Link
            href="#"
            className="rounded-full bg-slate-800 p-2 transition hover:bg-amber-400 hover:text-slate-900"
          >
            <FaInstagram size={18} />
          </Link>

         
        </div>
      </div>
    </footer>
  );
}