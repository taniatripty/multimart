"use client";

import { FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Home,
  Building2,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export default function CreateAddressPage() {
  const { data: session } = useSession();

  const userId = (session?.user as { id?: string })?.id;

  const [phone, setPhone] = useState("");
  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [area, setArea] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [address, setAddress] = useState("");
  const [addressType, setAddressType] = useState<
    "Home" | "Office"
  >("Home");

  const [isDefault, setIsDefault] = useState(true);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setPhone("");
    setDivision("");
    setDistrict("");
    setArea("");
    setPostalCode("");
    setAddress("");
    setAddressType("Home");
    setIsDefault(true);
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!userId) {
      toast.error("Please login first.");
      return;
    }

    if (!phone.trim()) {
      toast.error("Phone number is required.");
      return;
    }

    if (!division.trim()) {
      toast.error("Division is required.");
      return;
    }

    if (!district.trim()) {
      toast.error("District is required.");
      return;
    }

    if (!area.trim()) {
      toast.error("Area is required.");
      return;
    }

    if (!address.trim()) {
      toast.error("Address is required.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        userId,
        phone,
        division,
        district,
        area,
        postalCode,
        address,
        addressType,
        isDefault,
      };

      const res = await fetch("/api/address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      resetForm();
    } catch {
      toast.error("Failed to create address.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-6">
      <Card className="mx-auto max-w-4xl shadow-lg">
        <CardContent className="space-y-8 p-8">
          <div>
            <h1 className="text-3xl font-bold">
              Add Shipping Address
            </h1>

            <p className="mt-2 text-muted-foreground">
              Save your shipping address for faster
              checkout.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="grid gap-6 md:grid-cols-2">
              {/* Name */}
              <div>
                <Label>Full Name</Label>

                <div className="relative mt-2">
                  <User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

                  <Input
                    className="pl-10"
                    value={session?.user?.name ?? ""}
                    disabled
                    readOnly
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <Label>Email</Label>

                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

                  <Input
                    className="pl-10"
                    value={session?.user?.email ?? ""}
                    disabled
                    readOnly
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <Label>Phone Number</Label>

                <div className="relative mt-2">
                  <Phone className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

                  <Input
                    className="pl-10"
                    placeholder="017XXXXXXXX"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Division */}
              <div>
                <Label>Division</Label>

                <div className="relative mt-2">
                  <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

                  <Input
                    className="pl-10"
                    placeholder="Dhaka"
                    value={division}
                    onChange={(e) =>
                      setDivision(e.target.value)
                    }
                  />
                </div>
              </div>

              {/* District */}
              <div>
                <Label>District</Label>

                <div className="relative mt-2">
                  <Building2 className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

                  <Input
                    className="pl-10"
                    placeholder="Gazipur"
                    value={district}
                    onChange={(e) =>
                      setDistrict(e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Area */}
              <div>
                <Label>Area / Upazila</Label>

                <div className="relative mt-2">
                  <Home className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

                  <Input
                    className="pl-10"
                    placeholder="Tongi"
                    value={area}
                    onChange={(e) =>
                      setArea(e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Postal Code */}
              <div>
                <Label>Postal Code</Label>

                <Input
                  className="mt-2"
                  placeholder="1710"
                  value={postalCode}
                  onChange={(e) =>
                    setPostalCode(e.target.value)
                  }
                />
              </div>

              {/* Address Type */}
              <div>
                <Label>Address Type</Label>

                <select
                  className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm"
                  value={addressType}
                  onChange={(e) =>
                    setAddressType(
                      e.target.value as
                        | "Home"
                        | "Office"
                    )
                  }
                >
                  <option value="Home">
                    🏠 Home
                  </option>

                  <option value="Office">
                    🏢 Office
                  </option>
                </select>
              </div>
            </div>

            {/* Address */}
            <div>
              <Label>Full Address</Label>

              <Textarea
                className="mt-2 min-h-32"
                placeholder="House No, Road No, Village, Landmark..."
                value={address}
                onChange={(e) =>
                  setAddress(e.target.value)
                }
              />
            </div>

            {/* Default */}
            <div className="flex items-center justify-between rounded-lg border p-5">
              <div>
                <Label>Default Address</Label>

                <p className="text-sm text-muted-foreground">
                  Use this address as your default
                  shipping address.
                </p>
              </div>

              <Switch
                checked={isDefault}
                onCheckedChange={setIsDefault}
              />
            </div>

            <Button
              className="w-full"
              disabled={loading}
            >
              {loading
                ? "Saving Address..."
                : "Save Address"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
