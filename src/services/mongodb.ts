// src/services/mongodb.ts
import { MongoClient, ServerApiVersion, type Db } from 'mongodb';
import type { Bike } from '@/types/bike';

const uri = process.env.MONGODB_URI;
const dbName = 'Product_base';
const collectionName = 'bikes';

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

async function connectToDatabase(): Promise<Db> {
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    // @ts-ignore
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri!, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });
      // @ts-ignore
      global._mongoClientPromise = client.connect();
    }
    // @ts-ignore
    clientPromise = global._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    if (!clientPromise) {
      client = new MongoClient(uri!, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });
      clientPromise = client.connect();
    }
  }
  
  const connectedClient = await clientPromise;
  return connectedClient.db(dbName);
}

export async function getBikes(limit: number = 20, skip: number = 0): Promise<Bike[]> {
  try {
    const db = await connectToDatabase();
    const bikesCollection = db.collection<Bike>(collectionName);
    const bikes = await bikesCollection.find({}).skip(skip).limit(limit).toArray();
    
    // Ensure _id is stringified for client-side usage if needed,
    // MongoDB driver returns ObjectId by default.
    // For this app, we'll assume downstream components can handle it or it's serialized correctly by Next.js.
    // If passing to client components directly and `_id` is used as a key, ensure it's a string.
    return bikes.map(bike => ({
      ...bike,
      _id: { $oid: bike._id.$oid.toString() } // Ensure $oid is a string
    }));
  } catch (error) {
    console.error('Failed to fetch bikes:', error);
    throw new Error('Failed to fetch bikes from database.');
  }
}
