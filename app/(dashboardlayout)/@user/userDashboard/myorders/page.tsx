"use client";

import { CreditCard, Eye, MessageCircle, Package } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface Order {
  _id: string;
  productId: string;
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
    return <div className="py-20 text-center">Loading orders...</div>;
  }

  return (
    <section className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Orders</h1>

        <p className="text-muted-foreground">
          Track all of your purchased products.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-xl border py-20 text-center">
          <Package className="mx-auto mb-4 h-14 w-14 text-muted-foreground" />

          <h2 className="text-xl font-semibold">No Orders Found</h2>

          <p className="mt-2 text-muted-foreground">
            You have not placed any orders yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
          {orders.map((order) => (
            <Card
  key={order._id}
  className="group overflow-hidden rounded-2xl border-0 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-zinc-900"
>
  {/* Product Image */}
  <div className="relative overflow-hidden">
    <Image
      src={order.thumbnail}
      alt={order.productName}
      width={500}
      height={350}
      className="h-60 w-full object-cover transition-transform duration-500 group-hover:scale-105"
    />

    <div className="absolute right-4 top-4 flex gap-2">
      <Badge
        variant={order.paymentStatus === "PAID" ? "default" : "secondary"}
        className="rounded-full px-3 py-1"
      >
        {order.paymentStatus}
      </Badge>

      <Badge
        className={`rounded-full px-3 py-1 text-white
          ${
            order.orderStatus === "PENDING"
              ? "bg-yellow-500"
              : order.orderStatus === "CONFIRMED"
                ? "bg-blue-500"
                : order.orderStatus === "SHIPPED"
                  ? "bg-purple-500"
                  : order.orderStatus === "DELIVERED"
                    ? "bg-green-600"
                    : "bg-red-500"
          }`}
      >
        {order.orderStatus}
      </Badge>
    </div>
  </div>

  <CardContent className="space-y-5 p-6">
    {/* Title */}
    <div>
      <h2 className="line-clamp-2 text-xl font-bold">
        {order.productName}
      </h2>

      <p className="mt-2 text-sm text-muted-foreground">
        Ordered on{" "}
        {new Date(order.createdAt).toLocaleDateString()}
      </p>
    </div>

    {/* Price Box */}
    <div className="rounded-xl bg-muted/40 p-4">
      <div className="flex items-center justify-between py-1">
        <span className="text-muted-foreground">Quantity</span>

        <span className="font-semibold">{order.quantity}</span>
      </div>

      <div className="flex items-center justify-between py-1">
        <span className="text-muted-foreground">Price</span>

        <span className="font-semibold">
          ৳{order.salePrice.toLocaleString()}
        </span>
      </div>

      <div className="mt-2 border-t pt-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold">Total</span>

          <span className="text-xl font-bold text-primary">
            ৳{order.totalSalePrice.toLocaleString()}
          </span>
        </div>
      </div>
    </div>

    {/* Buttons */}
    <div className="space-y-3">
      <Button
        asChild
        variant="outline"
        className="w-full justify-center rounded-xl"
      >
        <Link href={`/allProducts/${order.productId}`}>
          <Eye className="mr-2 h-5 w-5 shrink-0" />
          View Product
        </Link>
      </Button>

      <Button
        asChild
        variant="outline"
        className="w-full justify-center rounded-xl border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
      >
        <Link href={`/userDashboard/chat/${order._id}`}>
          <MessageCircle className="mr-2 h-5 w-5 shrink-0" />
          Chat with Seller
        </Link>
      </Button>

      {order.paymentStatus === "PAID" ? (
        <Button
          disabled
          className="w-full rounded-xl bg-emerald-600 text-white"
        >
          <CreditCard className="mr-2 h-5 w-5" />
          Payment Completed
        </Button>
      ) : (
        <Button
          asChild
          className="w-full rounded-xl bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white hover:from-orange-600 hover:via-red-600 hover:to-pink-600"
        >
          <Link href={`/userDashboard/checkout/payment/${order._id}`}>
            <CreditCard className="mr-2 h-5 w-5 shrink-0" />
            Pay Now
          </Link>
        </Button>
      )}
    </div>
  </CardContent>
</Card>
          ))}
        </div>
      )}
    </section>
  );
}

