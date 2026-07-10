
"use client";

import emailjs from "@emailjs/browser";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const form = useRef<HTMLFormElement>(null);

  const [loading, setLoading] = useState(false);

  const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
  const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
  const REPLY_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_REPLY_TEMPLATE_ID!;
  const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.current) return;

    setLoading(true);

    try {
      // Send contact email to admin
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, {
        publicKey: PUBLIC_KEY,
      });

      const formData = new FormData(form.current);

      // Send auto reply to user
      await emailjs.send(
        SERVICE_ID,
        REPLY_TEMPLATE_ID,
        {
          user_name: formData.get("user_name"),
          reply_to: formData.get("reply_to"),
          subject: formData.get("subject"),
          message: formData.get("message"),
        },
        {
          publicKey: PUBLIC_KEY,
        },
      );
      

      toast.success("Message sent successfully!");

      form.current.reset();
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast.error("Failed to send message.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="bg-slate-50">
      {/* Hero */}
      <section className="bg-slate-900 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold">Contact Us</h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">
            Have questions, feedback, or need assistance? We would love to hear
            from you.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card>
              <CardContent className="flex items-start gap-4 p-6">
                <div className="rounded-full bg-amber-100 p-3">
                  <MapPin className="h-6 w-6 text-amber-500" />
                </div>

                <div>
                  <h3 className="font-semibold">Office Address</h3>

                  <p className="mt-2 text-sm text-slate-600">
                    House #25, Road #10
                    <br />
                    Dhanmondi, Dhaka
                    <br />
                    Bangladesh
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-start gap-4 p-6">
                <div className="rounded-full bg-blue-100 p-3">
                  <Phone className="h-6 w-6 text-blue-600" />
                </div>

                <div>
                  <h3 className="font-semibold">Phone</h3>

                  <p className="mt-2 text-sm text-slate-600">
                    +880 1700-123456
                  </p>

                  <p className="text-sm text-slate-600">+880 1800-654321</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-start gap-4 p-6">
                <div className="rounded-full bg-green-100 p-3">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>

                <div>
                  <h3 className="font-semibold">Email</h3>

                  <p className="mt-2 text-sm text-slate-600">
                    support@multimart.com
                  </p>

                  <p className="text-sm text-slate-600">
                    contact@multimart.com
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-start gap-4 p-6">
                <div className="rounded-full bg-purple-100 p-3">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>

                <div>
                  <h3 className="font-semibold">Business Hours</h3>

                  <p className="mt-2 text-sm text-slate-600">Monday - Friday</p>

                  <p className="text-sm text-slate-600">9:00 AM - 8:00 PM</p>

                  <p className="mt-3 text-sm text-slate-600">
                    Saturday - Sunday
                  </p>

                  <p className="text-sm text-slate-600">10:00 AM - 6:00 PM</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold">Send us a Message</h2>

                <p className="mt-2 text-slate-500">
                  We usually reply within 24 hours.
                </p>

                <form
                  ref={form}
                  onSubmit={sendEmail}
                  className="mt-8 space-y-6"
                >
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Full Name
                      </label>

                      <Input name="user_name" placeholder="John Doe" required />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Email
                      </label>

                      <Input
                        type="email"
                        name="reply_to"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      subject
                    </label>

                    <Input name="subject" placeholder="Subject" required />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Message
                    </label>

                    <Textarea
                      name="message"
                      rows={7}
                      placeholder="Write your message..."
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-11 bg-slate-900 hover:bg-slate-800"
                  >
                    <Send className="mr-2 h-4 w-4" />

                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
