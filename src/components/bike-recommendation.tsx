"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BikeRecommendation as BikeRecommendationType } from '@/ai/flows/recommend-bike'; // Ensure this path is correct

interface BikeRecommendationProps {
  recommendation: BikeRecommendationType | null | undefined;
}

export function BikeRecommendation({ recommendation }: BikeRecommendationProps) {
  if (!recommendation) {
    return null; // Or some placeholder if no recommendation is provided
  }

  const { bike_details, summary } = recommendation;

  return (
    <Card className="shadow-xl rounded-xl animate-in fade-in duration-500">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center">Your AI Recommended Bike!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-primary">{bike_details.name}</h3>
          {bike_details.brand && (
            <p className="text-sm text-muted-foreground">Brand: {bike_details.brand}</p>
          )}
        </div>
        <p className="text-base text-center text-muted-foreground px-2">{summary}</p>
        {/* Add more details here if needed, like bike_id for debugging or linking */}
        {/* <p className="text-xs text-center text-gray-400">ID: {recommendation.bike_id}</p> */}
      </CardContent>
    </Card>
  );
}
