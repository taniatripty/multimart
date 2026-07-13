// "use client";

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Switch } from "@/components/ui/switch";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// type Category = {
//   _id: string;
//   name: string;
//   slug: string;
//   subcategories?: { _id: string; name: string; slug: string }[];
// };

// type Brand = {
//   _id: string;
//   name: string;
//   slug: string;
// };

// export default function CreateProductForm() {
//   const [name, setName] = useState("");
//   const [slug, setSlug] = useState("");
//   const [shortDescription, setShortDescription] = useState("");
//   const [description, setDescription] = useState("");
//   const [category, setCategory] = useState("");
//   const [subcategory, setSubcategory] = useState("");
//   const [brand, setBrand] = useState("");
//   const [price, setPrice] = useState<string>("");
//   const [salePrice, setSalePrice] = useState<string>("");
//   const [stock, setStock] = useState<string>("");
//   const [sku, setSku] = useState("");
//   const [thumbnailUrl, setThumbnailUrl] = useState("");
//   const [featured, setFeatured] = useState(false);
//   const [active, setActive] = useState(true);

//   const [categories, setCategories] = useState<Category[]>([]);
//   const [brands, setBrands] = useState<Brand[]>([]);
//   const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
//   const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);

//   // Auto-generate slug from name if slug is empty
//   useEffect(() => {
//     if (!slug && name) {
//       const generated = name
//         .toLowerCase()
//         .trim()
//         .replace(/[^\w\s-]/g, "")
//         .replace(/\s+/g, "-")
//         .replace(/-+/g, "-");
//       setSlug(generated);
//     }
//   }, [name, slug]);

