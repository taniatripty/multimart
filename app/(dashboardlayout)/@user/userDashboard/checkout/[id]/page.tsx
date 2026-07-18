"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

import Image from "next/image";
import { CreditCard, MapPin, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Address {
  _id: string;
  phone: string;
  division: string;
  district: string;
  area: string;
  address: string;
  postalCode: string;
  isDefault: boolean;
}

interface CartItem {
  _id: string;
  productId: string;

  name: string;
  thumbnail: string;

  quantity: number;

  price: number;
  salePrice: number;

  totalPrice: number;
  totalSalePrice: number;

  stock: number;

  sellerId: string;
}

export default function CheckoutPage() {
  const { id } = useParams();

  const cartId = id as string;

  const { data: session } = useSession();

  const userId = (session?.user as { id?: string })?.id;

  const [product, setProduct] = useState<CartItem | null>(null);

  const [addresses, setAddresses] = useState<Address[]>([]);

  const [selectedAddress, setSelectedAddress] =
    useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cartId || !userId) return;

    const loadData = async () => {
      try {
        const [productRes, addressRes] =
          await Promise.all([
            fetch(`/api/addToCart/singleproduct/${cartId}`),
            fetch(`/api/myaddress/${userId}`),
          ]);

        const productResult =
          await productRes.json();

        const addressResult =
          await addressRes.json();

        if (productResult.success) {
          setProduct(productResult.data);
        }

        if (addressResult.success) {
          setAddresses(addressResult.data);

          const defaultAddress =
            addressResult.data.find(
              (item: Address) => item.isDefault
            );

          if (defaultAddress) {
            setSelectedAddress(
              defaultAddress._id
            );
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [cartId, userId]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        Loading...
      </div>
    );
  }
  console.log(addresses)

  if (!product) {
    return (
      <div className="py-20 text-center">
        Product not found.
      </div>
    );
  }

  const shipping = 80;

  const total =
    product.totalSalePrice + shipping;

  return (
    <section className="container py-10">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left */}
        <div className="space-y-6 lg:col-span-2">
          {/* Address */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-6 text-xl font-bold">
                Shipping Address
              </h2>

              <RadioGroup
                value={selectedAddress}
                onValueChange={
                  setSelectedAddress
                }
                className="space-y-4"
              >
                {addresses.map((address) => (
                  <div
                    key={address._id}
                    className="rounded-lg border p-4"
                  >
                    <div className="flex gap-4">
                      <RadioGroupItem
                        value={address._id}
                        id={address._id}
                      />

                      <Label
                        htmlFor={address._id}
                        className="cursor-pointer"
                      >
                        <div className="font-semibold">
                          {address.area},{" "}
                          {address.district}
                        </div>

                        <p className="text-sm">
                          {address.address}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          {address.phone}
                        </p>
                      </Label>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Product */}
          <Card>
            <CardContent className="flex gap-6 p-6">
              <Image
                src={product.thumbnail}
                alt={product.name}
                width={150}
                height={150}
                className="rounded-lg object-cover"
              />

              <div className="space-y-2">
                <h2 className="text-xl font-bold">
                  {product.name}
                </h2>

                <p>
                  Price: ৳
                  {product.salePrice}
                </p>

                <p>
                  Quantity:{" "}
                  {product.quantity}
                </p>

                <p className="font-semibold">
                  Total: ৳
                  {product.totalSalePrice}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right */}
        <Card className="h-fit">
          <CardContent className="space-y-5 p-6">
            <h2 className="text-xl font-bold">
              Order Summary
            </h2>

            <div className="flex justify-between">
              <span>Subtotal</span>

              <span>
                ৳{product.totalSalePrice}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Shipping
              </span>

              <span>৳80</span>
            </div>

            <hr />

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>

              <span>৳{total}</span>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5" />

                <div>
                  <p className="font-medium">
                    Stripe Payment
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Secure online payment
                  </p>
                </div>
              </div>
            </div>

            <Button className="w-full">
              Place Order
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}