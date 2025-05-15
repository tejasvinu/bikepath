// src/components/bike-card.tsx
"use client";

import Image from "next/image";
import type { BikeCardType } from "@/types/bike";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

interface BikeCardProps {
  bike: BikeCardType;
}

export function BikeCard({ bike }: BikeCardProps) {
  const placeholderImage = `https://placehold.co/300x200.png?text=${encodeURIComponent(bike.name)}`;
  const imageUrl = bike.image_url || placeholderImage;
  
  // Extracting a hint for placeholder generation if needed
  const nameParts = bike.name.split(' ');
  const hint = nameParts.length > 1 ? `${nameParts[0]} ${nameParts[1]}` : nameParts[0] || "motorcycle";


  return (
    <Card className="w-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full rounded-lg">
      <CardHeader className="p-0 relative">
        <Link href={bike.page_url || '#'} target="_blank" rel="noopener noreferrer" className="block">
          <div className="aspect-[3/2] w-full relative">
            <Image
              src={imageUrl}
              alt={bike.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              className="object-cover"
              data-ai-hint={!bike.image_url ? hint : undefined} // Add hint only for placeholders
              onError={(e) => {
                e.currentTarget.src = placeholderImage; // Fallback to generic placeholder on error
                e.currentTarget.dataset.aiHint = hint; 
              }}
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-semibold mb-1 leading-tight">
           <Link href={bike.page_url || '#'} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            {bike.name}
          </Link>
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground mb-2">{bike.brand}</CardDescription>
        <div className="text-xl font-bold text-primary mb-2">{bike.price_display}</div>
        
        {bike.rating_value && (
          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
            <span>{bike.rating_value.toFixed(1)}</span>
            {bike.review_count && <span className="ml-1">({bike.review_count} reviews)</span>}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 border-t bg-muted/50">
         <Button asChild variant="outline" className="w-full">
            <Link href={bike.page_url || '#'} target="_blank" rel="noopener noreferrer">
              View Details
            </Link>
          </Button>
      </CardFooter>
    </Card>
  );
}
