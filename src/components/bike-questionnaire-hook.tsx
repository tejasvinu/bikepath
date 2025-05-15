"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BikeRecommendOutput } from '@/ai/flows/recommend-bike';
import { Loader2 } from "lucide-react";
import { useBikeRecommendation } from "@/hooks/use-bike-recommendation";

interface BikeQuestionnaireProps {
  onComplete: (result: BikeRecommendOutput) => void;
}

export function BikeQuestionnaire({ onComplete }: BikeQuestionnaireProps) {
  const [userResponse, setUserResponse] = useState<string>("");
  const { state, submitUserResponse } = useBikeRecommendation();
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userResponse.trim()) return;
    
    await submitUserResponse(userResponse);
    setUserResponse(""); // Clear input field
    
    // If we have a result or error, pass it up to the parent component
    if (!state.currentQuestion) {
      const result: BikeRecommendOutput = {
        status: state.result ? 'RECOMMENDATION_MADE' : state.error ? 'NO_MATCH_FOUND' : 'ASKING_QUESTION',
        next_question: null,
        updated_bike_candidates_ids: state.bikeCandidates.map(bike => bike.id),
        final_recommendation: state.result,
        error_message: state.error
      };
      onComplete(result);
    }
  };

  return (
    <div className="space-y-6">
      {/* Conversation History */}
      {state.conversationHistory.length > 0 && (
        <div className="space-y-4">
          {state.conversationHistory.map((turn, index) => (
            <div key={index} className="space-y-2">
              <div className="bg-primary/10 p-3 rounded-lg">
                <p className="font-medium">Q: {turn.question}</p>
              </div>
              <div className="bg-accent/10 p-3 rounded-lg ml-4">
                <p>A: {turn.answer}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Current Question */}
      {state.currentQuestion && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <p className="font-medium">Q: {state.currentQuestion}</p>
              </div>
              
              <textarea
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
                value={userResponse}
                onChange={(e) => setUserResponse(e.target.value)}
                placeholder="Type your answer here..."
                disabled={state.isLoading}
              />
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={state.isLoading || !userResponse.trim()}
              >
                {state.isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Submit Answer"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
