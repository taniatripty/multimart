

// import { Db, MongoClient, ServerApiVersion } from "mongodb";

// const uri = process.env.MONGODB_URI!;
// const dbName = process.env.MONGODB_DB!;
// console.log(dbName)

// const options = {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// };

// let client: MongoClient;
// let mongoClientPromise: Promise<MongoClient>;

// declare global {
//   var _mongoClientPromise: Promise<MongoClient> | undefined;
// }

// if (process.env.NODE_ENV === "development") {
//   if (!global._mongoClientPromise) {
//     client = new MongoClient(uri, options);

//     global._mongoClientPromise = client.connect().then((client) => {
//       console.log("✅ MongoDB Connected Successfully");
//       return client;
//     });
//   }

//   mongoClientPromise = global._mongoClientPromise;
// } else {
//   client = new MongoClient(uri, options);

//   mongoClientPromise = client.connect().then((client) => {
//     console.log(" MongoDB Connected Successfully");
//     return client;
//   });
// }

// export async function connectDB(): Promise<Db> {
//   const client = await mongoClientPromise;
//   return client.db(dbName);
// }

// export default mongoClientPromise;

import { Db, MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB!;

if (!uri) {
  throw new Error("Missing MONGODB_URI");
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

export default clientPromise;