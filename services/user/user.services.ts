import { collectionNames, getCollection } from "@/lib/dbConnect";
import { UserRole ,SellerStatus} from "@/lib/types";
import { ObjectId } from "mongodb";

export async function getAllSellerService() {
  const userCollection = await getCollection(
    collectionNames.TEST_USER
  );

  const sellers = await userCollection
    .find({
      role: UserRole.SELLER,
    })
    .project({
      password: 0,
    })
    .sort({
      createdAt: -1,
    })
    .toArray();

  return {
    success: true,
    status: 200,
    message: "Sellers fetched successfully.",
    data: sellers,
  };
}

export async function getSingleUserService(
  userId: string
) {
  if (!ObjectId.isValid(userId)) {
    throw new Error("Invalid user id.");
  }

  const userCollection = await getCollection(
    collectionNames.TEST_USER
  );

  const user = await userCollection.findOne({
    _id: new ObjectId(userId),
  });

  if (!user) {
    throw new Error("User not found.");
  }

  return user;
}

export async function getAllUserService() {
  const userCollection = await getCollection(
    collectionNames.TEST_USER
  );

  const sellers = await userCollection
    .find({})
    .project({
      password: 0,
    })
    .sort({
      createdAt: -1,
    })
    .toArray();

  return {
    success: true,
    status: 200,
    message: "Sellers fetched successfully.",
    data: sellers,
  };
}

export async function getAllApproveSellerService() {
  const userCollection = await getCollection(
    collectionNames.TEST_USER
  );

  const sellers = await userCollection
    .find({
      role: UserRole.SELLER,
      sellerStatus:SellerStatus.APPROVED
    })
    .project({
      password: 0,
    })
    .sort({
      createdAt: -1,
    })
    .toArray();

  return {
    success: true,
    status: 200,
    message: "Sellers fetched successfully.",
    data: sellers,
  };
}

interface UpdateUserPayload {
  name: string;
  phone?: string;
  image?: string;
  bio?: string;
}

export async function updateUserService(
  userId: string,
  payload: UpdateUserPayload
) {
  if (!ObjectId.isValid(userId)) {
    throw new Error("Invalid user id.");
  }

  const userCollection = await getCollection(
    collectionNames.TEST_USER
  );

  const result = await userCollection.findOneAndUpdate(
    {
      _id: new ObjectId(userId),
    },
    {
      $set: {
        name: payload.name,
        phone: payload.phone ?? "",
        image: payload.image ?? "",
        bio: payload.bio ?? "",
        updatedAt: new Date(),
      },
    },
    {
      returnDocument: "after",
    }
  );

  if (!result) {
    throw new Error("User not found.");
  }

  return result;
}

export interface UpdateUserRolePayload {
  id: string;
  role: UserRole;
}

interface UserDocument {
  _id: ObjectId;
  role: UserRole;
}

export async function updateUserRoleService(
  payload: UpdateUserRolePayload
) {
  if (!ObjectId.isValid(payload.id)) {
    return {
      success: false,
      status: 400,
      message: "Invalid user id.",
    };
  }

  

  const userCollection =
    await getCollection<UserDocument>(
      collectionNames.TEST_USER
    );

  const user = await userCollection.findOne({
    _id: new ObjectId(payload.id),
  });

  if (!user) {
    return {
      success: false,
      status: 404,
      message: "User not found.",
    };
  }

  // Don't allow changing seller role here
  if (user.role === UserRole.SELLER) {
    return {
      success: false,
      status: 400,
      message:
        "Seller accounts cannot be updated from this page.",
    };
  }

  await userCollection.updateOne(
    {
      _id: new ObjectId(payload.id),
    },
    {
      $set: {
        role: payload.role,
        updatedAt: new Date(),
      },
    }
  );

  return {
    success: true,
    status: 200,
    message: `User role updated to ${payload.role}.`,
  };
}