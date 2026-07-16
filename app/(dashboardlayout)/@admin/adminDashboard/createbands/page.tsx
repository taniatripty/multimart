
"use client";

import { FormEvent, useState, ChangeEvent } from "react";
import { BadgeCheck, FileText, Globe, Tag } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export default function CreateBrandPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [logo, setLogo] = useState("");
  const [uploading, setUploading] = useState(false);
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleNameChange = (value: string) => {
    setName(value);

    setSlug(
      value
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
    );
  };

  const handleLogoUpload = async (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setUploading(true);

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

      if (!res.ok) {
        throw new Error(data.error?.message || "Upload failed");
      }

      setLogo(data.secure_url);
      toast.success("Logo uploaded successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload logo.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!logo) {
      toast.error("Please upload a brand logo.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name,
        slug,
        logo,
        website,
        description,
        isActive,
      };

      const response = await fetch("/api/brands/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      // Reset form
      setName("");
      setSlug("");
      setLogo("");
      setWebsite("");
      setDescription("");
      setIsActive(true);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create brand.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-6">
      <Card className="mx-auto max-w-3xl shadow-lg">
        <CardContent className="space-y-6 p-8">
          <div>
            <h1 className="text-3xl font-bold">Create Brand</h1>

            <p className="mt-2 text-muted-foreground">
              Add a new brand to your marketplace.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Brand Name */}
            <div>
              <Label>Brand Name</Label>

              <div className="relative mt-2">
                <BadgeCheck className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

                <Input
                  className="pl-10"
                  placeholder="Apple"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Slug */}
            <div>
              <Label>Slug</Label>

              <div className="relative mt-2">
                <Tag className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

                <Input
                  className="pl-10"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Logo */}
            <div>
              <Label>Brand Logo</Label>

              <div className="mt-2 space-y-3">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={uploading}
                />

                {uploading && (
                  <p className="text-sm text-muted-foreground">
                    Uploading image...
                  </p>
                )}

                {logo && (
                  <div className="space-y-2">
                    <img
                      src={logo}
                      alt="Brand Logo"
                      className="h-24 w-24 rounded-lg border object-cover"
                    />

                    <p className="break-all text-xs text-muted-foreground">
                      {logo}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Website */}
            <div>
              <Label>Website (Optional)</Label>

              <div className="relative mt-2">
                <Globe className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

                <Input
                  className="pl-10"
                  placeholder="https://apple.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label>Description</Label>

              <div className="relative mt-2">
                <FileText className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

                <Textarea
                  className="min-h-32 pl-10 pt-3"
                  placeholder="Write brand description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label>Active</Label>

                <p className="text-sm text-muted-foreground">
                  Show this brand to customers.
                </p>
              </div>

              <Switch
                checked={isActive}
                onCheckedChange={setIsActive}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || uploading}
            >
              {loading ? "Creating..." : "Create Brand"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}