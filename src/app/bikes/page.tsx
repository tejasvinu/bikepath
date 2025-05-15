// src/app/bikes/page.tsx
import { getBikes } from '@/services/mongodb';
import type { Bike } from '@/types/bike';
import { BikeCard } from '@/components/bike-card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from 'lucide-react';

// Revalidate the page every hour, or as needed
export const revalidate = 3600; 

export default async function BikesPage() {
  let bikes: Bike[] = [];
  let error: string | null = null;

  try {
    bikes = await getBikes(50); // Fetch first 50 bikes
  } catch (e) {
    console.error("Failed to load bikes:", e);
    error = e instanceof Error ? e.message : "An unknown error occurred while fetching motorcycles.";
  }

  if (error) {
    return (
      <main className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle>Error Fetching Motorcycles</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </main>
    );
  }

  if (bikes.length === 0) {
    return (
      <main className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-8 text-primary">All Motorcycles</h1>
        <p className="text-muted-foreground">No motorcycles found in the database.</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-primary tracking-tight">
        Discover Your Next Ride
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {bikes.map((bike) => (
          <BikeCard key={bike._id.$oid} bike={bike} />
        ))}
      </div>
      {/* Basic pagination placeholder - can be implemented later */}
      {/* <div className="mt-12 flex justify-center">
        <Button variant="outline" className="mr-2">Previous</Button>
        <Button variant="outline">Next</Button>
      </div> */}
    </main>
  );
}
