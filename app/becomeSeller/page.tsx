

"use client";

import { FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import {
  FileText,
  Globe,
  MapPin,
  Phone,
  Store,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function BecomeSellerPage() {
  const { data: session, status } = useSession();

  const [shopName, setShopName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);

  if (status === "loading") {
    return (
      <div className="container mx-auto py-20 text-center">
        Loading...
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h2 className="text-2xl font-semibold">
          Please login to become a seller.
        </h2>
      </div>
    );
  }

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch("/api/seller/become", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shopName,
          phone,
          address,
          website,
          description,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      setShopName("");
      setPhone("");
      setAddress("");
      setWebsite("");
      setDescription("");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-slate-50 py-16">
      <div className="container mx-auto max-w-3xl px-4">
        <Card className="border-0 shadow-xl">
          <CardContent className="p-8">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-slate-900">
                Become a Seller
              </h1>

              <p className="mt-2 text-slate-500">
                Complete the form below to request seller access.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Full Name
                </label>

                <Input
                  value={session.user.name ?? ""}
                  disabled
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Email
                </label>

                <Input
                  value={session.user.email ?? ""}
                  disabled
                />
              </div>

              {/* Shop Name */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Shop Name
                </label>

                <div className="relative">
                  <Store className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />

                  <Input
                    className="pl-10"
                    placeholder="Tech World"
                    value={shopName}
                    onChange={(e) =>
                      setShopName(e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Phone Number
                </label>

                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />

                  <Input
                    className="pl-10"
                    placeholder="+8801XXXXXXXXX"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Business Address
                </label>

                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />

                  <Input
                    className="pl-10"
                    placeholder="Dhaka, Bangladesh"
                    value={address}
                    onChange={(e) =>
                      setAddress(e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              {/* Website */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Website (Optional)
                </label>

                <div className="relative">
                  <Globe className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />

                  <Input
                    className="pl-10"
                    placeholder="https://example.com"
                    value={website}
                    onChange={(e) =>
                      setWebsite(e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Business Description
                </label>

                <div className="relative">
                  <FileText className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />

                  <Textarea
                    className="min-h-32 pl-10 pt-3"
                    placeholder="Tell us about your business..."
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full"
              >
                {loading
                  ? "Submitting..."
                  : "Submit Seller Request"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}