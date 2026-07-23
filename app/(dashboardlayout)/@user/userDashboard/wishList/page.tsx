"use client";

import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface WishlistProduct {
  _id: string;
  productId: string;
  name: string;
  thumbnail: string;
  price: number;
  stock: number;
}

export default function MyWishlistPage() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const [wishlist, setWishlist] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity] = useState(1);

  useEffect(() => {
    if (status === "loading") return;
    if (!userId) return;

    const controller = new AbortController();

    const fetchWishlist = async () => {
      try {
        const res = await fetch(`/api/wishlist/${userId}`, {
          cache: "no-store",
          signal: controller.signal,
        });

        const result = await res.json();

        if (!res.ok || !result.success) {
          toast.error(result.message || "Failed to load wishlist.");
          return;
        }

        setWishlist(result.data || []);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        toast.error("Failed to load wishlist.");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();

    return () => controller.abort();
  }, [status, userId]);

  const handleRemove = async (wishlistId: string) => {
    try {
      const res = await fetch(`/api/wishlist/remove/${wishlistId}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Failed to remove product.");
        return;
      }

      toast.success(result.message || "Removed successfully.");
      setWishlist((prev) => prev.filter((item) => item._id !== wishlistId));
    } catch {
      toast.error("Failed to remove product.");
    }
  };

  const handleAddToCart = async (item: WishlistProduct) => {
    if (!userId) {
      toast.error("Please login first.");
      return;
    }

    try {
      const productRes = await fetch(`/api/products/${item.productId}`, {
        cache: "no-store",
      });

      const productResult = await productRes.json();

      if (!productRes.ok || !productResult.success) {
        toast.error("Product not found.");
        return;
      }

      const product = productResult.data;

      if (!product || product.stock <= 0) {
        toast.error("Out of stock");
        return;
      }

      if (quantity <= 0 || quantity > product.stock) {
        toast.error("Invalid quantity");
        return;
      }

      const res = await fetch("/api/addToCart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: item.productId,
          userId,
          quantity,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Failed to add product to cart.");
        return;
      }

      toast.success("Product added to cart.");
      await handleRemove(item._id);
    } catch {
      toast.error("Failed to add product to cart.");
    }
  };

  if (status === "loading" || (userId && loading)) {
    return <div className="py-20 text-center">Loading wishlist...</div>;
  }

  if (!userId) {
    return (
      <section className="container mx-auto px-4 py-10">
        <div className="rounded-lg border py-20 text-center">
          <Heart className="mx-auto mb-4 h-14 w-14 text-muted-foreground" />
          <h2 className="text-2xl font-semibold">Please log in</h2>
          <p className="mt-2 text-muted-foreground">
            You need to sign in to view your wishlist.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        <p className="text-muted-foreground">Save your favorite products.</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="rounded-lg border py-20 text-center">
          <Heart className="mx-auto mb-4 h-14 w-14 text-muted-foreground" />
          <h2 className="text-2xl font-semibold">Wishlist is Empty</h2>
          <p className="mt-2 text-muted-foreground">
            Add products to your wishlist.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((product) => (
            <Card key={product._id} className="overflow-hidden">
              <Link href={`/allProducts/${product.productId}`}>
                <Image
                  src={product.thumbnail}
                  alt={product.name || ""}
                  width={500}
                  height={300}
                  className="h-60 w-full object-cover transition hover:scale-105"
                />
              </Link>

              <CardContent className="space-y-4 p-5">
                <div>
                  <h2 className="line-clamp-2 text-lg font-semibold">
                    {product.name}
                  </h2>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Stock</span>
                    <span>{product.stock}</span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Price</span>
                    <span className="text-xl font-bold text-primary">
                      ৳{product.price}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>

                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleRemove(product._id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
