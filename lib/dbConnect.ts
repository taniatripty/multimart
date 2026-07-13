
import { Collection, Db, MongoClient, Document } from "mongodb";

const uri = process.env.NEXT_PUBLIC_MONGODB_URI!;
const dbName = process.env.MONGODB_DB!;

export const collectionNames = {
  TEST_USER: "users",
  CATEGORIES:"categories",
  BRANDS:"brands"
};

if (!uri) {
  throw new Error("Missing NEXT_PUBLIC_MONGODB_URI");
}

if (!dbName) {
  throw new Error("Missing MONGODB_DB");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }

  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function connectDB(): Promise<Db> {
  const client = await clientPromise;

  // Verify the connection
  await client.db(dbName).command({ ping: 1 });

  console.log(`✅ MongoDB Connected → ${dbName}`);

  return client.db(dbName);
}

export async function getCollection<T extends Document>(
  name: string
): Promise<Collection<T>> {
  const client = await clientPromise;
  const db = client.db(dbName);
  return db.collection<T>(name);
}

export default clientPromise;