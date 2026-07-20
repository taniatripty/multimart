// "use client";

// import { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
// import Image from "next/image";
// import { Package } from "lucide-react";
// import { toast } from "sonner";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent } from "@/components/ui/card";

// interface Order {
//   _id: string;

//   productName: string;
//   thumbnail: string;

//   quantity: number;

//   totalSalePrice: number;

//   paymentStatus: string;
//   orderStatus: string;

//   createdAt: string;

//   user: {
//     _id: string;
//     name: string;
//     email: string;
//     image: string;
//   };

//   seller: {
//     _id: string;
//     name: string;
//     email: string;
//     image: string;
//   };
// }

// export default function ManageOrdersPage() {
//   const { data: session } = useSession();
// const userId = (session?.user as { id?: string })?.id;
 

//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//   if (!userId) return;

//   const fetchOrders = async () => {
//     try {
//       const res = await fetch(
//         `/api/orders?userId=${userId}`,
//         {
//           cache: "no-store",
//         }
//       );

//       const result = await res.json();

//       if (result.success) {
//         setOrders(result.data);
//       } else {
//         toast.error(result.message);
//       }
//     } catch {
//       toast.error("Failed to load orders.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchOrders();
// }, [userId]);

//   if (loading) {
//     return (
//       <div className="py-20 text-center">
//         Loading orders...
//       </div>
//     );
//   }

//   return (
//     <section className="p-6">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold">
//           Manage Orders
//         </h1>

//         <p className="text-muted-foreground">
//           View all customer orders.
//         </p>
//       </div>

//       {orders.length === 0 ? (
//         <Card>
//           <CardContent className="py-20 text-center">
//             <Package className="mx-auto mb-4 h-14 w-14 text-muted-foreground" />

//             <h2 className="text-xl font-semibold">
//               No Orders Found
//             </h2>
//           </CardContent>
//         </Card>
//       ) : (
//         <Card>
//           <CardContent className="p-0">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Product</TableHead>

//                   <TableHead>Customer</TableHead>

//                   <TableHead>Seller</TableHead>

//                   <TableHead>Qty</TableHead>

//                   <TableHead>Total</TableHead>

//                   <TableHead>Payment</TableHead>

//                   <TableHead>Status</TableHead>

//                   <TableHead>Date</TableHead>
//                 </TableRow>
//               </TableHeader>

//               <TableBody>
//                 {orders.map((order) => (
//                   <TableRow key={order._id}>
//                     <TableCell>
//                       <div className="flex items-center gap-3">
//                         <Image
//                           src={order.thumbnail}
//                           alt={order.productName}
//                           width={55}
//                           height={55}
//                           className="rounded-md object-cover"
//                         />

//                         <div>
//                           <p className="font-medium">
//                             {order.productName}
//                           </p>
//                         </div>
//                       </div>
//                     </TableCell>

//                     <TableCell>
//                       <div className="flex items-center gap-3">
//                         <Image
//                           src={order.user.image}
//                           alt={order.user.name}
//                           width={40}
//                           height={40}
//                           className="rounded-full object-cover"
//                         />

//                         <div>
//                           <p className="font-medium">
//                             {order.user.name}
//                           </p>

//                           <p className="text-xs text-muted-foreground">
//                             {order.user.email}
//                           </p>
//                         </div>
//                       </div>
//                     </TableCell>

//                     <TableCell>
//                       <div className="flex items-center gap-3">
//                         <Image
//                           src={order.seller.image}
//                           alt={order.seller.name}
//                           width={40}
//                           height={40}
//                           className="rounded-full object-cover"
//                         />

//                         <div>
//                           <p className="font-medium">
//                             {order.seller.name}
//                           </p>

//                           <p className="text-xs text-muted-foreground">
//                             {order.seller.email}
//                           </p>
//                         </div>
//                       </div>
//                     </TableCell>

//                     <TableCell>{order.quantity}</TableCell>

//                     <TableCell>
//                       <span className="font-semibold">
//                         ৳{order.totalSalePrice}
//                       </span>
//                     </TableCell>

