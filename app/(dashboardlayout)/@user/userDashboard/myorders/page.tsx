"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Package } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Order {
  _id: string;

  productName: string;
  thumbnail: string;

  quantity: number;

  salePrice: number;
  totalSalePrice: number;

  paymentStatus: string;
  orderStatus: string;

  createdAt: string;
}

export default function MyOrdersPage() {
  const { data: session } = useSession();

  const userId = (session?.user as { id?: string })?.id;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/orders/my/${userId}`, {
          cache: "no-store",
        });

        const result = await res.json();

        if (result.success) {
          setOrders(result.data);
        } else {
          toast.error(result.message);
        }
      } catch {
        toast.error("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        Loading orders...
      </div>
    );
  }

  return (
    <section className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          My Orders
        </h1>

        <p className="text-muted-foreground">
          Track all of your purchased products.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-xl border py-20 text-center">
          <Package className="mx-auto mb-4 h-14 w-14 text-muted-foreground" />

          <h2 className="text-xl font-semibold">
            No Orders Found
          </h2>

          <p className="mt-2 text-muted-foreground">
            You have not placed any orders yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3">
          {orders.map((order) => (
            <Card
              key={order._id}
              className="overflow-hidden"
            >
              <Image
                src={order.thumbnail}
                alt={order.productName}
                width={500}
                height={300}
                className="h-56 w-full object-cover"
              />

              <CardContent className="space-y-4 p-5">
                <div>
                  <h2 className="line-clamp-2 text-lg font-bold">
                    {order.productName}
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Ordered on{" "}
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Quantity</span>

                    <span>{order.quantity}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Price</span>

                    <span>
                      ৳{order.salePrice}
                    </span>
                  </div>

                  <div className="flex justify-between font-semibold">
                    <span>Total</span>

                    <span>
                      ৳{order.totalSalePrice}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Badge
                    variant={
                      order.paymentStatus ===
                      "PAID"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {order.paymentStatus}
                  </Badge>

                  <Badge
                    className={
                      order.orderStatus ===
                      "DELIVERED"
                        ? "bg-green-600"
                        : order.orderStatus ===
                            "PENDING"
                          ? "bg-yellow-500"
                          : order.orderStatus ===
                              "CANCELLED"
                            ? "bg-red-600"
                            : "bg-blue-600"
                    }
                  >
                    {order.orderStatus}
                  </Badge>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}