"use client";

import { FormEvent, useState } from "react";

import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

import {
  CreditCard,
  Loader2,
  Lock,
} from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

interface PaymentFormProps {
  orderId: string;
  total: number;
}

export default function PaymentForm({
  orderId,
  total,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error(
        "Stripe is not ready."
      );
      return;
    }

    setLoading(true);

    const { error, paymentIntent } =
      await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

    if (error) {
      toast.error(
        error.message ??
          "Payment failed."
      );
      setLoading(false);
      return;
    }

    if (
      paymentIntent?.status ===
      "succeeded"
    ) {
      // Update payment status in database
      const res = await fetch(
        `/api/orders/${orderId}/payment`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            paymentIntentId:
              paymentIntent.id,
          }),
        }
      );

      const result = await res.json();

      if (result.success) {
        toast.success(
          "Payment successful!"
        );
      } else {
        toast.error(
          result.message
        );
      }
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="rounded-xl border p-5 shadow-sm">
        <PaymentElement
          options={{
            layout: "tabs",
          }}
        />
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Lock className="h-4 w-4 text-green-600" />
        Your payment is secured by Stripe.
      </div>

      <Button
        type="submit"
        className="h-12 w-full text-base font-semibold"
        disabled={
          !stripe || loading
        }
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-5 w-5" />
            Pay ৳{total}
          </>
        )}
      </Button>
    </form>
  );
}