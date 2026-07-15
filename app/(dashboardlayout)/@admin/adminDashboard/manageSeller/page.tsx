"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";

interface Seller {
  _id: string;
  name: string;
  email: string;
  image: string;

  shopName: string;
  phone: string;
  address: string;
  website?: string;

  sellerStatus:
    | "pending"
    | "approved"
    | "rejected";

  role: string;
}

export default function ManageSellerPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let isMounted = true;

    const getSellerRequests = async () => {
      try {
        const res = await fetch("/api/seller");
        const result = await res.json();

        if (!isMounted) return;

        if (result.success) {
          setSellers(result.data);
        } else {
          toast.error("Failed to load seller requests.");
        }
      } catch {
        if (isMounted) {
          toast.error("Failed to load seller requests.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getSellerRequests();

    return () => {
      isMounted = false;
    };
  }, []);

  const updateSellerStatus = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
    try {
      const res = await fetch(`/api/seller/${id}`, {
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

      // Optimistic update instead of full re-fetch
      setSellers((prev) =>
        prev.map((seller) =>
          seller._id === id
            ? { ...seller, sellerStatus: status }
            : seller
        )
      );
    } catch {
      toast.error("Something went wrong.");
    }
  };

  const filtered = sellers.filter((seller) =>
    seller.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading...
      </div>
    );
  }

  return (
    <section className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Manage Sellers
          </h1>

          <p className="text-muted-foreground">
            Review seller requests.
          </p>
        </div>

        <Input
          placeholder="Search seller..."
          className="w-72"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Seller</TableHead>
              <TableHead>Shop</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtered.map((seller) => (
              <TableRow key={seller._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Image
                      src={seller.image}
                      alt={seller.name}
                      width={45}
                      height={45}
                      className="rounded-full"
                    />

                    <div>
                      <p className="font-medium">
                        {seller.name}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {seller.email}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  {seller.shopName}
                </TableCell>

                <TableCell>
                  {seller.phone}
                </TableCell>

                <TableCell>
                  {seller.address}
                </TableCell>

                <TableCell>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium
                    ${
                      seller.sellerStatus ===
                      "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : seller.sellerStatus ===
                          "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {seller.sellerStatus}
                  </span>
                </TableCell>

                <TableCell>
                  {seller.sellerStatus ===
                  "pending" ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          updateSellerStatus(
                            seller._id,
                            "approved"
                          )
                        }
                      >
                        <CheckCircle2 className="mr-1 h-4 w-4" />
                        Approve
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          updateSellerStatus(
                            seller._id,
                            "rejected"
                          )
                        }
                      >
                        <XCircle className="mr-1 h-4 w-4" />
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
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}