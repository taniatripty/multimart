"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface User {
  _id: string;
  name: string;
  email: string;
  image: string;
  phone?: string;
  bio?: string;
  role: string;
}

export default function ManageProfilePage() {
  const { data: session } = useSession();

  const userId = (session?.user as { id?: string })?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [user, setUser] = useState<User>({
    _id: "",
    name: "",
    email: "",
    image: "",
    phone: "",
    bio: "",
    role: "",
  });

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user/${userId}`);

        const result = await res.json();

        if (result.success) {
          setUser(result.data);
        } else {
          toast.error(result.message);
        }
      } catch {
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
      );

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!data.secure_url) {
        toast.error("Image upload failed.");
        return;
      }

      setUser((prev) => ({
        ...prev,
        image: data.secure_url,
      }));

      toast.success("Image uploaded.");
    } catch {
      toast.error("Failed to upload image.");
    }
  };

  const handleUpdate = async () => {
    try {
      setSaving(true);

      const res = await fetch(`/api/user/profile/${user._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.name,
          phone: user.phone,
          image: user.image,
          bio: user.bio,
        }),
      });

      const result = await res.json();

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success("Profile updated successfully.");
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        Loading profile...
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-5xl p-6">
      <Card>
        <CardContent className="space-y-8 p-8">
          <h1 className="text-3xl font-bold">
            Manage Profile
          </h1>

          <div className="flex flex-col items-center gap-6 md:flex-row">
            <div className="relative">
              <Image
                src={user.image || ""} 
                alt={user.name}
                width={150}
                height={150}
                className="rounded-full border object-cover"
              />

              <label className="absolute bottom-2 right-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-lg">
                <Camera className="h-5 w-5" />

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold">
                {user.name}
              </h2>

              <p className="text-muted-foreground">
                {user.email}
              </p>

              <span className="inline-flex rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
                {user.role}
              </span>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Name</Label>

              <Input
                value={user.name}
                onChange={(e) =>
                  setUser({
                    ...user,
                    name: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Phone</Label>

              <Input
                value={user.phone ?? ""}
                onChange={(e) =>
                  setUser({
                    ...user,
                    phone: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>

              <Input
                value={user.email}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label>Role</Label>

              <Input
                value={user.role}
                disabled
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Bio</Label>

              <Textarea
                rows={5}
                maxLength={500}
                placeholder="Write something about yourself..."
                value={user.bio ?? ""}
                onChange={(e) =>
                  setUser({
                    ...user,
                    bio: e.target.value,
                  })
                }
              />

              <p className="text-right text-xs text-muted-foreground">
                {(user.bio ?? "").length}/500
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleUpdate}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Profile"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}