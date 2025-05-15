
"use client";

import { useState } from 'react';
import type { RecommendBikeInput, RecommendBikeOutput } from '@/ai/flows/recommend-bike';
import { recommendBike } from '@/ai/flows/recommend-bike';
import { BikeQuestionnaire } from '@/components/bike-questionnaire';
import { BikeRecommendation } from '@/components/bike-recommendation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcwIcon } from "lucide-react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<RecommendBikeOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (data: RecommendBikeInput) => {
    setIsLoading(true);
    setRecommendation(null);
    setError(null);
    try {
      const result = await recommendBike(data);
      setRecommendation(result);
    } catch (e) {
      console.error("Recommendation error:", e);
      setError(e instanceof Error ? e.message : "An unknown error occurred while fetching your recommendation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    setRecommendation(null);
    setError(null);
    // Optionally reset form state if BikeQuestionnaire is memoized or needs explicit reset
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-4 md:p-8 flex flex-col items-center selection:bg-primary/30">
      <div className="w-full max-w-2xl space-y-8">
        <header className="text-center py-8">
          <h1 className="text-5xl md:text-6xl font-extrabold text-primary tracking-tight">
            BikePath
          </h1>
          <p className="text-muted-foreground mt-3 text-lg md:text-xl">
            Your AI companion for finding the perfect bicycle.
          </p>
        </header>

        {!recommendation && !isLoading && (
          <Card className="shadow-xl rounded-xl">
            <CardHeader>
              <CardTitle className="text-3xl text-center font-semibold">
                Let's Find Your Bike
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BikeQuestionnaire onSubmit={handleFormSubmit} isLoading={isLoading} />
            </CardContent>
          </Card>
        )}

        {isLoading && (
          <div className="flex flex-col justify-center items-center p-12 space-y-4 bg-card shadow-xl rounded-xl">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="text-xl text-muted-foreground">Crafting your recommendation...</p>
          </div>
        )}

        {error && !isLoading && (
          <Alert variant="destructive" className="shadow-lg rounded-xl">
            <AlertTitle className="text-xl font-semibold">Oops! Something went wrong.</AlertTitle>
            <AlertDescription className="mt-1">
              {error}
            </AlertDescription>
            <Button onClick={handleStartOver} variant="outline" className="mt-4">
              Try Again
            </Button>
          </Alert>
        )}

        {recommendation && !isLoading && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <BikeRecommendation recommendation={recommendation} />
            <Button onClick={handleStartOver} variant="outline" size="lg" className="w-full group">
              <RefreshCcwIcon className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
              Find Another Bike
            </Button>
          </div>
        )}
      </div>
       <footer className="text-center py-8 mt-12 text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} BikePath. All rights reserved.</p>
      </footer>
    </main>
  );
}
