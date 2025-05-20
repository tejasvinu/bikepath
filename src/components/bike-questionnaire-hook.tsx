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
  // Helper function to check if we should complete the process
  const checkForCompleteState = () => {
    if (!state.currentQuestion && (state.result || state.error)) {
      const result: BikeRecommendOutput = {
        status: state.result ? 'RECOMMENDATION_MADE' : state.error ? 'NO_MATCH_FOUND' : 'ASKING_QUESTION',
        next_question: null,
        next_question_options: null,
        updated_bike_candidates_ids: state.bikeCandidates.map(bike => bike.id),
        final_recommendation: state.result,
        error_message: state.error
      };
      onComplete(result);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userResponse.trim()) return;

    await submitUserResponse(userResponse);
    setUserResponse(""); // Clear input field
    
    // Check if we need to complete the flow
    checkForCompleteState();
  };

  const handleOptionClick = async (option: string) => {
    await submitUserResponse(option);
    
    // Check if we need to complete the flow
    checkForCompleteState();
  };

  return (
    <div className="space-y-6">
      {/* Conversation History */}
      {state.conversationHistory.map((turn, index) => (
        <div key={index} className="space-y-2">
          <p className="text-muted-foreground font-medium">You asked: {turn.question}</p>
          <p className="text-primary font-semibold">User answered: {turn.answer}</p>
        </div>
      ))}

      {/* Current Question */}
      {state.currentQuestion && (
        <Card className="bg-secondary/30 p-6 rounded-lg shadow-sm">
          <p className="text-lg font-semibold text-foreground mb-4">{state.currentQuestion}</p>
          {state.currentQuestionOptions && state.currentQuestionOptions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {state.currentQuestionOptions.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3 px-4 hover:bg-primary/10 active:bg-primary/20 transition-colors duration-150 ease-in-out"
                  disabled={state.isLoading}
                >
                  {option}
                </Button>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                value={userResponse}
                onChange={(e) => setUserResponse(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow duration-150 ease-in-out min-h-[80px] bg-background shadow-sm"
                rows={3}
                disabled={state.isLoading}
              />
              <Button type="submit" disabled={state.isLoading || !userResponse.trim()} className="w-full sm:w-auto">
                {state.isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                ) : (
                  "Submit Answer"
                )}
              </Button>
            </form>
          )}
        </Card>
      )}
    </div>
  );
}
