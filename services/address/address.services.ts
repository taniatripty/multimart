import { ObjectId } from "mongodb";

export interface CreateAddressPayload {
  userId: string;

  phone: string;

  division: string;
  district: string;
  area: string;

  postalCode?: string;

  address: string;

  addressType: "Home" | "Office";

  isDefault: boolean;
}


import { collectionNames, getCollection } from "@/lib/dbConnect";

export async function createAddressService(
  payload: CreateAddressPayload
) {
  const addressCollection = await getCollection(
    collectionNames.ADDRESS
  );

  if (!payload.userId) {
    throw new Error("User not found.");
  }

  if (!ObjectId.isValid(payload.userId)) {
    throw new Error("Invalid user.");
  }

  if (!payload.phone.trim()) {
    throw new Error("Phone number is required.");
  }

  if (!payload.division.trim()) {
    throw new Error("Division is required.");
  }

  if (!payload.district.trim()) {
    throw new Error("District is required.");
  }

  if (!payload.area.trim()) {
    throw new Error("Area is required.");
  }

  if (!payload.address.trim()) {
    throw new Error("Address is required.");
  }

  // Only one default address
  if (payload.isDefault) {
    await addressCollection.updateMany(
      {
        userId: payload.userId,
      },
      {
        $set: {
          isDefault: false,
        },
      }
    );
  }

  const address = {
    userId: payload.userId,

    phone: payload.phone,

    division: payload.division,
    district: payload.district,
    area: payload.area,

    postalCode: payload.postalCode || "",

    address: payload.address,

    addressType: payload.addressType,

    isDefault: payload.isDefault,

    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await addressCollection.insertOne(address);

  return {
    insertedId: result.insertedId,
  };
}





export async function getAllAddressesService() {
  const addressCollection = await getCollection(collectionNames.ADDRESS);

  const addresses = await addressCollection.find().toArray();

  return addresses;
}



export async function getSingleAddressService(userId: string) {
  const addressCollection = await getCollection(collectionNames.ADDRESS);

  const address = await addressCollection.findOne({
    userId,
  });

  if (!address) {
    throw new Error("Address not found.");
  }

  return address;
}