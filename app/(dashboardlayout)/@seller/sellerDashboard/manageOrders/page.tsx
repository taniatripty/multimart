"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Package } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Order {
  _id: string;

  productName: string;
  thumbnail: string;

  quantity: number;
  totalSalePrice: number;

  paymentStatus: string;
  orderStatus: string;

  createdAt: string;

  address: {
    phone: string;
    division: string;
    district: string;
    area: string;
    address: string;
    postalCode: string;
  };
}

export default function SellerOrdersPage() {
  const { data: session } = useSession();

  const sellerId = (session?.user as { id?: string })?.id;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sellerId) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/orders/seller/${sellerId}`, {
          cache: "no-store",
        });

        const result = await res.json();

        if (result.success) {
          setOrders(result.data);
        } else {
          toast.error(result.message);
        }
      } catch {
        toast.error("Failed to load seller orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [sellerId]);

  const updateStatus = async (
    orderId: string,
    status: string
  ) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderStatus: status,
        }),
      });

      const result = await res.json();

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? {
                ...order,
                orderStatus: status,
              }
            : order
        )
      );

      toast.success("Order updated successfully.");
    } catch {
      toast.error("Failed to update order.");
    }
  };

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
          Manage Orders
        </h1>

        <p className="text-muted-foreground">
          Manage customer orders.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-lg border py-20 text-center">
          <Package className="mx-auto mb-4 h-14 w-14 text-muted-foreground" />

          <h2 className="text-xl font-semibold">
            No Orders Found
          </h2>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {orders.map((order) => (
            <Card key={order._id}>
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

                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Quantity</span>
                    <span>{order.quantity}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Total</span>
                    <span className="font-semibold">
                      ৳{order.totalSalePrice}
                    </span>
                  </div>
                </div>

                <div className="rounded-md border p-3 text-sm">
                  <p className="font-semibold mb-2">
                    Shipping Address
                  </p>

                  <p>{order.address.address}</p>

                  <p>
                    {order.address.area},{" "}
                    {order.address.district}
                  </p>

                  <p>{order.address.division}</p>

                  <p>{order.address.postalCode}</p>

                  <p>{order.address.phone}</p>
                </div>

                <div className="flex justify-between">
                  <Badge
                    variant={
                      order.paymentStatus === "PAID"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {order.paymentStatus}
                  </Badge>

                  <Badge>
                    {order.orderStatus}
                  </Badge>
                </div>

                <Select
                  defaultValue={order.orderStatus}
                  onValueChange={(value) =>{
                    if(!value) return
                    updateStatus(order._id, value)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="PENDING">
                      Pending
                    </SelectItem>

                    <SelectItem value="CONFIRMED">
                      Confirmed
                    </SelectItem>
                   

                    <SelectItem value="SHIPPED">
                      Shipped
                    </SelectItem>

                    <SelectItem value="DELIVERED">
                      Delivered
                    </SelectItem>

                    <SelectItem value="CANCELLED">
                      Cancelled
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  className="w-full"
                  onClick={() =>
                    updateStatus(
                      order._id,
                      order.orderStatus
                    )
                  }
                >
                  Update Status
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}