"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


interface Product {
  _id: string;
  name: string;
  thumbnail: string;

  categoryName: string;
  subcategory: string;
  brandName: string;

  price: number;
  salePrice: number;

  stock: number;

  status: "pending" | "approved" | "rejected";

  featured: boolean;

  createdAt: string;
}

export default function AllProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    const getProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const result = await response.json();

        if (!response.ok) {
          toast.error(result.message);
          return;
        }

        if (!cancelled) {
          setProducts(result.data);
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          toast.error("Failed to load products.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    getProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex h-80 items-center justify-center">
        <p className="text-muted-foreground">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-background shadow-sm">
      <div className="flex items-center justify-between border-b p-6">
        <div>
          <h1 className="text-3xl font-bold">All Products</h1>
          <p className="mt-1 text-muted-foreground">
            Manage all marketplace products.
          </p>
        </div>

        <Badge className="px-3 py-1 text-sm">
          {products.length} Products
        </Badge>
      </div>

      {/* Grid of product cards */}
      {/* Grid of product cards */}
<div className="p-6">
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {products.map((product) => (
      <div
        key={product._id}
        className="group flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition hover:shadow-md"
      >
        {/* Thumbnail */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          <Image
            src={product.thumbnail}
            alt={product.name}
            fill
            className="object-cover transition group-hover:scale-105"
          />
          {product.featured && (
            <Badge className="absolute left-3 top-3">Featured</Badge>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-3 p-4">
          <div>
            <h3 className="line-clamp-1 text-lg font-semibold">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {product.subcategory} • {product.brandName}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">
                ৳{product.salePrice.toLocaleString()}
              </p>
              {product.salePrice !== product.price && (
                <p className="text-sm text-muted-foreground line-through">
                  ৳{product.price.toLocaleString()}
                </p>
              )}
            </div>

            <Badge
              variant={
                product.status === "approved"
                  ? "default"
                  : product.status === "pending"
                  ? "secondary"
                  : "destructive"
              }
              className="shrink-0"
            >
              {product.status}
            </Badge>
          </div>

          <div className="mt-auto flex items-center justify-between pt-2">
            <p className="text-sm text-muted-foreground">
              Stock: {product.stock}
            </p>

             <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      router.push(`/allProducts/${product._id}`)
                    }
                  >
                    Details
                  </Button>
          </div>
        </div>
      </div>
    ))}

    {!loading && products.length === 0 && (
      <div className="col-span-full py-12 text-center text-muted-foreground">
        No products found.
      </div>
    )}
  </div>
</div>
    </div>
  );
}