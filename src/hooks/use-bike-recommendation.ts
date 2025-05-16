"use client";

import { useState, useEffect, useCallback } from 'react';
import { BikeRecommendInput, BikeRecommendOutput, recommendBike } from '@/ai/flows/recommend-bike';
import type { ConversationTurn, BikeRecommendationState } from '@/types/recommendation';
import type { BikeCandidate } from '@/types/bike';

// Sample bike data - in a real application, this would come from a database
const defaultBikeCandidates: BikeCandidate[] = [
  {
    id: "bike_123",
    name: "City Commuter",
    attributes: {
      type: "Hybrid",
      terrain: ["Paved Roads", "Light Gravel"],
      primary_use: "Commuting",
      suspension: "Front Fork",
      gears: "7-speed",
      budget_tier: "Mid",
      frame_material: "Aluminum"
    }
  },
  {
    id: "bike_456",
    name: "Mountain Explorer",
    attributes: {
      type: "Mountain",
      terrain: ["Off-road", "Rough Trails", "Gravel"],
      primary_use: "Trail Riding",
      suspension: "Full",
      gears: "21-speed",
      budget_tier: "Premium",
      frame_material: "Carbon Fiber"
    }
  },
  {
    id: "bike_789",
    name: "Road Racer",
    attributes: {
      type: "Road",
      terrain: ["Paved Roads"],
      primary_use: "Exercise",
      suspension: "None",
      gears: "18-speed",
      budget_tier: "Premium",
      frame_material: "Carbon Fiber"
    }
  },
  {
    id: "bike_101",
    name: "Urban Glide",
    attributes: {
      type: "Commuter",
      terrain: ["Paved Roads"],
      primary_use: "Commuting",
      suspension: "None",
      gears: "Single-speed",
      budget_tier: "Entry",
      frame_material: "Steel"
    }
  },
  {
    id: "bike_202",
    name: "Gravel Adventurer",
    attributes: {
      type: "Gravel",
      terrain: ["Gravel", "Paved Roads", "Light Trails"],
      primary_use: "Mixed",
      suspension: "Front Fork",
      gears: "11-speed",
      budget_tier: "Mid",
      frame_material: "Aluminum"
    }
  }
];

/**
 * Custom hook for managing bike recommendation state and logic.
 * 
 * @param initialQuestion The first question to ask the user
 * @param initialBikeCandidates Optional array of initial bike candidates
 */
export function useBikeRecommendation(
  initialQuestion: string = "What type of terrain will you primarily ride on?",
  initialBikeCandidates: BikeCandidate[] = defaultBikeCandidates
): {
  state: BikeRecommendationState;
  submitUserResponse: (response: string) => Promise<void>;
  startOver: () => void;
} {
  const [state, setState] = useState<BikeRecommendationState>({
    conversationHistory: [],
    currentQuestion: initialQuestion,
    currentQuestionOptions: null, // Initialize currentQuestionOptions
    bikeCandidates: initialBikeCandidates,
    isLoading: false,
    result: null,
    error: null
  });

  // Handle submitting the user's response to the current question
  const submitUserResponse = useCallback(async (response: string) => {
    if (!response.trim() || !state.currentQuestion) return;

    // Add this turn to the conversation history
    const newHistory = [
      ...state.conversationHistory,
      { question: state.currentQuestion, answer: response }
    ];
    
    setState(prev => ({
      ...prev,
      conversationHistory: newHistory,
      isLoading: true
    }));
    
    try {
      // Create the input for the AI flow
      const input: BikeRecommendInput = {
        conversation_history: newHistory,
        current_bike_candidates: state.bikeCandidates,
        user_latest_response: response
      };
      
      // Call the AI flow
      const result = await recommendBike(input);
      
      // Update bike candidates with the filtered list
      const updatedCandidates = state.bikeCandidates.filter(bike => 
        result.updated_bike_candidates_ids.includes(bike.id)
      );
      
      // Handle different statuses
      if (result.status === "ASKING_QUESTION") {
        setState(prev => ({
          ...prev,
          currentQuestion: result.next_question,
          currentQuestionOptions: result.next_question_options, // Update currentQuestionOptions
          bikeCandidates: updatedCandidates,
          isLoading: false
        }));
      } else if (result.status === "RECOMMENDATION_MADE") {
        setState(prev => ({
          ...prev,
          currentQuestion: null,
          currentQuestionOptions: null, // Clear options on recommendation
          bikeCandidates: updatedCandidates,
          result: result.final_recommendation,
          isLoading: false
        }));
      } else {
        // No matches found
        setState(prev => ({
          ...prev,
          currentQuestion: null,
          currentQuestionOptions: null, // Clear options on error
          bikeCandidates: [],
          error: result.error_message || "No bikes match your criteria.",
          isLoading: false
        }));
      }
    } catch (error) {
      console.error("Error in bike recommendation flow:", error);
      setState(prev => ({
        ...prev,
        error: "An error occurred while processing your request. Please try again.",
        isLoading: false
      }));
    }
  }, [state.conversationHistory, state.currentQuestion, state.bikeCandidates]);

  // Reset the state to start over
  const startOver = useCallback(() => {
    setState({
      conversationHistory: [],
      currentQuestion: initialQuestion,
      currentQuestionOptions: null, // Reset currentQuestionOptions
      bikeCandidates: initialBikeCandidates,
      isLoading: false,
      result: null,
      error: null
    });
  }, [initialQuestion, initialBikeCandidates]);

  return {
    state,
    submitUserResponse,
    startOver
  };
}
