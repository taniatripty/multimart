"use client";

import { Package, Pencil, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Swal from "sweetalert2";

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
        const res = await fetch(`/api/products/my/${session.user.id}`, {
          cache: "no-store",
        });

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
    const result = await Swal.fire({
      title: "Delete Product?",
      text: "You can restore this product later from the admin panel.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/products/delete/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "deleted",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        await Swal.fire({
          title: "Failed!",
          text: data.message || "Failed to delete product.",
          icon: "error",
        });

        return;
      }

      setProducts((prev) => prev.filter((product) => product._id !== id));

      await Swal.fire({
        title: "Deleted!",
        text: "Your product has been deleted successfully.",
        icon: "success",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch {
      await Swal.fire({
        title: "Error!",
        text: "Something went wrong. Please try again.",
        icon: "error",
      });
    }
  };

  if (loading) {
    return <div className="py-20 text-center">Loading products...</div>;
  }

  return (
    <section className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Products</h1>

        <p className="text-muted-foreground">Manage all your products.</p>
      </div>

      {products.length === 0 ? (
        <div className="rounded-lg border py-20 text-center">
          <Package className="mx-auto mb-4 h-14 w-14 text-muted-foreground" />

          <h2 className="text-xl font-semibold">No Products Found</h2>

          <p className="mt-2 text-muted-foreground">
            Start by creating your first product.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product._id} className="overflow-hidden">
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

                    <span className="font-semibold">৳{product.price}</span>
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

                    {/* <span
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
                    </span> */}

                    <span
  className={`rounded-full px-2 py-1 text-xs font-medium ${
    product.status === "active"
      ? "bg-green-100 text-green-700"
      : product.status === "pending"
      ? "bg-yellow-100 text-yellow-700"
      : product.status === "rejected"
      ? "bg-red-100 text-red-700"
      : product.status === "deleted"
      ? "bg-gray-200 text-gray-700"
      : "bg-slate-100 text-slate-700"
  }`}
>
  {product.status}
</span>
                  </div>
                </div>

                {/* <div className="flex gap-3">
                  <Button asChild className="flex-1" variant="outline" 
                  
                  >
                    <Link href={`/sellerDashboard/editProduct/${product._id}`}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </Button>

                  <Button
                    className="flex-1"
                    variant="destructive"
                    disabled={
                      product.status === "rejected" ||
                      product.status === "deleted"
                    }
                    onClick={() => handleDelete(product._id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div> */}

                <div className="flex gap-3">
  {/* Edit Button */}
  <Button
    asChild={
      product.status !== "rejected" &&
      product.status !== "deleted"
    }
    className="flex-1"
    variant={
      product.status === "rejected" ||
      product.status === "deleted"
        ? "secondary"
        : "outline"
    }
    disabled={
      product.status === "rejected" ||
      product.status === "deleted"
    }
  >
    {product.status === "rejected" ||
    product.status === "deleted" ? (
      <span className="flex items-center justify-center">
        <Pencil className="mr-2 h-4 w-4" />
        Edit
      </span>
    ) : (
      <Link
        href={`/sellerDashboard/editProduct/${product._id}`}
      >
        <Pencil className="mr-2 h-4 w-4" />
        Edit
      </Link>
    )}
  </Button>

  {/* Delete Button */}
  <Button
    className={`flex-1 ${
      product.status === "rejected" ||
      product.status === "deleted"
        ? "cursor-not-allowed bg-gray-300 text-gray-500 hover:bg-gray-300"
        : ""
    }`}
    variant="destructive"
    disabled={
      product.status === "rejected" ||
      product.status === "deleted"
    }
    onClick={() => handleDelete(product._id)}
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
