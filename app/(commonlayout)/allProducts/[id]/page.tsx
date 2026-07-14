"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { ArrowLeft, Star } from "lucide-react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Product {
  _id: string;
  name: string;
  shortDescription: string;
  description: string;
  categoryId: string;
  subcategory: string;
  brandId: string;
  sellerId: string;
  storeId: string;
  price: number;
  discount: number;
  salePrice: number;
  stock: number;
  thumbnail: string;
  colors: string[];
  sizes: string[];
  features: string[];
  status: "pending" | "approved" | "rejected";
  featured: boolean;
  averageRating: number;
  totalReviews: number;
  totalSold: number;
  views: number;
  createdAt: string;
  updatedAt: string;
  categoryName: string;
  brandName: string;
}

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message || "Failed to load product");
          return;
        }

        if (!cancelled) {
          setProduct(data.data);
        }
      } catch {
        if (!cancelled) {
          toast.error("Failed to load product");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-80 items-center justify-center">
        <p className="text-muted-foreground">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex h-80 items-center justify-center">
        <p className="text-muted-foreground">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      {/* Back button */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Left: Image */}
        <div className="overflow-hidden rounded-xl border bg-card">
          <div className="relative aspect-square w-full bg-muted">
            <Image
              src={product.thumbnail}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex flex-col gap-6">
          {/* Title & basic meta */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant={
                  product.status === "approved"
                    ? "default"
                    : product.status === "pending"
                    ? "secondary"
                    : "destructive"
                }
              >
                {product.status}
              </Badge>
              {product.featured && <Badge>Featured</Badge>}
            </div>

            <h1 className="mt-3 text-3xl font-bold">{product.name}</h1>

            <p className="mt-1 text-muted-foreground">
              {product.categoryName} • {product.brandName} • {product.subcategory}
            </p>
          </div>

          {/* Price & stock */}
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Price</p>
                <div className="flex items-center gap-3">
                  <p className="text-2xl font-bold">
                    ৳{product.salePrice.toLocaleString()}
                  </p>
                  {product.salePrice !== product.price && (
                    <p className="text-lg text-muted-foreground line-through">
                      ৳{product.price.toLocaleString()}
                    </p>
                  )}
                </div>
                {product.discount > 0 && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    Discount: {product.discount}%
                  </p>
                )}
              </div>

              <div className="text-right">
                <p className="text-sm text-muted-foreground">Stock</p>
                <p className="text-xl font-semibold">{product.stock}</p>
              </div>
            </div>
          </div>

          {/* Short description */}
          {product.shortDescription && (
            <div>
              <h2 className="text-lg font-semibold">Short Description</h2>
              <p className="mt-1 text-muted-foreground">
                {product.shortDescription}
              </p>
            </div>
          )}

          {/* Description */}
          {product.description && (
            <div>
              <h2 className="text-lg font-semibold">Description</h2>
              <p className="mt-1 whitespace-pre-wrap text-muted-foreground">
                {product.description}
              </p>
            </div>
          )}

          {/* Colors, Sizes, Features */}
          <div className="grid gap-4 sm:grid-cols-2">
            {product.colors?.length > 0 && (
              <div className="rounded-lg border bg-card p-4">
                <h3 className="font-semibold">Colors</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <Badge key={c} variant="secondary">
                      {c}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {product.sizes?.length > 0 && (
              <div className="rounded-lg border bg-card p-4">
                <h3 className="font-semibold">Sizes</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <Badge key={s} variant="secondary">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {product.features?.length > 0 && (
              <div className="rounded-lg border bg-card p-4 sm:col-span-2">
                <h3 className="font-semibold">Features</h3>
                <ul className="mt-2 list-disc pl-5 text-muted-foreground">
                  {product.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground">Rating</p>
              <div className="mt-1 flex items-center gap-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <p className="font-semibold">
                  {product.averageRating.toFixed(1)} ({product.totalReviews}{" "}
                  reviews)
                </p>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground">Total Sold</p>
              <p className="mt-1 text-xl font-semibold">{product.totalSold}</p>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground">Views</p>
              <p className="mt-1 text-xl font-semibold">{product.views}</p>
            </div>
          </div>

          {/* Meta info */}
          <div className="text-sm text-muted-foreground">
            <p>
              Created: {new Date(product.createdAt).toLocaleString()}
            </p>
            <p>
              Updated: {new Date(product.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}