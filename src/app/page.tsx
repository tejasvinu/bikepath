
"use client";

import { useState, useEffect } from 'react';
import { BikeQuestionnaire } from '@/components/bike-questionnaire';
import { BikeRecommendation } from '@/components/bike-recommendation'; 
import type { BikeRecommendOutput } from '@/ai/flows/recommend-bike';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Bike, Loader2, RefreshCcwIcon } from "lucide-react"; // Using Bike icon

export default function Home() {
  const [isLoading, setIsLoading] = useState(false); // To be reviewed if still needed after BikeQuestionnaire integration
  const [recommendationOutput, setRecommendationOutput] = useState<BikeRecommendOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showQuestionnaire, setShowQuestionnaire] = useState(true);
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const handleRecommendationComplete = (output: BikeRecommendOutput) => {
    setIsLoading(false); 
    setShowQuestionnaire(false); 
    if (output.status === 'RECOMMENDATION_MADE' && output.final_recommendation) {
      setRecommendationOutput(output);
      setError(null);
    } else { 
      setRecommendationOutput(null);
      setError(output.error_message || "Could not find a suitable bike based on your answers.");
    }
  };

  const handleStartOver = () => {
    setRecommendationOutput(null);
    setError(null);
    setShowQuestionnaire(true);
    // Consider adding a key to BikeQuestionnaire for robust reset if needed:
    // setQuestionnaireKey(prevKey => prevKey + 1); 
  };

  // const [questionnaireKey, setQuestionnaireKey] = useState(0); // For robust reset

  return (
    <main className="min-h-screen bg-background text-foreground p-4 md:p-8 flex flex-col items-center selection:bg-primary/30">
      <div className="w-full max-w-2xl space-y-8">
        <header className="text-center py-8">
          <div className="flex items-center justify-center space-x-3">
            <Bike className="h-12 w-12 text-primary" />
            <h1 className="text-5xl md:text-6xl font-extrabold text-primary tracking-tight">
              BikeFinder AI
            </h1>
          </div>
          <p className="text-muted-foreground mt-3 text-lg md:text-xl">
            Your AI guide to finding the perfect bicycle.
          </p>
        </header>

        {showQuestionnaire && (
          <Card className="shadow-xl rounded-xl">
            <CardHeader>
              <CardTitle className="text-3xl text-center font-semibold">
                Let's Find Your Ride
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* <BikeQuestionnaire key={questionnaireKey} onComplete={handleRecommendationComplete} /> */}
              <BikeQuestionnaire onComplete={handleRecommendationComplete} />
            </CardContent>
          </Card>
        )}

        {isLoading && showQuestionnaire && ( // This loading is for the page, BikeQuestionnaire has its own.
          <div className="flex flex-col justify-center items-center p-12 space-y-4 bg-card shadow-xl rounded-xl">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="text-xl text-muted-foreground">Loading questionnaire...</p>
          </div>
        )}

        {error && !showQuestionnaire && (
          <Alert variant="destructive" className="shadow-lg rounded-xl">
            <AlertTitle className="text-xl font-semibold">Oops! Couldn't Find a Match.</AlertTitle>
            <AlertDescription className="mt-1">
              {error}
            </AlertDescription>
            <Button onClick={handleStartOver} variant="outline" className="mt-4">
              Try Again
            </Button>
          </Alert>
        )}

        {recommendationOutput?.final_recommendation && !showQuestionnaire && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <BikeRecommendation recommendation={recommendationOutput.final_recommendation} />
            <Button onClick={handleStartOver} variant="outline" size="lg" className="w-full group">
              <RefreshCcwIcon className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
              Find Another Bicycle
            </Button>
          </div>
        )}
      </div>
       <footer className="text-center py-8 mt-12 text-muted-foreground">
        {currentYear !== null ? <p>&copy; {currentYear} BikeFinder AI. All rights reserved.</p> : <p>Loading footer...</p>}
      </footer>
    </main>
  );
}
