

"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

// Adjust this import based on your auth setup
import { useSession } from "next-auth/react";
// or for custom auth: import { useSession } from "@/hooks/useSession";

type Category = {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  subCategories?: string[]; // ["phone", "laptop"]
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type Brand = {
  _id: string;
  name: string;
  slug: string;
};

type ProductFormValues = {
  name: string;
  shortDescription: string;
  description: string;
  category: string;
  subcategory: string;
  brand: string;
  price: string;
  discount: string;
  stock: string;
  colors: string; // comma-separated
  sizes: string; // comma-separated
  features: string; // comma-separated
  thumbnail: string;
  featured: boolean;
  active: boolean;
};

const defaultFormValues: ProductFormValues = {
  name: "",
  shortDescription: "",
  description: "",
  category: "",
  subcategory: "",
  brand: "",
  price: "",
  discount: "",
  stock: "",
  colors: "",
  sizes: "",
  features: "",
  thumbnail: "",
  featured: false,
  active: true,
};

export default function CreateProductForm() {
  const { data: session } = useSession(); // adjust if your hook is different
  const sellerId = (session?.user as { id?: string })?.id;

  const [form, setForm] = useState<ProductFormValues>(defaultFormValues);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedCategory = useMemo(
    () => categories.find((c) => c._id === form.category),
    [categories, form.category]
  );

  const numericPrice = Number(form.price) || 0;
  const numericDiscount = Number(form.discount) || 0;
  const salePrice =
    numericPrice > 0 && numericDiscount > 0
      ? (numericPrice * (1 - numericDiscount / 100)).toFixed(2)
      : "";

  // Load categories and brands
  useEffect(() => {
    const loadData = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          axios.get("/api/categories/create"),
          axios.get("/api/brands/create"),
        ]);

        const catData = catRes.data?.data ?? catRes.data ?? [];
        const brandData = brandRes.data?.data ?? brandRes.data ?? [];

        setCategories(catData);
        setBrands(brandData);
      } catch {
        toast.error("Failed to load categories or brands.");
      }
    };
    loadData();
  }, []);

  const updateForm = <K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setForm(defaultFormValues);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!form.name.trim()) {
      toast.error("Product name is required.");
      return;
    }
    if (!form.category) {
      toast.error("Category is required.");
      return;
    }
    if (!form.brand) {
      toast.error("Brand is required.");
      return;
    }
    if (!form.price || numericPrice <= 0) {
      toast.error("Price must be greater than 0.");
      return;
    }
    if (!form.stock || Number(form.stock) < 0) {
      toast.error("Stock cannot be negative.");
      return;
    }
    if (form.discount && (numericDiscount < 0 || numericDiscount > 100)) {
      toast.error("Discount must be between 0 and 100.");
      return;
    }
    if (!sellerId) {
      toast.error("Seller not found. Please log in again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: form.name,
        shortDescription: form.shortDescription,
        description: form.description,
        category: form.category,
        subcategory: form.subcategory || undefined,
        brand: form.brand,
        price: numericPrice,
        discount: numericDiscount || 0,
        salePrice: salePrice ? Number(salePrice) : undefined,
        stock: Number(form.stock),
        thumbnail: form.thumbnail || undefined,
        featured: form.featured,
        active: form.active,
        seller: sellerId, // or sellerId: sellerId, depending on your schema

        // Arrays of strings
        colors: form.colors
          ? form.colors
              .split(",")
              .map((c) => c.trim())
              .filter(Boolean)
          : undefined,
        sizes: form.sizes
          ? form.sizes
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : undefined,
        features: form.features
          ? form.features
              .split(",")
              .map((f) => f.trim())
              .filter(Boolean)
          : undefined,

        // Server should set defaults for:
        // status: "pending"
        // rating: 0
        // reviews: [] or 0
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to create product");
      }

      toast.success("Product created successfully!");
      resetForm();
    } catch (error: unknown) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "Failed to create product.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="name">
              Product Name
            </label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => updateForm("name", e.target.value)}
              placeholder="e.g. Classic White T-Shirt"
            />
          </div>

          {/* Short Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="shortDescription">
              Short Description
            </label>
            <Textarea
              id="shortDescription"
              value={form.shortDescription}
              onChange={(e) => updateForm("shortDescription", e.target.value)}
              placeholder="One-line summary for listings"
              className="resize-none"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="description">
              Description
            </label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => updateForm("description", e.target.value)}
              placeholder="Full product description"
              className="min-h-[120px] resize-none"
            />
          </div>

          {/* Category / Subcategory / Brand */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={form.category}
                onValueChange={(value) => updateForm("category", value ?? "")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c._id} value={c._id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Subcategory</label>
              <Select
                value={form.subcategory}
                onValueChange={(value) => updateForm("subcategory", value ?? "")}
                disabled={!selectedCategory?.subCategories?.length}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {(selectedCategory?.subCategories ?? []).map((sub) => (
                    <SelectItem key={sub} value={sub}>
                      {sub}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Brand</label>
              <Select
                value={form.brand}
                onValueChange={(value) => updateForm("brand", value ?? "")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((b) => (
                    <SelectItem key={b._id} value={b._id}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Price, Discount, Stock */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="price">
                Price
              </label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => updateForm("price", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="discount">
                Discount (%)
              </label>
              <Input
                id="discount"
                type="number"
                min="0"
                max="100"
                value={form.discount}
                onChange={(e) => updateForm("discount", e.target.value)}
                placeholder="e.g. 10"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="stock">
                Stock
              </label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => updateForm("stock", e.target.value)}
              />
            </div>
          </div>

          {/* Sale Price (calculated) */}
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="salePrice">
              Sale Price (calculated)
            </label>
            <Input
              id="salePrice"
              type="text"
              value={salePrice}
              disabled
              placeholder="Auto-calculated from price and discount"
            />
          </div>

          {/* Colors, Sizes, Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="colors">
                Colors (comma-separated)
              </label>
              <Input
                id="colors"
                value={form.colors}
                onChange={(e) => updateForm("colors", e.target.value)}
                placeholder="e.g. red, blue, black"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="sizes">
                Sizes (comma-separated)
              </label>
              <Input
                id="sizes"
                value={form.sizes}
                onChange={(e) => updateForm("sizes", e.target.value)}
                placeholder="e.g. S, M, L, XL"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="features">
                Features (comma-separated)
              </label>
              <Input
                id="features"
                value={form.features}
                onChange={(e) => updateForm("features", e.target.value)}
                placeholder="e.g. Fast charging, Water resistant, 5G"
              />
            </div>
          </div>

          {/* Thumbnail URL */}
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="thumbnail">
              Thumbnail URL
            </label>
            <Input
              id="thumbnail"
              type="url"
              value={form.thumbnail}
              onChange={(e) => updateForm("thumbnail", e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Featured / Active */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Featured</div>
                <div className="text-xs text-muted-foreground">
                  Show on featured section
                </div>
              </div>
              <Switch
                checked={form.featured}
                onCheckedChange={(checked) => updateForm("featured", checked)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Active</div>
                <div className="text-xs text-muted-foreground">
                  Visible in storefront
                </div>
              </div>
              <Switch
                checked={form.active}
                onCheckedChange={(checked) => updateForm("active", checked)}
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={resetForm}>
              Reset
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Product"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}