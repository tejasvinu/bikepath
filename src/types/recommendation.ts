// Types for the conversational bike recommendation system

/**
 * Represents a single turn in the conversation between the AI and the user.
 * Contains a question asked by the AI and the user's answer.
 */
export interface ConversationTurn {
  question: string;
  answer: string;
}

/**
 * Status enum for the recommendation process.
 */
export type RecommendationStatus = 'ASKING_QUESTION' | 'RECOMMENDATION_MADE' | 'NO_MATCH_FOUND';

/**
 * Represents a bike recommendation result.
 */
export interface BikeRecommendationResult {
  bike_id: string;
  bike_details: {
    name: string;
    brand?: string;
  };
  summary: string;
}

/**
 * Interface for the state of the bike recommendation process.
 */
export interface BikeRecommendationState {
  conversationHistory: ConversationTurn[];
  currentQuestion: string | null;
  currentQuestionOptions: string[] | null; // Added to store options for the current question
  bikeCandidates: any[]; // Using any for simplicity, should use BikeCandidate in real implementation
  isLoading: boolean;
  result: BikeRecommendationResult | null;
  error: string | null;
}
