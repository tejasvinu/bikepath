"use client";

import { useState, useEffect, useRef } from 'react';
import { useMotorcycleRecommendationConversational } from '@/hooks/use-motorcycle-recommendation-conversational';
// import { MotorcycleRecommendation } from '@/components/motorcycle-recommendation'; // Will use direct display for now
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, RefreshCcwIcon, Zap, SendHorizonal } from "lucide-react";

export default function Home() {
  const { state, submitUserResponse, startOver } = useMotorcycleRecommendationConversational();
  const [userInput, setUserInput] = useState('');
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  useEffect(() => {
    // Scroll to bottom of chat history when new messages are added
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [state.conversationHistory, state.currentQuestion, state.isLoading, state.result, state.error]);


  const handleSubmitResponse = async () => {
    if (!userInput.trim()) return;
    await submitUserResponse(userInput);
    setUserInput('');
  };

  const handleStartOver = async () => {
    await startOver();
    setUserInput(''); // Clear input on start over
  };

  // Initial page loading state (when candidates are being fetched for the first time)
  if (state.isLoading && state.motorcycleCandidates.length === 0 && state.conversationHistory.length === 0 && !state.error) {
    return (
      <main className="min-h-screen bg-background text-foreground p-4 md:p-8 flex flex-col items-center justify-center selection:bg-primary/30">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="text-xl text-muted-foreground mt-4">Loading motorcycles...</p>
      </main>
    );
  }

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
            Your AI guide to finding the perfect motorcycle in India. (Conversational)
          </p>
        </header>

        <Card className="shadow-xl rounded-xl w-full">
          <CardHeader>
            <CardTitle className="text-2xl text-center font-semibold">
              Chat with our AI Expert
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScrollArea className="h-96 w-full rounded-md border p-4" ref={scrollAreaRef}>
              {state.conversationHistory.map((turn, index) => (
                <div key={index} className="mb-3">
                  <div className="bg-secondary p-3 rounded-lg shadow-sm mb-1">
                    <p className="text-sm font-semibold text-secondary-foreground">AI Question:</p>
                    <p className="text-sm text-secondary-foreground">{turn.question}</p>
                  </div>
                  <div className="bg-primary p-3 rounded-lg shadow-sm ml-auto max-w-[80%] float-right clear-both">
                    <p className="text-sm font-semibold text-primary-foreground">Your Answer:</p>
                    <p className="text-sm text-primary-foreground">{turn.answer}</p>
                  </div>
                </div>
              ))}
              
              {/* Clear float after messages */}
              <div className="clear-both"></div>

              {state.currentQuestion && !state.result && (
                <div className="bg-secondary p-3 rounded-lg shadow-sm mt-2">
                  <p className="text-sm font-semibold text-secondary-foreground">AI Question:</p>
                  <p className="text-sm text-secondary-foreground">{state.currentQuestion}</p>
                </div>
              )}

              {state.isLoading && state.currentQuestion && ( // Loading for next question
                 <div className="flex items-center space-x-2 mt-3 p-3 bg-muted rounded-lg">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Thinking...</p>
                  </div>
              )}
            </ScrollArea>

            {state.error && (
              <Alert variant="destructive" className="mt-4">
                <AlertTitle className="font-semibold">Error</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
                <Button onClick={handleStartOver} variant="outline" size="sm" className="mt-3">
                  Start Over
                </Button>
              </Alert>
            )}

            {state.result && (
              <Card className="mt-6 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 shadow-lg rounded-xl border-green-200">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-center text-green-700">We Found a Match!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-center">
                  <p className="text-xl font-semibold text-gray-800">{state.result.bike_details.name}</p>
                  <p className="text-md text-gray-600">Brand: {state.result.bike_details.brand}</p>
                  <div className="bg-green-100 p-3 rounded-md">
                     <p className="text-sm text-green-800 leading-relaxed">{state.result.summary}</p>
                  </div>
                  {/* 
                    Placeholder for full MotorcycleRecommendation component if adapted later
                    <MotorcycleRecommendation recommendation={{
                      brand: state.result.bike_details.brand || "N/A",
                      model: state.result.bike_details.name,
                      description: state.result.summary,
                      // These fields are not in state.result, would need adaptation or fetching
                      price: "N/A", 
                      image: "", 
                      highlights: [],
                      suitabilityReason: state.result.summary,
                    }} /> 
                  */}
                </CardContent>
                <CardFooter className="flex justify-center">
                   <Button onClick={handleStartOver} variant="default" size="lg" className="bg-green-600 hover:bg-green-700 text-white group">
                    <RefreshCcwIcon className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                    Start Over
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* Show input only if there's a current question and no result yet */}
            {state.currentQuestion && !state.result && !state.error && (
              <div className="mt-4 flex items-center space-x-2">
                <Input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Type your answer..."
                  disabled={state.isLoading}
                  onKeyPress={(e) => { if (e.key === 'Enter' && !state.isLoading) handleSubmitResponse(); }}
                  className="flex-1"
                />
                <Button onClick={handleSubmitResponse} disabled={state.isLoading || !userInput.trim()} className="bg-primary hover:bg-primary/90">
                  <SendHorizonal className="h-5 w-5" />
                  <span className="sr-only">Send</span>
                </Button>
              </div>
            )}
            
            {/* If no current question, no result, not loading, and no error, but conversation has happened (e.g. no match found by AI) */}
            {!state.currentQuestion && !state.result && !state.isLoading && !state.error && state.conversationHistory.length > 0 && (
                 <div className="text-center mt-6">
                    <p className="text-muted-foreground mb-3">It seems we've reached the end of this path or no specific matches were found based on the conversation.</p>
                    <Button onClick={handleStartOver} variant="outline" size="lg" className="group">
                        <RefreshCcwIcon className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                        Start Over
                    </Button>
                 </div>
            )}


          </CardContent>
        </Card>
      </div>
       <footer className="text-center py-8 mt-12 text-muted-foreground">
        {currentYear !== null ? <p>&copy; {currentYear} MotorRide India. All rights reserved.</p> : <p>Loading footer...</p>}
      </footer>
    </main>
  );
}
