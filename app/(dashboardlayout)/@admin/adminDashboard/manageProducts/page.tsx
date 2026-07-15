"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Product {
  _id: string;
  name: string;
  thumbnail: string;
  sellerId: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  status: "pending" | "active" | "rejected";
  createdAt: string;
}

export default function ManageProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const getProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();

        if (!isMounted) return;

        if (data.success) {
          setProducts(data.data);
        }
      } catch {
        // Optionally handle error with toast
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    getProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const updateStatus = async (
    id: string,
    status: "active" | "rejected"
  ) => {
    const res = await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    const result = await res.json();

    if (!res.ok) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);

    // Instead of full re-fetch, you could optimistically update the list:
    setProducts((prev) =>
      prev.map((p) => (p._id === id ? { ...p, status } : p))
    );
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Products</h1>
          <p className="text-muted-foreground">
            Review seller submitted products.
          </p>
        </div>

        <Input
          placeholder="Search product..."
          className="w-72"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>
                    <Image
                      src={product.thumbnail}
                      alt={product.name}
                      width={60}
                      height={60}
                      className="rounded-md object-cover"
                    />
                  </TableCell>

                  <TableCell>
                    <p className="font-medium">{product.name}</p>
                  </TableCell>

                  <TableCell>{product.sellerId}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>৳{product.price}</TableCell>
                  <TableCell>{product.stock}</TableCell>

                  <TableCell>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        product.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : product.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.status}
                    </span>
                  </TableCell>

                  <TableCell>
                    {product.status === "pending" ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            updateStatus(product._id, "active")
                          }
                        >
                          <Check className="mr-1 h-4 w-4" />
                          Approve
                        </Button>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            updateStatus(product._id, "rejected")
                          }
                        >
                          <X className="mr-1 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">
                        No Action
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}