//   // Load categories and brands
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const [catRes, brandRes] = await Promise.all([
//           axios.get("/api/categories/create"), // adjust if your route is different
//           axios.get("/api/brands/create"),
//         ]);

//         // Adjust based on your actual response structure
//         const catData = catRes.data?.data ?? catRes.data ?? [];
//         const brandData = brandRes.data?.data ?? brandRes.data ?? [];

//         setCategories(catData);
//         setBrands(brandData);
//       } catch (err) {
//         setError("Failed to load categories or brands.");
//       }
//     };
//     loadData();
//   }, []);

//   const selectedCategory = categories.find((c) => c._id === category);

//   const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     if (!file.type.startsWith("image/")) {
//       setError("Please select a valid image file.");
//       return;
//     }
//     setThumbnailFile(file);
//     setError(null);

//     const reader = new FileReader();
//     reader.onload = () => {
//       setThumbnailPreview(reader.result as string);
//     };
//     reader.readAsDataURL(file);
//   };

//   const uploadThumbnail = async (): Promise<string> => {
//     if (!thumbnailFile) {
//       return thumbnailUrl;
//     }

//     const formData = new FormData();
//     formData.append("file", thumbnailFile);

//     const res = await axios.post("/api/upload", formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });

//     // Adjust according to your upload response
//     return res.data?.data?.url ?? res.data?.url;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setSuccess(null);

//     // Basic validation
//     if (!name.trim()) {
//       setError("Product name is required.");
//       return;
//     }
//     if (!category) {
//       setError("Category is required.");
//       return;
//     }
//     if (!brand) {
//       setError("Brand is required.");
//       return;
//     }
//     if (!price || Number(price) <= 0) {
//       setError("Price must be greater than 0.");
//       return;
//     }
//     if (!stock || Number(stock) < 0) {
//       setError("Stock cannot be negative.");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       let finalThumbnailUrl = thumbnailUrl;

//       if (thumbnailFile) {
//         finalThumbnailUrl = await uploadThumbnail();
//       }

//       const payload = {
//         name,
//         slug,
//         shortDescription,
//         description,
//         category,
//         subcategory: subcategory || undefined,
//         brand,
//         price: Number(price),
//         salePrice: salePrice ? Number(salePrice) : undefined,
//         stock: Number(stock),
//         sku: sku || undefined,
//         thumbnail: finalThumbnailUrl || undefined,
//         featured,
//         active,
//       };

//       await axios.post("/api/products", payload);

//       setSuccess("Product created successfully!");
//       // Reset form
//       setName("");
//       setSlug("");
//       setShortDescription("");
//       setDescription("");
//       setCategory("");
//       setSubcategory("");
//       setBrand("");
//       setPrice("");
//       setSalePrice("");
//       setStock("");
//       setSku("");
//       setThumbnailUrl("");
//       setThumbnailFile(null);
//       setThumbnailPreview(null);
//       setFeatured(false);
//       setActive(true);
//     } catch (err) {
//       setError("Failed to create product. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Card className="w-full max-w-4xl mx-auto">
//       <CardHeader>
//         <CardTitle>Create Product</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {error && (
//             <div className="rounded-md bg-destructive/15 text-destructive p-3 text-sm">
//               {error}
//             </div>
//           )}
//           {success && (
//             <div className="rounded-md bg-green-100 text-green-800 p-3 text-sm">
//               {success}
//             </div>
//           )}

//           {/* Name & Slug */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <label className="text-sm font-medium" htmlFor="name">
//                 Product Name
//               </label>
//               <Input
//                 id="name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 placeholder="e.g. Classic White T-Shirt"
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-medium" htmlFor="slug">
//                 Slug
//               </label>
//               <Input
//                 id="slug"
//                 value={slug}
//                 onChange={(e) => setSlug(e.target.value)}
//                 placeholder="classic-white-t-shirt"
//               />
//             </div>
//           </div>

//           {/* Short Description */}
//           <div className="space-y-2">
//             <label className="text-sm font-medium" htmlFor="shortDescription">
//               Short Description
//             </label>
//             <Textarea
//               id="shortDescription"
//               value={shortDescription}
//               onChange={(e) => setShortDescription(e.target.value)}
//               placeholder="One-line summary for listings"
//               className="resize-none"
//             />
//           </div>

//           {/* Description */}
//           <div className="space-y-2">
//             <label className="text-sm font-medium" htmlFor="description">
//               Description
//             </label>
//             <Textarea
//               id="description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="Full product description"
//               className="min-h-[120px] resize-none"
//             />
//           </div>

//           {/* Category / Subcategory / Brand */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="space-y-2">
//               <label className="text-sm font-medium">Category</label>
//               <Select
//                 value={category}
//                 onValueChange={(value) => setCategory(value ?? "")}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select category" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {categories.map((c) => (
//                     <SelectItem key={c._id} value={c._id}>
//                       {c.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-medium">Subcategory</label>
//               <Select
//                 value={subcategory}
//                 onValueChange={(value) => setSubcategory(value ?? "")}
//                 disabled={!selectedCategory?.subcategories?.length}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select subcategory" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {categories.map((c) => (
//                     <SelectItem key={c._id} value={c._id}>
//                       {c.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-medium">Brand</label>
//               <Select
//                 value={brand}
//                 onValueChange={(value) => setBrand(value ?? "")}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select brand" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {brands.map((b) => (
//                     <SelectItem key={b._id} value={b._id}>
//                       {b.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Price, Sale Price, Stock */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="space-y-2">
//               <label className="text-sm font-medium" htmlFor="price">
//                 Price
//               </label>
//               <Input
//                 id="price"
//                 type="number"
//                 step="0.01"
//                 min="0"
//                 value={price}
//                 onChange={(e) => setPrice(e.target.value)}
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-medium" htmlFor="salePrice">
//                 Sale Price
//               </label>
//               <Input
//                 id="salePrice"
//                 type="number"
//                 step="0.01"
//                 min="0"
//                 value={salePrice}
//                 onChange={(e) => setSalePrice(e.target.value)}
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-medium" htmlFor="stock">
//                 Stock
//               </label>
//               <Input
//                 id="stock"
//                 type="number"
//                 min="0"
//                 value={stock}
//                 onChange={(e) => setStock(e.target.value)}
//               />
//             </div>
//           </div>

//           {/* SKU & Thumbnail URL */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <label className="text-sm font-medium" htmlFor="sku">
//                 SKU
//               </label>
//               <Input
//                 id="sku"
//                 value={sku}
//                 onChange={(e) => setSku(e.target.value)}
//                 placeholder="e.g. TSHIRT-WHT-M"
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-medium" htmlFor="thumbnailUrl">
//                 Thumbnail URL (optional)
//               </label>
//               <Input
//                 id="thumbnailUrl"
//                 value={thumbnailUrl}
//                 onChange={(e) => setThumbnailUrl(e.target.value)}
//                 placeholder="https://..."
//               />
//             </div>
//           </div>

//           {/* Thumbnail Upload */}
//           <div className="space-y-2">
//             <label className="text-sm font-medium">Thumbnail Image</label>
//             <div className="flex items-center gap-4">
//               <Input type="file" accept="image/*" onChange={handleThumbnailChange} />
//               {thumbnailPreview && (
//                 <img
//                   src={thumbnailPreview}
//                   alt="Thumbnail preview"
//                   className="h-20 w-20 object-cover rounded border"
//                 />
//               )}
//             </div>
//           </div>

//           {/* Featured / Active */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="flex items-center justify-between rounded-lg border p-3">
//               <div className="space-y-0.5">
//                 <div className="text-sm font-medium">Featured</div>
//                 <div className="text-xs text-muted-foreground">Show on featured section</div>
//               </div>
//               <Switch checked={featured} onCheckedChange={setFeatured} />
//             </div>

//             <div className="flex items-center justify-between rounded-lg border p-3">
//               <div className="space-y-0.5">
//                 <div className="text-sm font-medium">Active</div>
//                 <div className="text-xs text-muted-foreground">Visible in storefront</div>
//               </div>
//               <Switch checked={active} onCheckedChange={setActive} />
//             </div>
//           </div>

//           {/* Submit */}
//           <div className="flex justify-end gap-2">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => {
//                 setName("");
//                 setSlug("");
//                 setShortDescription("");
//                 setDescription("");
//                 setCategory("");
//                 setSubcategory("");
//                 setBrand("");
//                 setPrice("");
//                 setSalePrice("");
//                 setStock("");
//                 setSku("");
//                 setThumbnailUrl("");
//                 setThumbnailFile(null);
//                 setThumbnailPreview(null);
//                 setFeatured(false);
//                 setActive(true);
//                 setError(null);
//                 setSuccess(null);
//               }}
//             >
//               Reset
//             </Button>
//             <Button type="submit" disabled={isSubmitting}>
//               {isSubmitting ? "Creating..." : "Create Product"}
//             </Button>
//           </div>
//         </form>
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import React, { useEffect, useState } from "react";
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

export default function CreateProductForm() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState<string>("");
  const [salePrice, setSalePrice] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [sku, setSku] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [active, setActive] = useState(true);

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Auto-generate slug from name if slug is empty
  useEffect(() => {
    if (!slug && name) {
      const generated = name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setSlug(generated);
    }
  }, [name, slug]);

  // Load categories and brands
  useEffect(() => {
    const loadData = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          axios.get("/api/categories/create"), // adjust if your route is different
          axios.get("/api/brands/create"),
        ]);

        // Adjust based on your actual response structure
        const catData = catRes.data?.data ?? catRes.data ?? [];
        const brandData = brandRes.data?.data ?? brandRes.data ?? [];

        setCategories(catData);
        setBrands(brandData);
      } catch (err) {
        setError("Failed to load categories or brands.");
      }
    };
    loadData();
  }, []);

  const selectedCategory = categories.find((c) => c._id === category);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }
    setThumbnailFile(file);
    setError(null);

    const reader = new FileReader();
    reader.onload = () => {
      setThumbnailPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadThumbnail = async (): Promise<string> => {
    if (!thumbnailFile) {
      return thumbnailUrl;
    }

    const formData = new FormData();
    formData.append("file", thumbnailFile);

    const res = await axios.post("/api/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // Adjust according to your upload response
    return res.data?.data?.url ?? res.data?.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Basic validation
    if (!name.trim()) {
      setError("Product name is required.");
      return;
    }
    if (!category) {
      setError("Category is required.");
      return;
    }
    if (!brand) {
      setError("Brand is required.");
      return;
    }
    if (!price || Number(price) <= 0) {
      setError("Price must be greater than 0.");
      return;
    }
    if (!stock || Number(stock) < 0) {
      setError("Stock cannot be negative.");
      return;
    }

    setIsSubmitting(true);

    try {
      let finalThumbnailUrl = thumbnailUrl;

      if (thumbnailFile) {
        finalThumbnailUrl = await uploadThumbnail();
      }

      const payload = {
        name,
        slug,
        shortDescription,
        description,
        category,
        subcategory: subcategory || undefined, // e.g. "phone" or "laptop"
        brand,
        price: Number(price),
        salePrice: salePrice ? Number(salePrice) : undefined,
        stock: Number(stock),
        sku: sku || undefined,
        thumbnail: finalThumbnailUrl || undefined,
        featured,
        active,
      };

      await axios.post("/api/products", payload);

      setSuccess("Product created successfully!");
      // Reset form
      setName("");
      setSlug("");
      setShortDescription("");
      setDescription("");
      setCategory("");
      setSubcategory("");
      setBrand("");
      setPrice("");
      setSalePrice("");
      setStock("");
      setSku("");
      setThumbnailUrl("");
      setThumbnailFile(null);
      setThumbnailPreview(null);
      setFeatured(false);
      setActive(true);
    } catch (err) {
      setError("Failed to create product. Please try again.");
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
          {error && (
            <div className="rounded-md bg-destructive/15 text-destructive p-3 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-md bg-green-100 text-green-800 p-3 text-sm">
              {success}
            </div>
          )}

          {/* Name & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="name">
                Product Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Classic White T-Shirt"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="slug">
                Slug
              </label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="classic-white-t-shirt"
              />
            </div>
          </div>

          {/* Short Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="shortDescription">
              Short Description
            </label>
            <Textarea
              id="shortDescription"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Full product description"
              className="min-h-[120px] resize-none"
            />
          </div>

          {/* Category / Subcategory / Brand */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value ?? "")}
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
                value={subcategory}
                onValueChange={(value) => setSubcategory(value ?? "")}
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
                value={brand}
                onValueChange={(value) => setBrand(value ?? "")}
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

          {/* Price, Sale Price, Stock */}
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
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="salePrice">
                Sale Price
              </label>
              <Input
                id="salePrice"
                type="number"
                step="0.01"
                min="0"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
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
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
          </div>

          {/* SKU & Thumbnail URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="sku">
                SKU
              </label>
              <Input
                id="sku"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. TSHIRT-WHT-M"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="thumbnailUrl">
                Thumbnail URL (optional)
              </label>
              <Input
                id="thumbnailUrl"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Thumbnail Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Thumbnail Image</label>
            <div className="flex items-center gap-4">
              <Input type="file" accept="image/*" onChange={handleThumbnailChange} />
              {thumbnailPreview && (
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="h-20 w-20 object-cover rounded border"
                />
              )}
            </div>
          </div>

          {/* Featured / Active */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Featured</div>
                <div className="text-xs text-muted-foreground">Show on featured section</div>
              </div>
              <Switch checked={featured} onCheckedChange={setFeatured} />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Active</div>
                <div className="text-xs text-muted-foreground">Visible in storefront</div>
              </div>
              <Switch checked={active} onCheckedChange={setActive} />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setName("");
                setSlug("");
                setShortDescription("");
                setDescription("");
                setCategory("");
                setSubcategory("");
                setBrand("");
                setPrice("");
                setSalePrice("");
                setStock("");
                setSku("");
                setThumbnailUrl("");
                setThumbnailFile(null);
                setThumbnailPreview(null);
                setFeatured(false);
                setActive(true);
                setError(null);
                setSuccess(null);
              }}
            >
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