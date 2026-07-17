"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Pencil, Trash2, Package } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Product {
  _id: string;
  name: string;
  thumbnail: string;

  categoryName: string;
  brandName: string;

  price: number;
  salePrice: number;
  stock: number;

  status: string;
}

export default function MyProductsPage() {
  const { data: session } = useSession();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `/api/products/my/${session.user.id}`,
          {
            cache: "no-store",
          }
        );

        const result = await res.json();

        if (result.success) {
          setProducts(result.data);
        } else {
          toast.error(result.message);
        }
      } catch {
        toast.error("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [session]);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      setProducts((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch {
      toast.error("Failed to delete product.");
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        Loading products...
      </div>
    );
  }

  return (
    <section className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          My Products
        </h1>

        <p className="text-muted-foreground">
          Manage all your products.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="rounded-lg border py-20 text-center">
          <Package className="mx-auto mb-4 h-14 w-14 text-muted-foreground" />

          <h2 className="text-xl font-semibold">
            No Products Found
          </h2>

          <p className="mt-2 text-muted-foreground">
            Start by creating your first product.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card
              key={product._id}
              className="overflow-hidden"
            >
              <Image
                src={product.thumbnail}
                alt={product.name}
                width={500}
                height={300}
                className="h-56 w-full object-cover"
              />

              <CardContent className="space-y-4 p-5">
                <div>
                  <h2 className="line-clamp-1 text-lg font-bold">
                    {product.name}
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    {product.categoryName}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {product.brandName}
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Price</span>

                    <span className="font-semibold">
                      ৳{product.price}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Sale Price</span>

                    <span className="font-semibold text-green-600">
                      ৳{product.salePrice}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Stock</span>

                    <span>{product.stock}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Status</span>

                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium
                      ${
                        product.status === "active"
                          ? "bg-green-100 text-green-700"
                          : product.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.status}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    asChild
                    className="flex-1"
                    variant="outline"
                  >
                    <Link
                      href={`/sellerDashboard/editProduct/${product._id}`}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </Button>

                  <Button
                    className="flex-1"
                    variant="destructive"
                    onClick={() =>
                      handleDelete(product._id)
                    }
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
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