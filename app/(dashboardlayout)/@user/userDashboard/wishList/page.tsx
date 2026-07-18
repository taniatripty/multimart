

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Package,
  ShoppingCart,
  Trash2,
} from "lucide-react";
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
  const { data: session } = useSession();

  const [wishlist, setWishlist] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchWishlist = async () => {
      try {
        const res = await fetch(
          `/api/wishlist/${session.user.id}`,
          {
            cache: "no-store",
          }
        );

        const result = await res.json();

        if (result.success) {
          setWishlist(result.data);
        } else {
          toast.error(result.message);
        }
      } catch {
        toast.error("Failed to load wishlist.");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [session]);

  const handleRemove = async (wishlistId: string) => {
    try {
      const res = await fetch(
        `/api/wishlist/${wishlistId}`,
        {
          method: "DELETE",
        }
      );

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      setWishlist((prev) =>
        prev.filter((item) => item._id !== wishlistId)
      );
    } catch {
      toast.error("Failed to remove product.");
    }
  };

  const handleAddToCart = async (
    product: WishlistProduct
  ) => {
    if (!session?.user?.id) {
      toast.error("Please login first.");
      return;
    }

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
          productId: product.productId,
          quantity: 1,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message);
        return;
      }

      toast.success("Product added to cart.");

      // Remove from wishlist automatically
      await handleRemove(product._id);
    } catch {
      toast.error("Failed to add product to cart.");
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        Loading wishlist...
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          My Wishlist
        </h1>

        <p className="text-muted-foreground">
          Save your favorite products.
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="rounded-lg border py-20 text-center">
          <Heart className="mx-auto mb-4 h-14 w-14 text-muted-foreground" />

          <h2 className="text-2xl font-semibold">
            Wishlist is Empty
          </h2>

          <p className="mt-2 text-muted-foreground">
            Add products to your wishlist.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((product) => (
            <Card
              key={product._id}
              className="overflow-hidden"
            >
              <Link href={`/allProducts/${product.productId}`}>
                <Image
                  src={product.thumbnail}
                  alt={product.name ?? ""}
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
                    <span className="text-sm text-muted-foreground">
                      Stock
                    </span>

                    <span>{product.stock}</span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Price
                    </span>

                    <span className="text-xl font-bold text-primary">
                      ৳{product.price}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    onClick={() =>
                      handleAddToCart(product)
                    }
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>

                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() =>
                      handleRemove(product._id)
                    }
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