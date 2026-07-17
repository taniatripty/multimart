"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

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

import { useSession } from "next-auth/react";

type Category = {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  subCategories?: string[];
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
  colors: string;
  sizes: string;
  features: string;
  thumbnail: string;
  thumbnailFile: File | null;

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
  thumbnailFile: null,

  active: true,
};

type EditProductFormProps = {
  /** Optional: called after successful update, e.g. to redirect or refresh */
  onSuccess?: () => void;
};

export default function EditProductForm({ onSuccess }: EditProductFormProps) {
  const { id } = useParams(); // e.g. /products/[id]/edit → id = product._id
  const productId = id as string | undefined;

  const { data: session } = useSession();
  const sellerId = (session?.user as { id?: string })?.id;

  const [form, setForm] = useState<ProductFormValues>(defaultFormValues);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  // Load existing product from /api/products/:productId
  useEffect(() => {
    if (!productId) return;

    const loadProduct = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`/api/products/${productId}`);
        const product = res.data?.data ?? res.data ?? {};

        setForm({
          name: product.name ?? "",
          shortDescription: product.shortDescription ?? "",
          description: product.description ?? "",
          category: product.category ?? "",
          subcategory: product.subcategory ?? "",
          brand: product.brand ?? "",
          price: String(product.price ?? ""),
          discount: String(product.discount ?? ""),
          stock: String(product.stock ?? ""),
          colors: Array.isArray(product.colors)
            ? product.colors.join(", ")
            : product.colors ?? "",
          sizes: Array.isArray(product.sizes)
            ? product.sizes.join(", ")
            : product.sizes ?? "",
          features: Array.isArray(product.features)
            ? product.features.join(", ")
            : product.features ?? "",
          thumbnail: product.thumbnail ?? "",
          thumbnailFile: null,
          active: !!product.active,
        });

        if (product.thumbnail) {
          setImagePreview(product.thumbnail);
        }
      } catch {
        toast.error("Failed to load product.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const updateForm = <K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    if (!productId) return;
    setIsLoading(true);
    axios
      .get(`/api/products/${productId}`)
      .then((res) => {
        const product = res.data?.data ?? res.data ?? {};
        setForm({
          name: product.name ?? "",
          shortDescription: product.shortDescription ?? "",
          description: product.description ?? "",
          category: product.category ?? "",
          subcategory: product.subcategory ?? "",
          brand: product.brand ?? "",
          price: String(product.price ?? ""),
          discount: String(product.discount ?? ""),
          stock: String(product.stock ?? ""),
          colors: Array.isArray(product.colors)
            ? product.colors.join(", ")
            : product.colors ?? "",
          sizes: Array.isArray(product.sizes)
            ? product.sizes.join(", ")
            : product.sizes ?? "",
          features: Array.isArray(product.features)
            ? product.features.join(", ")
            : product.features ?? "",
          thumbnail: product.thumbnail ?? "",
          thumbnailFile: null,
          active: !!product.active,
        });
        if (product.thumbnail) {
          setImagePreview(product.thumbnail);
        } else {
          setImagePreview(null);
        }
      })
      .catch(() => {
        toast.error("Failed to reload product.");
      })
      .finally(() => setIsLoading(false));
  };

  const uploadImageToCloudinary = async (file: File) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Image upload failed.");
    }

    return response.json();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      return;
    }

    setForm((prev) => ({ ...prev, thumbnailFile: file }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setForm((prev) => ({ ...prev, thumbnailFile: null }));
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productId) {
      toast.error("Product ID not found.");
      return;
    }

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
      let uploadedImageUrl = form.thumbnail;

      // Upload image only if a new file is selected
      if (form.thumbnailFile) {
        setIsUploadingImage(true);
        const result = await uploadImageToCloudinary(form.thumbnailFile);
        uploadedImageUrl = result.secure_url;
        setIsUploadingImage(false);
      }

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
        thumbnail: uploadedImageUrl || undefined,
        active: form.active,
        seller: sellerId,

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
      };

      // Update via /api/products/:productId
      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT", // or "PATCH" depending on your API
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to update product");
      }

      toast.success("Product updated successfully!");
      onSuccess?.();
    } catch (error: unknown) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "Failed to update product.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!productId) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Product</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">
            Product ID not found in URL.
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Product</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading product...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Product</CardTitle>
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

          {/* Thumbnail Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Product Thumbnail</label>
            <div className="flex items-start gap-4">
              <div className="relative">
                <label
                  htmlFor="thumbnail-upload"
                  className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 transition-colors hover:border-amber-400 hover:bg-amber-50"
                >
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Thumbnail preview"
                        className="h-full w-full rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-colors hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-500">
                      <ImagePlus className="h-8 w-8" />
                      <span className="text-xs text-center">Upload Image</span>
                    </div>
                  )}
                  <input
                    id="thumbnail-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                    disabled={isUploadingImage}
                  />
                </label>

                {isUploadingImage && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/80">
                    <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2 pt-2">
                <p className="text-xs text-slate-500">
                  Upload a new thumbnail to replace the existing one. Leave
                  unchanged if you don’t want to update the image.
                </p>
                <ul className="text-xs text-slate-500 list-disc list-inside space-y-1">
                  <li>Accepted formats: JPG, PNG, WebP</li>
                  <li>Maximum file size: 5MB</li>
                  <li>Square images work best</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Active */}
          <div className="">
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
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              disabled={isSubmitting || isUploadingImage || isLoading}
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isUploadingImage || isLoading}
            >
              {(isSubmitting || isUploadingImage) ? "Updating..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}