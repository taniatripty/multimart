"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Order {
  _id: string;
  productId: string;
  productName: string;
  sellerId:string;
  userId:string;
}

export default function ReviewPage() {
  

  const {id} = useParams()
  console.log(id)

  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);

  const [rating, setRating] = useState(5);

  const [review, setReview] = useState("");

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`);

        const result = await res.json();

        if (result.success) {
          setOrder(result.data);
        } else {
          toast.error(result.message);
        }
      } catch {
        toast.error("Failed to load order.");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  const handleSubmit = async () => {
    if (!review.trim()) {
      toast.error("Please write your review.");
      return;
    }

    if (!order) {
      toast.error("Order not found.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: order._id,
          sellerId:order.sellerId,
          userId:order.userId,
          productId: order.productId,
          rating,
          review,
        }),
      });

      const result = await res.json();

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success("Review submitted successfully.");

      
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

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

  return (
    <section className="container max-w-2xl py-10">
      <Card>
        <CardContent className="space-y-8 p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">
              Write Review
            </h1>

            <p className="mt-2 text-muted-foreground">
              {order.productName}
            </p>
          </div>

          <div className="space-y-3">
            <Label>Rating</Label>

            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`h-9 w-9 transition-all ${
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Review</Label>

            <Textarea
              rows={6}
              placeholder="Share your experience with this product..."
              value={review}
              onChange={(e) =>
                setReview(e.target.value)
              }
            />
          </div>

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting
              ? "Submitting..."
              : "Submit Review"}
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}