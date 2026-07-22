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
  Truck,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";



interface Order {
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
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);


export default function PaymentPage() {
  const { orderId } = useParams();
 
  const [order, setOrder] = useState<Order | null>(null);
  const [clientSecret, setClientSecret] =
  useState("");

  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const loadOrder = async () => {
      const res = await fetch(`/api/orders/${orderId}`);

      const result = await res.json();

      if (result.success) {
        setOrder(result.data);
      }

      setLoading(false);
    };

    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        Loading...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 text-center">
        Order not found.
      </div>
    );
  }

  const total =
    order.totalSalePrice + order.shippingFee;

  return (
    <section className="container py-10">
      <div className="grid gap-8 lg:grid-cols-3">

        {/* Left */}

        <div className="space-y-6 lg:col-span-2">

          <Card>
            <CardContent className="flex gap-6 p-6">

              <Image
                src={order.thumbnail}
                alt={order.productName}
                width={140}
                height={140}
                className="rounded-lg border object-cover"
              />

              <div className="space-y-2">

                <h2 className="text-xl font-bold">
                  {order.productName}
                </h2>

                <p className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-blue-500" />
                  Quantity :
                  {order.quantity}
                </p>

                <p>
                  Price : ৳
                  {order.salePrice}
                </p>

                <p className="font-semibold text-lg">
                  Total :
                  ৳{order.totalSalePrice}
                </p>

              </div>

            </CardContent>
          </Card>

          <Card>

            <CardContent className="space-y-3 p-6">

              <h2 className="flex items-center gap-2 text-xl font-bold">
                <MapPin className="text-red-500" />
                Shipping Address
              </h2>

              <p>{order.address.address}</p>

              <p>
                {order.address.area},{" "}
                {order.address.district}
              </p>

              <p>{order.address.division}</p>

              <p>{order.address.postalCode}</p>

              <p>{order.address.phone}</p>

            </CardContent>

          </Card>

        </div>

        {/* Right */}

        <Card className="h-fit">

          <CardContent className="space-y-6 p-6">

            <h2 className="text-2xl font-bold">
              Payment Summary
            </h2>

            <div className="flex justify-between">
              <span>Subtotal</span>

              <span>
                ৳{order.totalSalePrice}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="flex items-center gap-2">
                <Truck className="h-4 w-4" />

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
                ৳{total}
              </span>

            </div>

            <div className="rounded-lg border p-4">

              <div className="flex items-center gap-3">

                <CreditCard className="h-6 w-6 text-primary" />

                <div>

                  <p className="font-semibold">
                    Stripe Payment
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Secure online payment
                  </p>

                </div>

              </div>

            </div>

            {/* Stripe CardElement goes here */}

            <div className="rounded-lg border p-6">

              Stripe Card Element

            </div>

            <Button className="w-full h-11 text-base">
              Pay ৳{total}
            </Button>

          </CardContent>

        </Card>

      </div>
    </section>
  );
}