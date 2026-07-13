import { collectionNames, getCollection } from "@/lib/dbConnect";

export interface CreateBrandPayload {
  name: string;
  slug: string;
  logo?: string;
  website?: string;
  description?: string;
  isActive: boolean;
}

export async function createBrandService(
  payload: CreateBrandPayload
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