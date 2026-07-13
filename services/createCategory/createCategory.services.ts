import { collectionNames, getCollection } from "@/lib/dbConnect";

export interface CreateCategoryPayload {
  name: string;
  slug: string;
  image: string;
  description: string;
  subCategories: string[];
  isActive: boolean;
}

interface CategoryDocument {
  name: string;
  slug: string;
  image: string;
  description: string;
  subCategories: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export async function createCategoryService(
  payload: CreateCategoryPayload
) {
  const categoryCollection =
    await getCollection<CategoryDocument>(collectionNames.CATEGORIES);

  const exists = await categoryCollection.findOne({
    $or: [
      { name: payload.name },
      { slug: payload.slug },
    ],
  });

  if (exists) {
    return {
      success: false,
      status: 409,
      message: "Category already exists.",
    };
  }

  await categoryCollection.insertOne({
    name: payload.name,
    slug: payload.slug,
    image: payload.image,
    description: payload.description,
    subCategories: payload.subCategories,
    isActive: payload.isActive,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return {
    success: true,
    status: 201,
    message: "Category created successfully.",
  };
}

export async function getCategoriesService() {
  const categoryCollection =
    await getCollection<CategoryDocument>(
      collectionNames.CATEGORIES
    );

  const categories = await categoryCollection
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return {
    success: true,
    status: 200,
    data: categories,
  };
}