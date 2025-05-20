"use client";

import { useState } from 'react';
import type { BikeRecommendOutput } from '@/ai/flows/recommend-bike';
import { recommendMotorcycle, type MotorcycleRecommendOutput, type RecommendMotorcycleInput } from '@/ai/flows/recommend-motorcycle'; // Updated imports
import { BikeQuestionnaire } from '@/components/bike-questionnaire-hook';
import { MotorcycleQuestionnaire } from '@/components/motorcycle-questionnaire';
import { BikeRecommendation } from '@/components/bike-recommendation';
import { MotorcycleRecommendation } from '@/components/motorcycle-recommendation'; // Updated import
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcwIcon, Bike, Zap } from "lucide-react";
import { useBikeRecommendation } from "@/hooks/use-bike-recommendation";

type VehicleType = 'bicycle' | 'motorcycle' | null;

export default function RecommendVehiclePage() {
  const [vehicleType, setVehicleType] = useState<VehicleType>(null);
  const [recommendation, setRecommendation] = useState<BikeRecommendOutput | MotorcycleRecommendOutput | null>(null);
  const { state: bikeHookState, startOver: startOverBikeHook } = useBikeRecommendation();

  const [motorcycleIsLoading, setMotorcycleIsLoading] = useState(false);
  const [motorcycleError, setMotorcycleError] = useState<string | null>(null);

  const handleBikeComplete = (result: BikeRecommendOutput) => {
    setRecommendation(result);
  };

  const handleMotorcycleSubmit = async (formData: RecommendMotorcycleInput) => { // Used RecommendMotorcycleInput
    setMotorcycleIsLoading(true);
    setMotorcycleError(null);
    setRecommendation(null);
    try {
      const result = await recommendMotorcycle(formData); // Actual API call
      setRecommendation(result);
    } catch (error: any) {
      setMotorcycleError(error.message || "An unexpected error occurred while recommending a motorcycle.");
    } finally {
      setMotorcycleIsLoading(false);
    }
  };

  const handleStartOver = () => {
    startOverBikeHook();
    setRecommendation(null);
    setVehicleType(null);
    setMotorcycleIsLoading(false);
    setMotorcycleError(null);
  };

  const pageTitle = vehicleType === 'bicycle' ? "Bike Finder" : vehicleType === 'motorcycle' ? "Motorcycle Finder" : "Ride Finder";
  const pageDescription = vehicleType === 'bicycle' ? "Your AI guide to finding the perfect bicycle." : vehicleType === 'motorcycle' ? "Your AI guide to finding the perfect motorcycle for India." : "Select your ride type to get started.";
  const cardTitle = vehicleType === 'bicycle' ? "Let's Find Your Perfect Bike" : vehicleType === 'motorcycle' ? "Let's Find Your Perfect Motorcycle" : "Choose Your Ride";


  return (
    <main className="min-h-screen bg-background text-foreground p-4 md:p-8 flex flex-col items-center selection:bg-primary/30">
      <div className="w-full max-w-2xl space-y-8">
        <header className="text-center py-8">
          <div className="flex items-center justify-center space-x-3">
            {vehicleType === 'bicycle' && <Bike className="h-12 w-12 text-primary" />}
            {vehicleType === 'motorcycle' && <Zap className="h-12 w-12 text-primary" />}
            {!vehicleType && <Bike className="h-12 w-12 text-primary" />} 
            <h1 className="text-5xl md:text-6xl font-extrabold text-primary tracking-tight">
              {pageTitle}
            </h1>
          </div>
          <p className="text-muted-foreground mt-3 text-lg md:text-xl">
            {pageDescription}
          </p>
        </header>

        {!vehicleType && !recommendation && !bikeHookState.error && !motorcycleError && (
          <Card className="shadow-xl rounded-xl">
            <CardHeader>
              <CardTitle className="text-3xl text-center font-semibold">
                {cardTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 justify-center items-center">
              <Button onClick={() => setVehicleType('bicycle')} size="lg" className="w-full md:w-auto">
                <Bike className="mr-2 h-5 w-5" />
                Find a Bicycle
              </Button>
              <Button onClick={() => setVehicleType('motorcycle')} size="lg" className="w-full md:w-auto">
                <Zap className="mr-2 h-5 w-5" />
                Find a Motorcycle (India)
              </Button>
            </CardContent>
          </Card>
        )}

        {vehicleType === 'bicycle' && !recommendation && !bikeHookState.error && (
          <Card className="shadow-xl rounded-xl">
            <CardHeader>
              <CardTitle className="text-3xl text-center font-semibold">
                {cardTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BikeQuestionnaire onComplete={handleBikeComplete} />
            </CardContent>
          </Card>
        )}

        {vehicleType === 'motorcycle' && !recommendation && !motorcycleError && (
          <Card className="shadow-xl rounded-xl">
            <CardHeader>
              <CardTitle className="text-3xl text-center font-semibold">
                {cardTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MotorcycleQuestionnaire onSubmit={handleMotorcycleSubmit} isLoading={motorcycleIsLoading} />
            </CardContent>
          </Card>
        )}
        
        {(bikeHookState.isLoading || motorcycleIsLoading) && (
          <div className="flex flex-col justify-center items-center p-12 space-y-4 bg-card shadow-xl rounded-xl">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="text-xl text-muted-foreground">
              {vehicleType === 'bicycle' ? 'Finding your perfect bicycle...' : 'Finding your perfect motorcycle...'}
            </p>
          </div>
        )}

        {(bikeHookState.error || motorcycleError) && !(bikeHookState.isLoading || motorcycleIsLoading) && (
          <Alert variant="destructive" className="shadow-lg rounded-xl">
            <AlertTitle className="text-xl font-semibold">Oops! We Hit a Bump.</AlertTitle>
            <AlertDescription className="mt-1">
              {bikeHookState.error || motorcycleError}
            </AlertDescription>
            <Button onClick={handleStartOver} variant="outline" className="mt-4">
              Try Again
            </Button>
          </Alert>
        )}

        {recommendation && recommendation.status === 'RECOMMENDATION_MADE' && !(bikeHookState.isLoading || motorcycleIsLoading) && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {vehicleType === 'bicycle' && recommendation && 'bikeType' in recommendation && (
              <BikeRecommendation recommendation={recommendation} />
            )}
            {vehicleType === 'motorcycle' && recommendation && 'make' in recommendation && (
              <MotorcycleRecommendation recommendation={recommendation} />
            )}
            <Button onClick={handleStartOver} variant="outline" size="lg" className="w-full group">
              <RefreshCcwIcon className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
              Find Another Ride
            </Button>
          </div>
        )}
      </div>
      <footer className="text-center py-8 mt-12 text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Ride Finder. All rights reserved.</p>
      </footer>
    </main>
  );
}
