import { collectionNames, getCollection } from "@/lib/dbConnect";

export interface CreateBrands {
  name: string;
  slug: string;
  logo?: string;
  website?: string;
  description?: string;
  isActive: boolean;
}

export interface BrandDocuments {
  name: string;
  slug: string;
  logo?: string;
  website?: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

}

export async function createBrandService(
  payload:CreateBrands
) {
  const brandCollection = await getCollection(collectionNames.BRANDS);

  const existingBrand = await brandCollection.findOne({
    $or: [
      {
        name: {
          $regex: new RegExp(`^${payload.name}$`, "i"),
        },
      },
      {
        slug: payload.slug,
      },
    ],
  });

  if (existingBrand) {
    return {
      success: false,
      status: 409,
      message: "Brand already exists.",
    };
  }

  const result = await brandCollection.insertOne({
    name: payload.name,
    slug: payload.slug,
    logo: payload.logo ?? "",
    website: payload.website ?? "",
    description: payload.description ?? "",
    isActive: payload.isActive,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  if (!result.insertedId) {
    return {
      success: false,
      status: 500,
      message: "Failed to create brand.",
    };
  }

  return {
    success: true,
    status: 201,
    message: "Brand created successfully.",
  };
}

export async function getBrandsService() {
  const brandCollection = await getCollection<BrandDocuments>(
    collectionNames.BRANDS
  );

  const brands = await brandCollection
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return {
    success: true,
    status: 200,
    data: brands,
  };
}