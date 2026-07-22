
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import {
  CreditCard,
  MapPin,
  Package,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import PaymentForm from "../paymentForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

type Order = {
  _id: string;

  productName: string;
  thumbnail: string;

  quantity: number;

  salePrice: number;
  totalSalePrice: number;
  shippingFee: number;

  paymentStatus: string;

  address: {
    phone: string;
    division: string;
    district: string;
    area: string;
    postalCode: string;
    address: string;
  };
};

export default function PaymentPage() {
  const { orderId } = useParams();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);

        const result = await res.json();

        if (result.success) {
          setOrder(result.data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="container py-20 text-center">
        Loading...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-20 text-center">
        Order not found.
      </div>
    );
  }

  const grandTotal =
    order.totalSalePrice + order.shippingFee;

  return (
    <section className="container py-10">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left */}

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardContent className="flex flex-col gap-5 p-6 sm:flex-row">
              <Image
                src={order.thumbnail}
                alt={order.productName}
                width={170}
                height={170}
                className="rounded-xl border object-cover"
              />

              <div className="flex-1 space-y-3">
                <Badge>
                  Order #{order._id.slice(-8)}
                </Badge>

                <h2 className="text-2xl font-bold">
                  {order.productName}
                </h2>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-blue-500" />
                      Quantity
                    </span>

                    <span>{order.quantity}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Unit Price</span>

                    <span>
                      ৳{order.salePrice}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Status</span>

                    <Badge
                      variant={
                        order.paymentStatus === "PAID"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {order.paymentStatus}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 p-6">
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <MapPin className="text-red-500" />
                Shipping Address
              </h2>

              <div className="space-y-1 text-sm">
                <p>{order.address.address}</p>

                <p>
                  {order.address.area},{" "}
                  {order.address.district}
                </p>

                <p>{order.address.division}</p>

                <p>{order.address.postalCode}</p>

                <p>{order.address.phone}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right */}

        <Card className="h-fit">
          <CardContent className="space-y-6 p-6">
            <h2 className="text-2xl font-bold">
              Payment Summary
            </h2>

            <div className="space-y-4 rounded-xl border p-5">
              <div className="flex justify-between">
                <span>Subtotal</span>

                <span>
                  ৳{order.totalSalePrice}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-blue-500" />
                  Shipping
                </span>

                <span>
                  ৳{order.shippingFee}
                </span>
              </div>

              <hr />

              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>

                <span>
                  ৳{grandTotal}
                </span>
              </div>
            </div>

            <div className="rounded-xl border bg-muted/30 p-5">
              <div className="flex items-start gap-3">
                <CreditCard className="mt-1 h-6 w-6 text-primary" />

                <div>
                  <h3 className="font-semibold">
                    Stripe Secure Checkout
                  </h3>

                
                </div>
              </div>

              
            </div>

            <Elements stripe={stripePromise}>
              <PaymentForm
                orderId={order._id}
                amount={grandTotal}
              />
            </Elements>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}