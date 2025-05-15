
"use client";

import { useState, useEffect } from 'react';
import type { RecommendMotorcycleInput, RecommendMotorcycleOutput } from '@/ai/flows/recommend-motorcycle';
import { recommendMotorcycle } from '@/ai/flows/recommend-motorcycle';
import { MotorcycleQuestionnaire } from '@/components/motorcycle-questionnaire';
import { MotorcycleRecommendation } from '@/components/motorcycle-recommendation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcwIcon, Zap } from "lucide-react"; // Using Zap for motorcycle vibe

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<RecommendMotorcycleOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);


  const handleFormSubmit = async (data: RecommendMotorcycleInput) => {
    setIsLoading(true);
    setRecommendation(null);
    setError(null);
    try {
      const result = await recommendMotorcycle(data);
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
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-4 md:p-8 flex flex-col items-center selection:bg-primary/30">
      <div className="w-full max-w-2xl space-y-8">
        <header className="text-center py-8">
          <div className="flex items-center justify-center space-x-3">
            <Zap className="h-12 w-12 text-primary" />
            <h1 className="text-5xl md:text-6xl font-extrabold text-primary tracking-tight">
              MotorRide India
            </h1>
          </div>
          <p className="text-muted-foreground mt-3 text-lg md:text-xl">
            Your AI guide to finding the perfect motorcycle in India.
          </p>
        </header>

        {!recommendation && !isLoading && (
          <Card className="shadow-xl rounded-xl">
            <CardHeader>
              <CardTitle className="text-3xl text-center font-semibold">
                Let's Find Your Ride
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MotorcycleQuestionnaire onSubmit={handleFormSubmit} isLoading={isLoading} />
            </CardContent>
          </Card>
        )}

        {isLoading && (
          <div className="flex flex-col justify-center items-center p-12 space-y-4 bg-card shadow-xl rounded-xl">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="text-xl text-muted-foreground">Revving up your recommendation...</p>
          </div>
        )}

        {error && !isLoading && (
          <Alert variant="destructive" className="shadow-lg rounded-xl">
            <AlertTitle className="text-xl font-semibold">Oops! Hit a Pothole.</AlertTitle>
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
            <MotorcycleRecommendation recommendation={recommendation} />
            <Button onClick={handleStartOver} variant="outline" size="lg" className="w-full group">
              <RefreshCcwIcon className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
              Find Another Motorcycle
            </Button>
          </div>
        )}
      </div>
       <footer className="text-center py-8 mt-12 text-muted-foreground">
        {currentYear !== null ? <p>&copy; {currentYear} MotorRide India. All rights reserved.</p> : <p>Loading footer...</p>}
      </footer>
    </main>
  );
}
