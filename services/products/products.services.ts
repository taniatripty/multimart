
import { collectionNames, getCollection } from "@/lib/dbConnect";
import { SellerStatus, UserRole } from "@/lib/types";
import { ObjectId } from "mongodb";

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

interface ProductDocument {
  _id?: ObjectId;
  name: string;
  shortDescription: string;
  description: string;

  categoryId: string;
  subcategory: string;
  brandId: string;

  sellerId: string;
  storeId?: string;

  price: number;
  discount: number;
  salePrice: number;
  stock: number;

  thumbnail: string;

  colors: string[];
  sizes: string[];
  features: string[];

  status: string;
  featured: boolean;

  averageRating: number;
  totalReviews: number;
  totalSold: number;
  views: number;

  createdAt: Date;
  updatedAt: Date;
}


export async function createProductService(
  payload: CreateProductPayload
) {
  const productCollection = await getCollection(collectionNames.PRODUCTS);
  const userCollection = await getCollection(collectionNames.TEST_USER);
  const seller = await userCollection.findOne({
  _id: new ObjectId(payload.seller),
});

if (!seller) {
  throw new Error("Seller account not found.");
}
if (seller.role !== UserRole.SELLER) {
  throw new Error(
    "Only registered sellers can create products."
  );
}

 if (seller.sellerStatus !== SellerStatus.APPROVED) {
  throw new Error(
    "Your seller account has not been approved yet. Please wait for admin approval before creating products."
  );
}

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

export async function getProductsService() {
  const productCollection =
    await getCollection<ProductDocument>(
      collectionNames.PRODUCTS
    );

  const categoryCollection =
    await getCollection(collectionNames.CATEGORIES);

  const brandCollection =
    await getCollection(collectionNames.BRANDS);

  const products = await productCollection
    .find({})
    .sort({
      createdAt: -1,
    })
    .toArray();

  const data = await Promise.all(
    products.map(async (product) => {
      const category = await categoryCollection.findOne({
        _id: new ObjectId(product.categoryId),
      });

      const brand = await brandCollection.findOne({
        _id: new ObjectId(product.brandId),
      });

      return {
        ...product,

        categoryName: category?.name ?? "",

        brandName: brand?.name ?? "",
      };
    })
  );

  return {
    success: true,
    status: 200,
    data,
  };
}

export async function getallActiveProductsService() {
  const productCollection =
    await getCollection<ProductDocument>(
      collectionNames.PRODUCTS
    );

  const categoryCollection =
    await getCollection(collectionNames.CATEGORIES);

  const brandCollection =
    await getCollection(collectionNames.BRANDS);

  const products = await productCollection
    .find({ status: "active",})
    .sort({
      createdAt: -1,
    })
    .toArray();

  const data = await Promise.all(
    products.map(async (product) => {
      const category = await categoryCollection.findOne({
        _id: new ObjectId(product.categoryId),
      });

      const brand = await brandCollection.findOne({
        _id: new ObjectId(product.brandId),
      });

      return {
        ...product,

        categoryName: category?.name ?? "",

        brandName: brand?.name ?? "",
      };
    })
  );

  return {
    success: true,
    status: 200,
    data,
  };
}

export async function getSingleProductService(id: string) {
  if (!ObjectId.isValid(id)) {
    return {
      success: false,
      status: 400,
      message: "Invalid product id.",
    };
  }

  const productCollection = await getCollection(
    collectionNames.PRODUCTS
  );

  const product = await productCollection.findOne({
    _id: new ObjectId(id),
  });

  if (!product) {
    return {
      success: false,
      status: 404,
      message: "Product not found.",
    };
  }

  return {
    success: true,
    status: 200,
    message: "Product fetched successfully.",
    data: product,
  };
}

export async function updateProductStatusService(
  id: string,
  status: "active" | "rejected"
) {
  if (!ObjectId.isValid(id)) {
    return {
      success: false,
      status: 400,
      message: "Invalid product id.",
    };
  }

  if (!["active", "rejected"].includes(status)) {
    return {
      success: false,
      status: 400,
      message: "Invalid product status.",
    };
  }

  const productCollection = await getCollection(
    collectionNames.PRODUCTS
  );

  const product = await productCollection.findOne({
    _id: new ObjectId(id),
  });

  if (!product) {
    return {
      success: false,
      status: 404,
      message: "Product not found.",
    };
  }

  if (product.status === status) {
    return {
      success: false,
      status: 409,
      message: `Product is already ${status}.`,
    };
  }

  const result = await productCollection.updateOne(
    {
      _id: new ObjectId(id),
    },
    {
      $set: {
        status,
        updatedAt: new Date(),
      },
    }
  );

  if (!result.modifiedCount) {
    return {
      success: false,
      status: 500,
      message: "Failed to update product status.",
    };
  }

  return {
    success: true,
    status: 200,
    message: `Product ${
      status === "active" ? "approved" : "rejected"
    } successfully.`,
  };
}