//                     <TableCell>
//                       <Badge
//                         className={
//                           order.paymentStatus === "Paid"
//                             ? "bg-green-600 hover:bg-green-600"
//                             : "bg-red-600 hover:bg-red-600"
//                         }
//                       >
//                         {order.paymentStatus}
//                       </Badge>
//                     </TableCell>

//                     <TableCell>
//                       <Badge
//                         className={
//                           order.orderStatus === "PENDING"
//                             ? "bg-yellow-500 hover:bg-yellow-500"
//                             : order.orderStatus ===
//                                 "CONFIRMED"
//                               ? "bg-blue-500 hover:bg-blue-500"
//                               : order.orderStatus ===
//                                   "SHIPPED"
//                                 ? "bg-purple-500 hover:bg-purple-500"
//                                 : order.orderStatus ===
//                                     "DELIVERED"
//                                   ? "bg-green-600 hover:bg-green-600"
//                                   : "bg-red-600 hover:bg-red-600"
//                         }
//                       >
//                         {order.orderStatus}
//                       </Badge>
//                     </TableCell>

//                     <TableCell>
//                       {new Date(
//                         order.createdAt
//                       ).toLocaleDateString()}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>
//       )}
//     </section>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Package } from "lucide-react";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface OrderUser {
  _id: string;
  name: string;
  email: string;
  image: string;
}

interface OrderAddress {
  phone: string;
  division: string;
  district: string;
  area: string;
  postalCode: string;
  address: string;
}

interface Order {
  _id: string;
  userId: string;
  sellerId: string;
  productId: string;
  productName: string;
  thumbnail: string;
  quantity: number;
  price: number;
  salePrice: number;
  totalPrice: number;
  totalSalePrice: number;
  shippingFee: number;
  address: OrderAddress;
  paymentMethod?: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  updatedAt: string;
  user: OrderUser;
  seller: OrderUser;
}

