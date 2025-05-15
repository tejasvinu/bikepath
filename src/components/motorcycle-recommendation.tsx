
"use client";

import Image from "next/image";
import type { RecommendMotorcycleOutput } from "@/ai/flows/recommend-motorcycle";
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

interface MotorcycleRecommendationProps {
  recommendation: RecommendMotorcycleOutput;
}

export function MotorcycleRecommendation({ recommendation }: MotorcycleRecommendationProps) {
  const { brand, model, description, price, image, highlights, suitabilityReason } = recommendation;

  return (
    <Card className="w-full max-w-2xl overflow-hidden shadow-xl rounded-xl">
      <CardHeader className="p-0">
        {image ? (
          <div className="relative w-full h-64 md:h-80">
            <Image
              src={image}
              alt={`${brand} ${model}`}
              layout="fill"
              objectFit="cover"
              data-ai-hint="motorcycle india"
            />
          </div>
        ) : (
          <div className="w-full h-64 md:h-80 bg-muted flex items-center justify-center" data-ai-hint="motorcycle silhouette">
            <p className="text-muted-foreground">No Image Available</p>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <CardTitle className="text-3xl font-bold text-primary">
          {brand} {model}
        </CardTitle>
        <CardDescription className="text-lg text-foreground/90 leading-relaxed">
          {description}
        </CardDescription>

        {suitabilityReason && (
          <div className="p-4 bg-accent/10 rounded-lg border border-accent/30">
            <h3 className="text-lg font-semibold mb-1.5 text-accent flex items-center">
              <Info className="h-5 w-5 mr-2 shrink-0" />
              Why this is a good fit for you in India:
            </h3>
            <p className="text-sm text-accent/90">{suitabilityReason}</p>
          </div>
        )}
        
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
          Price: ₹{price.toLocaleString('en-IN')}
        </p>
        <Badge variant="default" className="bg-accent text-accent-foreground text-sm px-4 py-1.5 shadow">
          Recommended Ride
        </Badge>
      </CardFooter>
    </Card>
  );
}
