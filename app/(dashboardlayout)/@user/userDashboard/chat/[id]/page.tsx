"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Send } from "lucide-react";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Seller {
  _id: string;
  name: string;
  image: string;
}

interface Order {
  _id: string;

  productName: string;
  thumbnail: string;

  seller: Seller;
}

interface Message {
  _id: string;

  senderId: string;
  receiverId: string;

  message: string;

  createdAt: string;
}

export default function UserChatPage() {
  const { id } = useParams();

  const orderId = id as string;

  const { data: session } = useSession();

  const currentUserId = (session?.user as { id?: string })?.id;

  const [order, setOrder] = useState<Order | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);

  const [message, setMessage] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!orderId) return;

    const loadChat = async () => {
      try {
        const res = await fetch(`/api/chat/${orderId}`);

        const result = await res.json();

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        setOrder(result.order);
        setMessages(result.messages);
      } catch {
        toast.error("Failed to load chat.");
      }
    };

    loadChat();
  }, [orderId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim() || !order) return;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          orderId,
          senderId: currentUserId,
          receiverId: order.seller._id,
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
    }
  };

  if (!order) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <Card className="mx-auto flex h-[85vh] w-11/12 flex-col overflow-hidden">

      {/* Header */}

      <div className="flex items-center gap-4 border-b p-4">

        <Image
          src={order.seller.image}
          alt={order.seller.name}
          width={50}
          height={50}
          className="rounded-full"
        />

        <div className="flex-1">
          <h2 className="font-semibold text-lg">
            {order.seller.name}
          </h2>

          <p className="text-sm text-muted-foreground">
            {order.productName}
          </p>
        </div>

        <Image
          src={order.thumbnail}
          alt={order.productName}
          width={60}
          height={60}
          className="rounded-lg border object-cover"
        />
      </div>

      {/* Messages */}

      <div className="flex-1 overflow-y-auto p-5 space-y-4">

        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${
              msg.senderId === currentUserId
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs rounded-xl px-4 py-3 lg:max-w-md ${
                msg.senderId === currentUserId
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <p>{msg.message}</p>

              <p className="mt-1 text-right text-[10px] opacity-70">
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Input */}

      <div className="flex gap-3 border-t p-4">

        <Input
          value={message}
          placeholder="Type a message..."
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />

        <Button onClick={sendMessage}>
          <Send className="h-4 w-4" />
        </Button>

      </div>

    </Card>
  );
}