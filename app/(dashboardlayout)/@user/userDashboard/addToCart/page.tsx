"use client";

import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CartItem {
  _id: string;
  productId: string;

  name: string;
  thumbnail: string;

  price: number;
  salePrice: number;

  quantity: number;

  totalPrice: number;
  totalSalePrice: number;

  stock: number;
}

export default function MyCartPage() {
  const { data: session } = useSession();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchCart = async () => {
      try {
        const res = await fetch(`/api/addToCart/${session.user.id}`, {
          cache: "no-store",
        });

        const result = await res.json();

        if (result.success) {
          setCart(result.data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [session]);

  const grandTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.totalSalePrice, 0);
  }, [cart]);

  const increaseQuantity = async (item: CartItem) => {
    if (item.quantity >= item.stock) {
      Swal.fire("Stock Limit", "No more stock available.", "warning");
      return;
    }

    try {
      const res = await fetch(`/api/cart/${item._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity: item.quantity + 1,
        }),
      });

      const result = await res.json();

      if (!result.success) {
        Swal.fire("Error", result.message, "error");
        return;
      }

      setCart((prev) =>
        prev.map((cartItem) =>
          cartItem._id === item._id
            ? {
                ...cartItem,
                quantity: item.quantity + 1,
                totalPrice: item.price * (item.quantity + 1),
                totalSalePrice: item.salePrice * (item.quantity + 1),
              }
            : cartItem,
        ),
      );
    } catch {}
  };

  const decreaseQuantity = async (item: CartItem) => {
    if (item.quantity <= 1) return;

    try {
      const res = await fetch(`/api/cart/${item._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity: item.quantity - 1,
        }),
      });

      const result = await res.json();

      if (!result.success) {
        Swal.fire("Error", result.message, "error");
        return;
      }

      setCart((prev) =>
        prev.map((cartItem) =>
          cartItem._id === item._id
            ? {
                ...cartItem,
                quantity: item.quantity - 1,
                totalPrice: item.price * (item.quantity - 1),
                totalSalePrice: item.salePrice * (item.quantity - 1),
              }
            : cartItem,
        ),
      );
    } catch {}
  };

  const removeItem = async (id: string) => {
    const result = await Swal.fire({
      title: "Remove item?",
      text: "Remove this item from cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Remove",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/addToCart/remove/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!data.success) {
        Swal.fire("Error", data.message, "error");
        return;
      }

      setCart((prev) => prev.filter((item) => item._id !== id));

      Swal.fire("Removed!", "Item removed successfully.", "success");
    } catch {}
  };

  if (loading) {
    return <div className="py-20 text-center">Loading...</div>;
  }

  return (
    <section className="container py-8">
      <h1 className="mb-8 text-3xl font-bold">My Cart</h1>

      {cart.length === 0 ? (
        <div className="rounded-lg border py-20 text-center">
          <ShoppingCart className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />

          <h2 className="text-xl font-semibold">Your cart is empty</h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
  {cart.map((item) => (
    <Card
      key={item._id}
      className="overflow-hidden transition-all duration-300 hover:shadow-lg"
    >
      <Image
        src={item.thumbnail}
        alt={item.name}
        width={500}
        height={320}
        className="h-60 w-full object-cover"
      />

      <CardContent className="space-y-4 p-5">
        <div>
          <h2 className="line-clamp-2 text-lg font-bold">
            {item.name}
          </h2>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Unit Price
            </span>

            <span className="font-semibold text-green-600">
              ৳{item.salePrice}
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Stock
            </span>

            <span>{item.stock}</span>
          </div>
        </div>

        {/* Quantity */}
        <div className="flex items-center justify-between rounded-lg border p-3">
          <span className="font-medium">
            Quantity
          </span>

          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              disabled={item.quantity <= 1}
              onClick={() => decreaseQuantity(item)}
            >
              <Minus className="h-4 w-4" />
            </Button>

            <span className="w-8 text-center font-semibold">
              {item.quantity}
            </span>

            <Button
              size="icon"
              variant="outline"
              disabled={item.quantity >= item.stock}
              onClick={() => increaseQuantity(item)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Total */}
        <div className="rounded-lg bg-muted p-3">
          <div className="flex justify-between">
            <span>Total Price</span>

            <span className="text-lg font-bold text-green-600">
              ৳{item.totalSalePrice}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            className="flex-1"
            onClick={() =>
              (window.location.href = `/userDashboard/checkout/${item._id}`)
            }
          >
            Proceed to Checkout
          </Button>

          <Button
            variant="destructive"
            onClick={() => removeItem(item._id)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Remove
          </Button>
        </div>
      </CardContent>
    </Card>
  ))}
</div>
      )}
    </section>
  );
}