function getStatusColor(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "CONFIRMED":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "SHIPPED":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "DELIVERED":
      return "bg-green-50 text-green-700 border-green-200";
    case "CANCELLED":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

function getPaymentColor(status: string) {
  return status === "Paid"
    ? "bg-green-50 text-green-700 border-green-200"
    : "bg-red-50 text-red-700 border-red-200";
}

export default function ManageOrdersPage() {
  const { data: session } = useSession();
  const userId = (session?.user as { id?: string })?.id;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/orders?userId=${userId}`, {
          cache: "no-store",
        });

        const result = await res.json();

        if (result.success) {
          setOrders(result.data);
        } else {
          toast.error(result.message);
        }
      } catch {
        toast.error("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading orders...</p>
      </div>
    );
  }

  return (
    <section className="mx-auto w-full max-w-[1400px] px-3 py-6 sm:px-4 sm:py-8">
      {/* Page header */}
      <div className="mb-5 sm:mb-6">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Manage Orders
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Monitor all orders with detailed product, customer, seller, and payment information.
        </p>
      </div>

      {orders.length === 0 ? (
        <Card className="border shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16">
            <Package className="mb-4 h-12 w-12 text-muted-foreground sm:h-14 sm:w-14" />
            <h2 className="text-base font-semibold sm:text-lg">No Orders Found</h2>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              Orders will appear here once customers start purchasing.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border shadow-sm">
          <CardContent className="p-0">
            {/*
              This wrapper strictly contains all horizontal scrolling.
              No sticky columns => no overflow escaping the card.
            */}
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="w-[56px]">Img</TableHead>
                    <TableHead className="min-w-[120px]">Order ID</TableHead>
                    <TableHead className="min-w-[200px]">Product</TableHead>
                    <TableHead className="min-w-[200px]">Customer</TableHead>
                    <TableHead className="min-w-[200px]">Seller</TableHead>
                    <TableHead className="min-w-[70px] text-right">Qty</TableHead>
                    <TableHead className="min-w-[120px] text-right">
                      Unit Price
                    </TableHead>
                    <TableHead className="min-w-[120px] text-right">
                      Sale Total
                    </TableHead>
                    <TableHead className="min-w-[120px] text-right">
                      Grand Total
                    </TableHead>
                    <TableHead className="min-w-[90px] text-right">
                      Shipping
                    </TableHead>
                    <TableHead className="min-w-[120px]">Payment</TableHead>
                    <TableHead className="min-w-[110px]">Pay Status</TableHead>
                    <TableHead className="min-w-[120px]">Order Status</TableHead>
                    <TableHead className="min-w-[160px]">Created</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {orders.map((order) => (
                    <TableRow
                      key={order._id}
                      className="align-middle hover:bg-muted/20"
                    >
                      {/* Thumbnail */}
                      <TableCell className="p-2">
                        <Image
                          src={order.thumbnail}
                          alt={order.productName}
                          width={48}
                          height={48}
                          className="h-11 w-11 rounded-md object-cover ring-1 ring-border"
                        />
                      </TableCell>

                      {/* Order ID */}
                      <TableCell>
                        <div className="font-mono text-[11px] tracking-tight text-muted-foreground">
                          {order._id.slice(-8)}
                        </div>
                      </TableCell>

                      {/* Product */}
                      <TableCell>
                        <div className="max-w-[220px] truncate text-sm font-medium sm:max-w-none">
                          {order.productName}
                        </div>
                      </TableCell>

                      {/* Customer */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Image
                            src={order.user.image}
                            alt={order.user.name}
                            width={32}
                            height={32}
                            className="h-8 w-8 rounded-full object-cover ring-1 ring-border"
                          />
                          <div className="min-w-0">
                            <div className="truncate text-sm font-medium">
                              {order.user.name}
                            </div>
                            <div className="truncate text-[11px] text-muted-foreground">
                              {order.user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Seller */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Image
                            src={order.seller.image}
                            alt={order.seller.name}
                            width={32}
                            height={32}
                            className="h-8 w-8 rounded-full object-cover ring-1 ring-border"
                          />
                          <div className="min-w-0">
                            <div className="truncate text-sm font-medium">
                              {order.seller.name}
                            </div>
                            <div className="truncate text-[11px] text-muted-foreground">
                              {order.seller.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Quantity */}
                      <TableCell className="text-right">
                        <span className="text-sm font-medium">{order.quantity}</span>
                      </TableCell>

                      {/* Unit Price */}
                      <TableCell className="text-right">
                        <div className="text-[11px] text-muted-foreground">
                          ৳{order.price}
                        </div>
                        <div className="text-sm font-medium">
                          ৳{order.salePrice}
                        </div>
                      </TableCell>

                      {/* Sale Total */}
                      <TableCell className="text-right">
                        <div className="text-[11px] text-muted-foreground">
                          ৳{order.totalPrice}
                        </div>
                        <div className="text-sm font-semibold">
                          ৳{order.totalSalePrice}
                        </div>
                      </TableCell>

                      {/* Grand Total (with shipping) */}
                      <TableCell className="text-right">
                        <div className="text-sm font-semibold">
                          ৳{order.totalSalePrice + order.shippingFee}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          + ৳{order.shippingFee} ship
                        </div>
                      </TableCell>

                      {/* Shipping */}
                      <TableCell className="text-right">
                        <span className="text-sm text-muted-foreground">
                          ৳{order.shippingFee}
                        </span>
                      </TableCell>

                      {/* Payment Method */}
                      <TableCell>
                        {order.paymentMethod ? (
                          <Badge
                            variant="secondary"
                            className="text-[11px] font-medium"
                          >
                            {order.paymentMethod}
                          </Badge>
                        ) : (
                          <span className="text-[11px] text-muted-foreground">
                            —
                          </span>
                        )}
                      </TableCell>

                      {/* Payment Status */}
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${getPaymentColor(
                            order.paymentStatus
                          )} border text-[11px] font-medium`}
                        >
                          {order.paymentStatus}
                        </Badge>
                      </TableCell>

                      {/* Order Status */}
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${getStatusColor(
                            order.orderStatus
                          )} border text-[11px] font-medium`}
                        >
                          {order.orderStatus}
                        </Badge>
                      </TableCell>

                      {/* Created At */}
                      <TableCell className="whitespace-nowrap text-[11px] text-muted-foreground">
                        {new Date(order.createdAt).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
}