"use client";

import { useState } from 'react';
import type { BikeRecommendOutput } from '@/ai/flows/recommend-bike';
import { BikeQuestionnaire } from '@/components/bike-questionnaire-hook';
import { BikeRecommendation } from '@/components/bike-recommendation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcwIcon, Bike } from "lucide-react";
import { useBikeRecommendation } from "@/hooks/use-bike-recommendation";

export default function RecommendBikePage() {
  const [recommendation, setRecommendation] = useState<BikeRecommendOutput | null>(null);
  const { state, startOver } = useBikeRecommendation();

  const handleComplete = (result: BikeRecommendOutput) => {
    setRecommendation(result);
  };

  const handleStartOver = () => {
    startOver();
    setRecommendation(null);
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-4 md:p-8 flex flex-col items-center selection:bg-primary/30">
      <div className="w-full max-w-2xl space-y-8">
        <header className="text-center py-8">
          <div className="flex items-center justify-center space-x-3">
            <Bike className="h-12 w-12 text-primary" />
            <h1 className="text-5xl md:text-6xl font-extrabold text-primary tracking-tight">
              Bike Finder
            </h1>
          </div>
          <p className="text-muted-foreground mt-3 text-lg md:text-xl">
            Your AI guide to finding the perfect bicycle.
          </p>
        </header>

        {!recommendation && !state.error && (
          <Card className="shadow-xl rounded-xl">
            <CardHeader>
              <CardTitle className="text-3xl text-center font-semibold">
                Let's Find Your Perfect Bike
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BikeQuestionnaire onComplete={handleComplete} />
            </CardContent>
          </Card>
        )}

        {state.isLoading && (
          <div className="flex flex-col justify-center items-center p-12 space-y-4 bg-card shadow-xl rounded-xl">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="text-xl text-muted-foreground">Finding your perfect bicycle...</p>
          </div>
        )}

        {state.error && !state.isLoading && (
          <Alert variant="destructive" className="shadow-lg rounded-xl">
            <AlertTitle className="text-xl font-semibold">Oops! We Hit a Bump.</AlertTitle>
            <AlertDescription className="mt-1">
              {state.error}
            </AlertDescription>
            <Button onClick={handleStartOver} variant="outline" className="mt-4">
              Try Again
            </Button>
          </Alert>
        )}

        {recommendation && recommendation.status === 'RECOMMENDATION_MADE' && !state.isLoading && (
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
        <p>&copy; {new Date().getFullYear()} Bike Finder. All rights reserved.</p>
      </footer>
    </main>
  );
}
