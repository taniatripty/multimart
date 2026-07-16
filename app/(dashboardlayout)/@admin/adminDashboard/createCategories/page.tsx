"use client";

import { FormEvent, useState } from "react";
import {
  FileText,
  FolderPlus,
  ImageIcon,
  Tag,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

// This matches your server's CreateCategoryPayload
interface CreateCategoryPayload {
  name: string;
  slug: string;
  image: string;
  description: string;
  subCategories: string[];
  isActive: boolean;
}

export default function CreateCategoryPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState("");
const [imageFile, setImageFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [subCategoriesInput, setSubCategoriesInput] = useState("");
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Category name is required.");
      return;
    }

    setLoading(true);

    let imageUrl = "";

if (imageFile) {
  const formData = new FormData();

  formData.append("file", imageFile);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
  );

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const uploadResult = await uploadRes.json();

  if (!uploadResult.secure_url) {
    throw new Error("Image upload failed.");
  }

  imageUrl = uploadResult.secure_url;

  setImage(imageUrl);
}

    try {
      // Convert comma-separated input to string[]
      const subCategories = subCategoriesInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload: CreateCategoryPayload = {
        name,
        slug,
        image: imageUrl,
        description,
        subCategories, // string[]
        isActive,
      };

      console.log("Creating category with payload:", payload);

      const res = await fetch("/api/categories/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to create category");
      }

      toast.success(result.message || "Category created successfully.");

      // Reset form
      setName("");
      setSlug("");
      setImage("");
      setDescription("");
      setSubCategoriesInput("");
      setIsActive(true);
    } catch (error: unknown) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "Failed to create category.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-6">
      <Card className="mx-auto max-w-3xl">
        <CardContent className="space-y-6 p-8">
          <div>
            <h1 className="text-3xl font-bold">Create Category</h1>

            <p className="mt-2 text-muted-foreground">
              Add a new top-level category. Subcategories can be added as a comma-separated list.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Name */}
            <div>
              <Label>Category Name</Label>

              <div className="relative mt-2">
                <FolderPlus className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

                <Input
                  className="pl-10"
                  placeholder="Electronics"
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

            {/* Image URL */}
           <div>
  <Label>Category Image</Label>

  <div className="relative mt-2">
    <ImageIcon className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

    <Input
      className="pl-10"
      type="file"
      accept="image/*"
      onChange={(e) =>
        setImageFile(e.target.files?.[0] ?? null)
      }
    />
  </div>

  {image && (
    <img
      src={image}
      alt="Preview"
      className="mt-4 h-28 w-28 rounded-lg border object-cover"
    />
  )}
</div>

            {/* Description */}
            <div>
              <Label>Description</Label>

              <div className="relative mt-2">
                <FileText className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

                <Textarea
                  className="min-h-32 pl-10 pt-3"
                  placeholder="Category description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            {/* Subcategories */}
            <div>
              <Label>Subcategories (comma-separated)</Label>

              <div className="relative mt-2">
                <Input
                  className="pl-3"
                  placeholder="Mobile Phones, Laptops, Tablets"
                  value={subCategoriesInput}
                  onChange={(e) => setSubCategoriesInput(e.target.value)}
                />
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                Enter subcategory names or IDs separated by commas.
              </p>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label>Active</Label>

                <p className="text-sm text-muted-foreground">
                  Enable this category.
                </p>
              </div>

              <Switch
                checked={isActive}
                onCheckedChange={setIsActive}
              />
            </div>

            <Button
              className="w-full"
              disabled={loading || !name.trim()}
            >
              {loading ? "Creating..." : "Create Category"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}