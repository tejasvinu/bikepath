"use client";

import Image from "next/image";
import type { BikeRecommendOutput } from "@/ai/flows/recommend-bike";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Info } from "lucide-react";

interface BikeRecommendationProps {
  recommendation: BikeRecommendOutput;
}

export function BikeRecommendation({ recommendation }: BikeRecommendationProps) {
  if (!recommendation.final_recommendation) {
    return null;
  }

  const { bike_id, bike_details, summary } = recommendation.final_recommendation;
  const { name, brand } = bike_details;

  // For demonstration purposes, we could include these in the final_recommendation in the future
  const highlights = [
    "Perfect match for your specified riding style",
    "Fits within your budget constraints",
    "Suitable for your terrain preferences",
    "Optimal gearing system for your needs",
    "Frame material chosen for your priorities"
  ];

  // Placeholder for when we have real images
  const image = "https://placehold.co/600x400.png?text=Bike+Image";

  return (
    <Card className="w-full max-w-2xl overflow-hidden shadow-xl rounded-xl">
      <CardHeader className="p-0">
        <div className="relative w-full h-64 md:h-80">
          <Image
            src={image}
            alt={`${brand || ''} ${name}`}
            layout="fill"
            objectFit="cover"
            data-ai-hint="bicycle"
          />
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <CardTitle className="text-3xl font-bold text-primary">
          {brand ? `${brand} ${name}` : name}
        </CardTitle>
        <CardDescription className="text-lg text-foreground/90 leading-relaxed">
          {summary}
        </CardDescription>
        
        <div>
          <h3 className="text-xl font-semibold mb-2 text-foreground">Key Highlights:</h3>
          <ul className="space-y-1.5 list-inside">
            {highlights.map((highlight, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 shrink-0" />
                <span className="text-foreground/80">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="bg-secondary/50 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 rounded-b-xl">
        <p className="text-2xl font-bold text-primary">
          ID: {bike_id}
        </p>
        <Badge variant="default" className="bg-accent text-accent-foreground text-sm px-4 py-1.5 shadow">
          Perfectly Matched Bike
        </Badge>
      </CardFooter>
    </Card>
  );
}