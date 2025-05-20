
"use client";

import { useState, useEffect, useCallback } from 'react';
import { MotorcycleRecommendInput, MotorcycleRecommendOutput, recommendMotorcycleConversational } from '@/ai/flows/recommend-motorcycle-conversational';
import { MotorcycleCandidateSchema, MotorcycleDataSchema, type MotorcycleCandidate, type MotorcycleData } from '@/types/bike';
import type { ConversationTurn } from '@/types/recommendation'; // Assuming this path is correct
import { getBikes as getMotorcycles } from '@/services/mongodb'; // Assuming this function can fetch motorcycle data

// Define MotorcycleRecommendationState
export interface MotorcycleRecommendationState {
  conversationHistory: ConversationTurn[];
  currentQuestion: string | null;
  motorcycleCandidates: MotorcycleCandidate[];
  isLoading: boolean;
  result: MotorcycleRecommendOutput['final_recommendation'];
  error: string | null;
}

// Helper function to categorize engine displacement
const categorizeEngineDisplacement = (displacement?: string): string => {
  if (!displacement) return "Unknown";
  const dispNumeric = parseInt(displacement.replace(/[^0-9]/g, ''), 10);
  if (isNaN(dispNumeric)) return "Unknown";
  if (dispNumeric < 100) return "<100cc";
  if (dispNumeric <= 125) return "100-125cc";
  if (dispNumeric <= 150) return "125-150cc";
  if (dispNumeric <= 200) return "150-200cc";
  if (dispNumeric <= 250) return "200-250cc";
  if (dispNumeric <= 300) return "250-300cc";
  if (dispNumeric <= 500) return "300-500cc";
  return "500cc+";
};

// Helper function to categorize mileage
const categorizeMileage = (mileage?: string): string => {
  if (!mileage) return "Unknown";
  // Assuming mileage is like "45 kmpl" or "Approx 60 kmpl"
  const mileageNumeric = parseInt(mileage.replace(/[^0-9.]/g, ''), 10);
  if (isNaN(mileageNumeric)) return "Unknown";
  if (mileageNumeric >= 60) return "Very High (60+ kmpl)";
  if (mileageNumeric >= 50) return "High (50-60 kmpl)";
  if (mileageNumeric >= 40) return "Medium (40-50 kmpl)";
  if (mileageNumeric >= 30) return "Low (30-40 kmpl)";
  return "Very Low (<30 kmpl)";
};

// Helper function to categorize budget
const categorizeBudget = (price?: number): string => {
  if (price === undefined) return "Unknown";
  if (price < 80000) return "Entry (< ₹80k)";
  if (price < 120000) return "Budget (₹80k - ₹1.2L)";
  if (price < 180000) return "Mid-Range (₹1.2L - ₹1.8L)";
  if (price < 250000) return "Premium (₹1.8L - ₹2.5L)";
  return "Super Premium (> ₹2.5L)";
};

// Helper to infer type and primary use
const inferTypeAndUse = (name?: string, specs?: MotorcycleData['detailed_specifications']): { type: string, primaryUse: string } => {
  const lowerName = name?.toLowerCase() || "";
  let type = "Commuter"; // Default
  let primaryUse = "City Commute"; // Default

  if (lowerName.includes("scooter")) { type = "Scooter"; primaryUse = "City Commute"; }
  else if (lowerName.includes("sport") || lowerName.includes("racing") || lowerName.includes("rr") || lowerName.includes("rc")) { type = "Sport"; primaryUse = "Sport Riding"; }
  else if (lowerName.includes("cruiser") || lowerName.includes("avenger") || lowerName.includes("meteor") || lowerName.includes("classic")) { type = "Cruiser"; primaryUse = "Leisure Riding"; }
  else if (lowerName.includes("adventure") || lowerName.includes("himalayan") || lowerName.includes("xpulse") || lowerName.includes("adv")) { type = "Adventure/Off-road"; primaryUse = "Off-road Adventures"; }
  else if (lowerName.includes("cafe racer")) { type = "Cafe Racer"; primaryUse = "Weekend Rides"; }
  
  // Further refinement based on specs if needed, e.g. specs?.['SomeCategory']?.['UseType']

  return { type, primaryUse };
};


/**
 * Custom hook for managing motorcycle recommendation state and logic for a conversational flow.
 */
