

"use client";

import { useState } from "react";
import {
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Props = {
  orderId: string;
  amount: number;
};

export default function PaymentForm({
  orderId,
  amount,
}: Props) {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setError("");

    try {
      // Create Payment Intent
      const res = await fetch("/api/payment/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          amount,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      const clientSecret = data.clientSecret;

      const card = elements.getElement(CardElement);

      if (!card) {
        throw new Error("Card not found");
      }

      const payment = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card,
          },
        }
      );

      if (payment.error) {
        throw new Error(payment.error.message);
      }

      if (
        payment.paymentIntent?.status === "succeeded"
      ) {
        await fetch(`/api/payment/success/${orderId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transactionId:
              payment.paymentIntent.id,
          }),
        });

        toast.success("Payment Successful 🎉");
      }
    } catch (error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : "Something went wrong";

  setError(message);
  toast.error(message);
} finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handlePayment}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-semibold">
          Total Payment
        </h2>

        <p className="text-3xl font-bold text-primary mt-2">
          ${amount}
        </p>
      </div>

      <div className="rounded-lg border bg-background p-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#dc2626",
              },
            },
          }}
        />
      </div>

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={!stripe || loading}
      >
        {loading
          ? "Processing..."
          : `Pay $${amount}`}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Secure payment powered by Stripe.
      </p>
    </form>
  );
}