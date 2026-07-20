

"use client";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { CheckCircle2, CreditCard, MapPin, Truck } from "lucide-react";
import Image from "next/image";
import Swal from "sweetalert2";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  const [address, setAddress] = useState<Address | null>(null);

  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [isOrdering, setIsOrdering] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [coupon, setCoupon] = useState<any>(null);
  const [loadingCoupon, setLoadingCoupon] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cartId || !userId) return;

    const loadData = async () => {
      try {
        const [productRes, addressRes] = await Promise.all([
          fetch(`/api/addToCart/singleproduct/${cartId}`),
          fetch(`/api/address/${userId}`),
        ]);

        const productResult = await productRes.json();
        const addressResult = await addressRes.json();

        if (productResult.success) {
          setProduct(productResult.data);
        }

        if (addressResult.success) {
          setAddress(addressResult.data);
          setSelectedAddress(addressResult.data._id);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [cartId, userId]);

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Enter coupon code");
      return;
    }

    if (!product) {
      toast.error("Product not loaded yet");
      return;
    }

    setLoadingCoupon(true);

    try {
      const res = await fetch("/api/coupons/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: couponCode,
          subtotal: product.totalSalePrice,
        }),
      });

      const result = await res.json();

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      setCoupon(result.data);
      setDiscount(result.data.discount);

      toast.success("Coupon applied successfully");
    } finally {
      setLoadingCoupon(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!product || !address || !userId) return;

    setIsOrdering(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          sellerId: product.sellerId,

          productId: product.productId,
          cartId: product._id,

          quantity: product.quantity,

          shippingFee: shipping,
          addressId: address._id,

          // if you want to send coupon info:
          couponId: coupon?._id ?? undefined,
          discount,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message ?? "Order failed");
      }

      await Swal.fire({
        icon: "success",
        title: "Order Placed!",
        text: "Your order has been placed successfully.",
        confirmButtonText: "OK",
        confirmButtonColor: "#16a34a",
      });

      // later replace with Stripe checkout or redirect
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Order Failed",
        text:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setIsOrdering(false);
    }
  };

  const shipping = 80;
  const subtotal = product?.totalSalePrice ?? 0;
  const total = subtotal + shipping - discount;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading checkout…</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="mb-2 text-2xl font-bold">Product not found</h2>
            <p className="text-muted-foreground">
              The item you’re trying to checkout with is unavailable.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <section className="bg-gradient-to-b from-background to-muted/30 py-12">
      <div className="container">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Checkout
          </h1>
          <p className="mt-2 text-muted-foreground">
            Review your order, choose a shipping address, and complete your
            purchase.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left: Address + Product */}
          <div className="space-y-6 lg:col-span-7">
            {/* Shipping Address */}
            <Card className="overflow-hidden shadow-sm">
              <div className="border-b bg-muted/40 px-6 py-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Shipping Address</h2>
                </div>
              </div>

              <CardContent className="p-6">
                <RadioGroup
                  value={selectedAddress}
                  onValueChange={setSelectedAddress}
                  className="space-y-3"
                >
                  {address ? (
                    <label
                      htmlFor={address._id}
                      className="group relative flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-colors hover:bg-muted/40"
                    >
                      <RadioGroupItem
                        value={address._id}
                        id={address._id}
                        className="mt-1"
                      />

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">
                            {address.area}, {address.district}
                          </h3>
                          {address.isDefault && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Default
                            </span>
                          )}
                        </div>

                        <p className="mt-2 text-sm text-muted-foreground">
                          {address.address}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <span>
                            {address.division} – {address.postalCode}
                          </span>
                          <span>Phone: {address.phone}</span>
                        </div>
                      </div>
                    </label>
                  ) : (
                    <div className="rounded-xl border border-dashed p-6 text-center text-muted-foreground">
                      No address found. Add a new address to continue.
                    </div>
                  )}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Product Card */}
            <Card className="overflow-hidden shadow-sm">
              <div className="border-b bg-muted/40 px-6 py-4">
                <h2 className="text-lg font-semibold">Order Item</h2>
              </div>

              <CardContent className="p-6">
                <div className="flex flex-col gap-6 sm:flex-row">
                  <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-xl sm:mx-0 sm:h-44 sm:w-44">
                    <Image
                      src={product.thumbnail}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 160px, 176px"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{product.name}</h3>

                      <div className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                        <div>
                          <p className="text-muted-foreground">Unit price</p>
                          <p className="font-medium">৳{product.salePrice}</p>
                        </div>

                        <div>
                          <p className="text-muted-foreground">Quantity</p>
                          <p className="font-medium">{product.quantity}</p>
                        </div>

                        <div>
                          <p className="text-muted-foreground">Stock</p>
                          <p className="font-medium">{product.stock}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">
                        Item total
                      </p>
                      <p className="text-2xl font-extrabold text-green-600">
                        ৳{product.totalSalePrice}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5">
            <Card className="sticky top-6 overflow-hidden shadow-md">
              <div className="border-b bg-primary/5 px-6 py-4">
                <h2 className="text-lg font-semibold">Order Summary</h2>
              </div>

              <CardContent className="space-y-5 p-6">
                {/* Coupon */}
                <div className="space-y-2">
                  <Label htmlFor="couponCode">Coupon Code</Label>
                  <div className="flex gap-2">
                    <Input
                      id="couponCode"
                      placeholder="Enter coupon"
                      value={couponCode}
                      onChange={(e) =>
                        setCouponCode(e.target.value.toUpperCase())
                      }
                    />
                    <Button onClick={applyCoupon} disabled={loadingCoupon}>
                      {loadingCoupon ? "Applying..." : "Apply"}
                    </Button>
                  </div>
                  {discount > 0 && (
                    <p className="text-xs text-green-600">
                      Discount applied: ৳{discount}
                    </p>
                  )}
                </div>

                {/* Price breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">৳{subtotal}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Truck className="h-4 w-4" />
                      Shipping
                    </span>
                    <span className="font-medium">৳{shipping}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span className="font-medium">-৳{discount}</span>
                    </div>
                  )}
                </div>

                <hr className="border-muted" />

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-xs text-muted-foreground">
                      Includes shipping{discount > 0 ? " and discount" : ""}
                    </p>
                  </div>
                  <p className="text-2xl font-extrabold">৳{total}</p>
                </div>

                <div className="rounded-xl border bg-muted/30 p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-background p-2 shadow-sm">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>

                    <div>
                      <p className="font-semibold">Stripe Payment</p>
                      <p className="text-sm text-muted-foreground">
                        Secure online payment via Stripe
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full text-base"
                  size="lg"
                  disabled={!address || isOrdering}
                  onClick={handlePlaceOrder}
                >
                  {isOrdering ? "Placing Order..." : "Place Order"}
                </Button>

                {!address && (
                  <p className="text-center text-xs text-destructive">
                    Please add a shipping address to continue.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}