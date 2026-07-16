// components/SellerGrid.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { BadgeCheck, Globe, MapPin, Phone, Mail, Store } from "lucide-react";

interface Seller {
  _id: string;
  name: string;
  email: string;
  image: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  address: string;
  description: string;
  phone: string;
  sellerStatus: string;
  shopName: string;
  website?: string;
}

interface SellerResponse {
  data?: Seller[];
  sellers?: Seller[];
}

export default function Seller() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSellers() {
      try {
        const res = await fetch("/api/seller/approve");
        if (!res.ok) throw new Error("Failed to fetch sellers");
        const json: SellerResponse = await res.json();
        setSellers(json.data || json.sellers || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchSellers();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded" />
              <div className="h-3 bg-gray-200 rounded w-5/6" />
              <div className="h-3 bg-gray-200 rounded w-4/6" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600 bg-red-50 rounded-lg max-w-2xl mx-auto">
        {error}
      </div>
    );
  }

  if (!sellers.length) {
    return (
      <div className="p-12 text-center text-gray-500">
        No approved sellers found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {sellers.map((seller) => (
        <SellerCard key={seller._id} seller={seller} />
      ))}
    </div>
  );
}

function SellerCard({ seller }: { seller: Seller }) {
  const isApproved = seller.sellerStatus === "approved";

  return (
    <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200">
      {/* Decorative gradient header */}
      <div className="h-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/20 rounded-full blur-xl" />
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/10 rounded-full blur-lg" />
      </div>

      <div className="p-6 -mt-12 relative">
        {/* Profile Image & Badge */}
        <div className="flex justify-between items-start mb-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white">
              <Image
                src={seller.image || "/placeholder-avatar.png"}
                alt={seller.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            {isApproved && (
              <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1.5 rounded-full shadow-md">
                <BadgeCheck size={16} />
              </div>
            )}
          </div>

          {seller.website && (
            <a
              href={seller.website}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Visit website"
            >
              <Globe size={20} />
            </a>
          )}
        </div>

        {/* Shop & Seller Info */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
            {seller.shopName}
          </h3>
          <p className="text-sm text-gray-500 font-medium">
            by {seller.name}
          </p>
        </div>

        {/* Status Badge */}
        <div className="mb-4">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              isApproved
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            <BadgeCheck size={14} />
            {seller.sellerStatus.toUpperCase()}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-5 line-clamp-3 leading-relaxed">
          {seller.description}
        </p>

        {/* Contact Info */}
        <div className="space-y-3 pb-5 border-b border-gray-100">
          <ContactRow icon={<MapPin size={16} />} text={seller.address} />
          <ContactRow icon={<Phone size={16} />} text={seller.phone} />
          <ContactRow icon={<Mail size={16} />} text={seller.email} />
        </div>

        {/* Footer Stats */}
        <div className="pt-4 flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <Store size={14} />
            Seller since {new Date(seller.createdAt).toLocaleDateString()}
          </span>
          <span className="text-gray-400">
            Updated {new Date(seller.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Hover accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    </div>
  );
}

function ContactRow({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 text-sm text-gray-600">
      <span className="text-gray-400 flex-shrink-0">{icon}</span>
      <span className="truncate">{text}</span>
    </div>
  );
}