export function useMotorcycleRecommendationConversational(
  initialQuestion: string = "What kind of motorcycle are you looking for? (e.g., for city commuting, long tours, off-roading, or sporty rides?)"
): {
  state: MotorcycleRecommendationState;
  submitUserResponse: (response: string) => Promise<void>;
  startOver: () => Promise<void>; // Modified to be async for potential re-fetch
} {
  const [state, setState] = useState<MotorcycleRecommendationState>({
    conversationHistory: [],
    currentQuestion: initialQuestion,
    motorcycleCandidates: [],
    isLoading: true, // Start with loading true for initial fetch
    result: null,
    error: null
  });

  const [initialMotorcycles, setInitialMotorcycles] = useState<MotorcycleCandidate[]>([]);

  // Fetch and process motorcycle data on mount
  useEffect(() => {
    const fetchAndProcessData = async () => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      try {
        const rawMotorcycles: MotorcycleData[] = await getMotorcycles(200); // Fetch more to have a good pool

        const processedCandidates: MotorcycleCandidate[] = rawMotorcycles.map((bike): MotorcycleCandidate | null => {
          try {
            const { type: inferredType, primaryUse: inferredPrimaryUse } = inferTypeAndUse(bike.name, bike.detailed_specifications);

            const candidate: MotorcycleCandidate = {
              id: bike._id.$oid,
              name: bike.name,
              brand: bike.brand,
              priceNumeric: bike.price_numeric,
              imageUrl: bike.image_url,
              attributes: {
                type: inferredType,
                engineDisplacement: categorizeEngineDisplacement(bike.detailed_specifications?.["Engine and Transmission"]?.Displacement),
                mileage: categorizeMileage(bike.detailed_specifications?.Performance?.Mileage || bike.detailed_specifications?.["Motor & Battery"]?.Mileage),
                primaryUse: inferredPrimaryUse,
                budgetTier: categorizeBudget(bike.price_numeric),
                keyFeatures: Object.values(bike.detailed_specifications?.Features || {}).concat(Object.values(bike.detailed_specifications?.["Features and Safety"] || {})).filter(Boolean) as string[],
                brand: bike.brand,
              }
            };
            // Validate with Zod schema
            MotorcycleCandidateSchema.parse(candidate);
            return candidate;
          } catch (e) {
            console.warn(`Skipping motorcycle due to validation/processing error: ${bike.name}`, e);
            return null;
          }
        }).filter((candidate): candidate is MotorcycleCandidate => candidate !== null);
        
        setInitialMotorcycles(processedCandidates);
        setState(prev => ({
          ...prev,
          motorcycleCandidates: processedCandidates,
          isLoading: false
        }));
      } catch (err) {
        console.error("Error fetching or processing motorcycle data:", err);
        setState(prev => ({
          ...prev,
          error: "Failed to load motorcycle data. Please try refreshing.",
          isLoading: false
        }));
      }
    };

    fetchAndProcessData();
  }, []); // Empty dependency array means this runs once on mount

  // Handle submitting the user's response
  const submitUserResponse = useCallback(async (response: string) => {
    if (!response.trim() || !state.currentQuestion) return;

    const newHistory: ConversationTurn[] = [
      ...state.conversationHistory,
      { question: state.currentQuestion, answer: response }
    ];
    
    setState(prev => ({
      ...prev,
      conversationHistory: newHistory,
      isLoading: true,
      error: null,
    }));
    
    try {
      const input: MotorcycleRecommendInput = {
        conversation_history: newHistory,
        current_motorcycle_candidates: state.motorcycleCandidates,
        user_latest_response: response
      };
      
      const result: MotorcycleRecommendOutput = await recommendMotorcycleConversational(input);
      
      const updatedCandidates = state.motorcycleCandidates.filter(mc => 
        result.updated_motorcycle_candidates_ids.includes(mc.id)
      );
      
      if (result.status === "ASKING_QUESTION") {
        setState(prev => ({
          ...prev,
          currentQuestion: result.next_question,
          motorcycleCandidates: updatedCandidates,
          isLoading: false
        }));
      } else if (result.status === "RECOMMENDATION_MADE") {
        setState(prev => ({
          ...prev,
          currentQuestion: null,
          motorcycleCandidates: updatedCandidates, // Keep filtered list that led to recommendation
          result: result.final_recommendation,
          isLoading: false
        }));
      } else { // NO_MATCH_FOUND
        setState(prev => ({
          ...prev,
          currentQuestion: null,
          motorcycleCandidates: [], // No candidates match
          error: result.error_message || "No motorcycles match your criteria based on the conversation.",
          isLoading: false
        }));
      }
    } catch (error) {
      console.error("Error in motorcycle recommendation flow:", error);
      setState(prev => ({
        ...prev,
        error: "An error occurred while processing your request. Please try again.",
        isLoading: false
      }));
    }
  }, [state.conversationHistory, state.currentQuestion, state.motorcycleCandidates]);

  // Reset the state to start over
  const startOver = useCallback(async () => {
    // Option 1: Re-fetch data (simulated here by resetting to initialMotorcycles)
    // If initialMotorcycles is empty, it implies the initial fetch failed, so ideally, one might trigger a re-fetch.
    // For this implementation, we'll just reset to the fetched list or an empty list if the initial fetch failed.
    setState({
      conversationHistory: [],
      currentQuestion: initialQuestion,
      motorcycleCandidates: initialMotorcycles, // Reset to initially fetched list
      isLoading: false, // Set to false, or true if you were to re-trigger fetch
      result: null,
      error: null
    });
    // If you wanted to truly re-fetch, you might need to call a data fetching function here
    // and potentially set isLoading to true.
    // For simplicity, if initialMotorcycles is empty, we might be in an error state from initial load.
    if (initialMotorcycles.length === 0) {
        // This suggests the initial load might have failed or is still pending.
        // A robust solution might re-trigger the fetch operation from useEffect.
        // For now, we'll just log it.
        console.log("StartOver called, initial motorcycle list is empty. Consider re-fetching if needed.");
         // Trigger re-fetch manually if needed, by calling the effect's function or similar logic
        // await fetchAndProcessData(); // This would require fetchAndProcessData to be defined in a way it can be called here
    }

  }, [initialQuestion, initialMotorcycles]);

  return {
    state,
    submitUserResponse,
    startOver
  };
}

