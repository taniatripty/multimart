"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreateCouponPage() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    code: "",
    description: "",
    discountType: "PERCENTAGE",

    discountValue: "",

    minimumPurchase: "",

    maximumDiscount: "",

    usageLimit: "",

    startDate: "",

    expireDate: "",

    status: "ACTIVE",
  });

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch("/api/coupons", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          ...form,

          discountValue: Number(
            form.discountValue
          ),

          minimumPurchase: Number(
            form.minimumPurchase
          ),

          maximumDiscount: Number(
            form.maximumDiscount
          ),

          usageLimit: Number(
            form.usageLimit
          ),
        }),
      });

      const result = await res.json();

      if (!result.success) {
        toast.error(result.message);

        return;
      }

      toast.success("Coupon created.");

      setForm({
        code: "",
        description: "",
        discountType: "PERCENTAGE",

        discountValue: "",

        minimumPurchase: "",

        maximumDiscount: "",

        usageLimit: "",

        startDate: "",

        expireDate: "",

        status: "ACTIVE",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto w-11/12 p-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="mb-6 text-2xl font-bold">
            Create Coupon
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid gap-6 md:grid-cols-2"
          >
            <div className="space-y-2">
              <Label>Coupon Code</Label>

              <Input
                placeholder="SUMMER20"
                value={form.code}
                onChange={(e) =>
                  setForm({
                    ...form,
                    code: e.target.value.toUpperCase(),
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>

              <Select
                value={form.status}
                onValueChange={(value) =>
                  setForm({
                    ...form,
                     status: value ?? "ACTIVE",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="ACTIVE">
                    Active
                  </SelectItem>

                  <SelectItem value="INACTIVE">
                    Inactive
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Description</Label>

              <Input
                placeholder="Summer Sale Coupon"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description:
                      e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Discount Type</Label>

              <Select
                value={form.discountType}
                onValueChange={(value) =>
                  setForm({
                    ...form,
                    discountType: value ?? "PERCENTAGE",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="PERCENTAGE">
                    Percentage
                  </SelectItem>

                  <SelectItem value="FIXED">
                    Fixed Amount
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Discount Value</Label>

              <Input
                type="number"
                value={form.discountValue}
                onChange={(e) =>
                  setForm({
                    ...form,
                    discountValue:
                      e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>
                Minimum Purchase
              </Label>

              <Input
                type="number"
                value={form.minimumPurchase}
                onChange={(e) =>
                  setForm({
                    ...form,
                    minimumPurchase:
                      e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>
                Maximum Discount
              </Label>

              <Input
                type="number"
                value={form.maximumDiscount}
                onChange={(e) =>
                  setForm({
                    ...form,
                    maximumDiscount:
                      e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Usage Limit</Label>

              <Input
                type="number"
                value={form.usageLimit}
                onChange={(e) =>
                  setForm({
                    ...form,
                    usageLimit:
                      e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Start Date</Label>

              <Input
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    startDate:
                      e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Expire Date</Label>

              <Input
                type="date"
                value={form.expireDate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    expireDate:
                      e.target.value,
                  })
                }
              />
            </div>

            <div className="md:col-span-2">
              <Button
                className="w-full"
                disabled={loading}
              >
                {loading
                  ? "Creating..."
                  : "Create Coupon"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}

