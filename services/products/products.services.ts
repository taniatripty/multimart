// import { ObjectId } from "mongodb";
// import { collectionNames, getCollection } from "@/lib/dbConnect";

// export interface CreateProductPayload {
//   name: string;
//   shortDescription?: string;
//   description?: string;

//   category: string;
//   subcategory?: string;

//   brand: string;

//   price: number;
//   discount: number;

//   stock: number;

//   thumbnail?: string;

//   colors?: string[];
//   sizes?: string[];
//   features?: string[];
// }

// export async function createProductService(
//   payload: CreateProductPayload
// ) {
//   const productCollection = await getCollection(
//     collectionNames.PRODUCTS
//   );

//   // Duplicate Name Check
//   const existingProduct = await productCollection.findOne({
//     name: payload.name,
//   });

//   if (existingProduct) {
//     throw new Error("Product already exists.");
//   }

//   const product = {
//     ...payload,

//     categoryId: new ObjectId(payload.category),

//     subcategory: payload.subcategory || null,

//     brandId: new ObjectId(payload.brand),

//     // seller info
//     sellerId: null,
//     storeId: null,

//     // calculated
//     salePrice:
//       payload.discount > 0
//         ? Number(
//             (
//               payload.price -
//               payload.price * (payload.discount / 100)
//             ).toFixed(2)
//           )
//         : payload.price,

//     // admin controlled
//     status: "pending",

//     featured: false,

//     // review
//     averageRating: 0,

//     totalReviews: 0,

//     totalSold: 0,

//     views: 0,

//     createdAt: new Date(),

//     updatedAt: new Date(),
//   };

//   const result = await productCollection.insertOne(product);

//   return {
//     insertedId: result.insertedId,
//   };
// }

import { collectionNames, getCollection } from "@/lib/dbConnect";

export interface CreateProductPayload {
  name: string;
  shortDescription?: string;
  description?: string;

  category: string;
  subcategory?: string;

  brand: string;

  price: number;
  discount: number;

  stock: number;

  thumbnail?: string;

  colors?: string[];
  sizes?: string[];
  features?: string[];

  seller: string;
}

export async function createProductService(
  payload: CreateProductPayload
) {
  const productCollection = await getCollection(collectionNames.PRODUCTS);

  // Validation
  if (!payload.name.trim()) {
    throw new Error("Product name is required.");
  }

  if (!payload.category) {
    throw new Error("Category is required.");
  }

  if (!payload.brand) {
    throw new Error("Brand is required.");
  }

  if (!payload.seller) {
    throw new Error("Seller is required.");
  }

  if (payload.price <= 0) {
    throw new Error("Price must be greater than 0.");
  }

  if (payload.stock < 0) {
    throw new Error("Stock cannot be negative.");
  }

  if (payload.discount < 0 || payload.discount > 100) {
    throw new Error("Discount must be between 0 and 100.");
  }

  // Duplicate product name for the same seller
  const existingProduct = await productCollection.findOne({
    name: payload.name,
    sellerId: payload.seller,
  });

  if (existingProduct) {
    throw new Error("You already created this product.");
  }

  const salePrice =
    payload.discount > 0
      ? Number(
          (
            payload.price -
            payload.price * (payload.discount / 100)
          ).toFixed(2)
        )
      : payload.price;

  const product = {
    name: payload.name,
    shortDescription: payload.shortDescription || "",
    description: payload.description || "",

    // Store IDs as strings
    categoryId: payload.category,
    subcategory: payload.subcategory || "",
    brandId: payload.brand,

    // Seller
    sellerId: payload.seller,
    storeId: "",

    // Pricing
    price: payload.price,
    discount: payload.discount,
    salePrice,

    // Inventory
    stock: payload.stock,

    // Media
    thumbnail: payload.thumbnail || "",

    // Attributes
    colors: payload.colors || [],
    sizes: payload.sizes || [],
    features: payload.features || [],

    // Admin controlled
    status: "pending",
    featured: false,

    // Analytics
    averageRating: 0,
    totalReviews: 0,
    totalSold: 0,
    views: 0,

    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await productCollection.insertOne(product);

  return {
    insertedId: result.insertedId,
  };
}