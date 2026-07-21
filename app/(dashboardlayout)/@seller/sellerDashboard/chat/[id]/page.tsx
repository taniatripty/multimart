// "use client";

// import { useEffect, useRef, useState } from "react";
// import { useParams } from "next/navigation";
// import { useSession } from "next-auth/react";
// import Image from "next/image";
// import { Send } from "lucide-react";
// import { toast } from "sonner";

// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

// interface User {
//   _id: string;
//   name: string;
//   image: string;
// }

// interface Order {
//   _id: string;

//   productName: string;
//   thumbnail: string;

//   user: User;
//   seller: User;
// }

// interface Message {
//   _id: string;

//   senderId: string;
//   receiverId: string;

//   message: string;

//   createdAt: string;
// }

// export default function ChatPage() {
//   const { id } = useParams();

//   const orderId = id as string;

//   const { data: session } = useSession();

//   const currentUserId = (session?.user as { id?: string })?.id;

//   const [order, setOrder] = useState<Order | null>(null);

//   const [messages, setMessages] = useState<Message[]>([]);

//   const [receiver, setReceiver] = useState<User | null>(null);

//   const [message, setMessage] = useState("");

//   const bottomRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (!orderId || !currentUserId) return;

//     const fetchChat = async () => {
//       try {
//         const res = await fetch(`/api/chat/${orderId}`);

//         const result = await res.json();

//         if (!result.success) {
//           toast.error(result.message);
//           return;
//         }

//         setOrder(result.order);

//         setMessages(result.messages);

//         if (currentUserId === result.order.seller._id) {
//           setReceiver(result.order.user);
//         } else {
//           setReceiver(result.order.seller);
//         }
//       } catch {
//         toast.error("Failed to load chat.");
//       }
//     };

//     fetchChat();
//   }, [orderId, currentUserId]);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({
//       behavior: "smooth",
//     });
//   }, [messages]);

//   const sendMessage = async () => {
//     if (!message.trim() || !receiver) return;

//     try {
//       const res = await fetch("/api/chat", {
//         method: "POST",

//         headers: {
//           "Content-Type": "application/json",
//         },

//         body: JSON.stringify({
//           orderId,

//           senderId: currentUserId,

//           receiverId: receiver._id,

//           message,
//         }),
//       });

//       const result = await res.json();

//       if (!result.success) {
//         toast.error(result.message);
//         return;
//       }

//       setMessages((prev) => [...prev, result.data]);

//       setMessage("");
//     } catch {
//       toast.error("Failed to send message.");
//     }
//   };

//   if (!order || !receiver) {
//     return (
//       <div className="flex h-[80vh] items-center justify-center">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <Card className="mx-auto flex h-[85vh] w-11/12 flex-col overflow-hidden">

//       {/* Header */}

//       <div className="flex items-center gap-4 border-b p-4">

//         <Image
//           src={receiver.image}
//           alt={receiver.name}
//           width={50}
//           height={50}
//           className="rounded-full"
//         />

//         <div className="flex-1">
//           <h2 className="font-semibold text-lg">
//             {receiver.name}
//           </h2>

//           <p className="text-sm text-muted-foreground">
//             {order.productName}
//           </p>
//         </div>

//         <Image
//           src={order.thumbnail}
//           alt={order.productName}
//           width={60}
//           height={60}
//           className="rounded-lg border object-cover"
//         />
//       </div>

//       {/* Messages */}

//       <div className="flex-1 space-y-4 overflow-y-auto p-5">

//         {messages.map((msg) => (
//           <div
//             key={msg._id}
//             className={`flex ${
//               msg.senderId === currentUserId
//                 ? "justify-end"
//                 : "justify-start"
//             }`}
//           >
//             <div
//               className={`max-w-xs rounded-xl px-4 py-3 lg:max-w-md ${
//                 msg.senderId === currentUserId
//                   ? "bg-primary text-primary-foreground"
//                   : "bg-muted"
//               }`}
//             >
//               <p>{msg.message}</p>

