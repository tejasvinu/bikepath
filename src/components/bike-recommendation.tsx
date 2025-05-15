
"use client";

import Image from "next/image";
import type { RecommendBikeOutput } from "@/ai/flows/recommend-bike";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

interface BikeRecommendationProps {
  recommendation: RecommendBikeOutput;
}

export function BikeRecommendation({ recommendation }: BikeRecommendationProps) {
  const { brand, model, description, price, image, highlights } = recommendation;

  return (
    <Card className="w-full max-w-2xl overflow-hidden shadow-xl">
      <CardHeader className="p-0">
        {image ? (
          <div className="relative w-full h-64 md:h-80">
            <Image
              src={image}
              alt={`${brand} ${model}`}
              layout="fill"
              objectFit="cover"
              data-ai-hint="bicycle professional"
            />
          </div>
        ) : (
          <div className="w-full h-64 md:h-80 bg-muted flex items-center justify-center" data-ai-hint="bicycle silhouette">
            <p className="text-muted-foreground">No Image Available</p>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <CardTitle className="text-3xl font-bold text-primary">
          {brand} {model}
        </CardTitle>
        <CardDescription className="text-lg text-foreground leading-relaxed">
          {description}
        </CardDescription>

        <div>
          <h3 className="text-xl font-semibold mb-2 text-accent">Key Highlights:</h3>
          <ul className="space-y-1.5 list-inside">
            {highlights.map((highlight, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="bg-secondary/50 p-6 flex justify-between items-center">
        <p className="text-2xl font-bold text-primary">
          Price: ${price.toLocaleString()}
        </p>
        <Badge variant="default" className="bg-accent text-accent-foreground text-sm px-3 py-1">
          Recommended
        </Badge>
      </CardFooter>
    </Card>
  );
}
