// src/services/mongodb.ts
import { MongoClient, ServerApiVersion, type Db, type Document } from 'mongodb'; // Import Document
import type { Bike } from '@/types/bike';

const uri = process.env.MONGODB_URI;
const dbName = 'Product_base';
const collectionName = 'bikes';

if (!uri) {
  // This error is critical and should stop the application or at least this module's functionality.
  console.error('CRITICAL: MONGODB_URI environment variable is not defined. The application may not connect to the database.');
  // Depending on the application's structure, you might throw here to halt initialization
  // or let parts of the app run that don't depend on MongoDB. For now, logging and proceeding.
  // throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

async function connectToDatabase(): Promise<Db> {
  if (!uri) { // Check again, in case the module was loaded despite the initial console error.
    throw new Error('MONGODB_URI is not defined. Cannot connect to the database.');
  }
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
    // Fetch as raw documents. The _id field from MongoDB will be an ObjectId.
    const bikesCollection = db.collection(collectionName); 
    const rawDocs = await bikesCollection.find({}).skip(skip).limit(limit).toArray();
    
    // Map raw documents to the Bike type, transforming _id
    return rawDocs.map((doc: Document): Bike => {
      const { _id, ...restOfDoc } = doc;

      if (!_id) {
        // This should ideally not happen if MongoDB documents always have an _id
        console.error("Document fetched from database is missing an _id:", doc);
        // You might want to filter out such documents or handle them differently
        throw new Error("Encountered a document from the database missing an _id.");
      }

      // The Bike type expects _id to be { $oid: string }
      // The restOfDoc should conform to the other fields of the Bike type.
      // This is a direct cast; for full type safety, Zod parsing could be used here.
      const bikeData = restOfDoc as Omit<Bike, '_id'>;

      return {
        ...bikeData,
        _id: { $oid: _id.toString() }, // Correctly convert ObjectId to string and wrap in $oid
      };
    });
  } catch (error) {
    console.error('Error in getBikes service:', error); // Log the actual, specific error
    if (error instanceof Error) {
      // Re-throw with a more informative message including details from the original error
      throw new Error(`Failed to fetch bikes from database. Details: ${error.message}`);
    }
    // Fallback for non-Error objects thrown
    throw new Error('An unknown error occurred while fetching bikes from the database.');
  }
}