//               <p className="mt-1 text-right text-[10px] opacity-70">
//                 {new Date(msg.createdAt).toLocaleTimeString([], {
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 })}
//               </p>
//             </div>
//           </div>
//         ))}

//         <div ref={bottomRef} />

//       </div>

//       {/* Input */}

//       <div className="flex gap-3 border-t p-4">

//         <Input
//           placeholder="Type a message..."
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           onKeyDown={(e) => {
//             if (e.key === "Enter") {
//               sendMessage();
//             }
//           }}
//         />

//         <Button onClick={sendMessage}>
//           <Send className="h-4 w-4" />
//         </Button>

//       </div>
//     </Card>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Send, ArrowLeft, Package } from "lucide-react";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface User {
  _id: string;
  name: string;
  image: string;
}

interface Order {
  _id: string;
  productName: string;
  thumbnail: string;
  user: User;
  seller: User;
}

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: string;
}

export default function ChatPage() {
  const { id } = useParams();
  const orderId = id as string;

  const { data: session } = useSession();
  const currentUserId = (session?.user as { id?: string })?.id;

  const [order, setOrder] = useState<Order | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [receiver, setReceiver] = useState<User | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!orderId || !currentUserId) return;

    const fetchChat = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/chat/${orderId}`);
        const result = await res.json();

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        setOrder(result.order);
        setMessages(result.messages);

        if (currentUserId === result.order.seller._id) {
          setReceiver(result.order.user);
        } else {
          setReceiver(result.order.seller);
        }
      } catch {
        toast.error("Failed to load chat.");
      } finally {
        setLoading(false);
      }
    };

    fetchChat();
  }, [orderId, currentUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim() || !receiver || sending) return;

    try {
      setSending(true);
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          senderId: currentUserId,
          receiverId: receiver._id,
          message,
        }),
      });

      const result = await res.json();

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      setMessages((prev) => [...prev, result.data]);
      setMessage("");
    } catch {
      toast.error("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  if (loading || !order || !receiver) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-gradient-to-br from-muted/30 via-background to-muted/20 px-4">
        <div className="rounded-2xl border bg-card/80 px-6 py-5 shadow-sm backdrop-blur">
          Loading conversation...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-2rem)] bg-gradient-to-br from-muted/30 via-background to-muted/20 p-4 md:p-6">
      <Card className="mx-auto flex h-[85vh] max-w-5xl flex-col overflow-hidden border shadow-lg">
        <div className="sticky top-0 z-10 border-b bg-card/95 px-4 py-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="shrink-0 rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <Image
              src={receiver.image}
              alt={receiver.name}
              width={48}
              height={48}
              className="h-12 w-12 rounded-full border object-cover"
            />

            <div className="min-w-0 flex-1">
              <h2 className="truncate font-semibold text-base md:text-lg">
                {receiver.name}
              </h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="h-4 w-4" />
                <span className="truncate">{order.productName}</span>
              </div>
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              <div className="text-right">
                <p className="text-sm font-medium">Order chat</p>
                <p className="text-xs text-muted-foreground">Secure conversation</p>
              </div>

              <Image
                src={order.thumbnail}
                alt={order.productName}
                width={56}
                height={56}
                className="h-14 w-14 rounded-xl border object-cover"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 md:px-6">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="max-w-sm rounded-2xl border bg-muted/30 px-5 py-4 text-center text-sm text-muted-foreground">
                No messages yet. Start the conversation about this order.
              </div>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId === currentUserId;

              return (
                <div
                  key={msg._id}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm md:max-w-[70%] ${
                      isMe
                        ? "rounded-br-md bg-primary text-primary-foreground"
                        : "rounded-bl-md border bg-muted"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                      {msg.message}
                    </p>
                    <p
                      className={`mt-2 text-[10px] ${
                        isMe
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      }`}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t bg-card p-4">
          <div className="flex items-end gap-3 rounded-2xl border bg-background p-2 shadow-sm">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              className="border-0 bg-transparent shadow-none focus-visible:ring-0"
            />
            <Button
              onClick={sendMessage}
              disabled={!message.trim() || sending}
              className="rounded-xl px-4"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}