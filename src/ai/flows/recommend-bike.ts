'use server';
/**
 * @fileOverview A bike recommendation AI flow for a conversational recommender system.
 *
 * - recommendBike - A function that handles the bike recommendation process.
 * - BikeRecommendInput - The input type for the recommendBike function.
 * - BikeRecommendOutput - The return type for the recommendBike function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define a schema for a conversation turn (question and answer)
const ConversationTurnSchema = z.object({
  question: z.string().describe('A question asked by the AI during the recommendation flow'),
  answer: z.string().describe('The user response to the question')
});

// Define the schema for a bike with all relevant attributes
const BikeAttributesSchema = z.object({
  type: z.string().describe('The type of the bike (e.g., Hybrid, Commuter, Mountain, Road)'),
  terrain: z.array(z.string()).describe('The types of terrain this bike is suitable for'),
  primary_use: z.string().describe('The primary intended use of the bike (e.g., Commuting, Recreation, Exercise)'),
  suspension: z.string().describe('The type of suspension, if any (e.g., None, Front Fork, Full)'),
  gears: z.string().describe('Description of the gear system'),
  budget_tier: z.string().describe('The budget tier (e.g., Entry, Mid, Premium)'),
  frame_material: z.string().describe('The material the frame is made of (e.g., Aluminum, Steel, Carbon Fiber)')
});

const BikeSchema = z.object({
  id: z.string().describe('Unique identifier for the bike'),
  name: z.string().describe('The name/model of the bike'),
  attributes: BikeAttributesSchema
});

// Define the input schema for the recommendation function
const BikeRecommendInputSchema = z.object({
  conversation_history: z.array(ConversationTurnSchema).describe('The history of questions and answers in the conversation'),
  current_bike_candidates: z.array(BikeSchema).describe('The current list of bikes being considered'),
  user_latest_response: z.string().describe('The latest response from the user')
});

export type BikeRecommendInput = z.infer<typeof BikeRecommendInputSchema>;

// Define the output schema for bike recommendation
const BikeRecommendationSchema = z.object({
  bike_id: z.string().describe('The ID of the recommended bike'),
  bike_details: z.object({
    name: z.string().describe('The name of the recommended bike'),
    brand: z.string().optional().describe('The brand of the recommended bike')
  }).describe('Key identifying details of the bike'),
  summary: z.string().describe('A personalized explanation of why this bike is recommended based on the conversation')
});

// Define the final output schema for the recommendation function
const BikeRecommendOutputSchema = z.object({
  status: z.enum(['ASKING_QUESTION', 'RECOMMENDATION_MADE', 'NO_MATCH_FOUND']).describe('The current status of the recommendation process'),
  next_question: z.string().nullable().describe('The next question to ask the user, or null if not applicable'),
  updated_bike_candidates_ids: z.array(z.string()).describe('IDs of bikes still considered viable after processing the user input'),
  final_recommendation: BikeRecommendationSchema.nullable().describe('The final bike recommendation if status is RECOMMENDATION_MADE, otherwise null'),
  error_message: z.string().nullable().describe('Any error message if status is NO_MATCH_FOUND or other errors occurred')
});

export type BikeRecommendOutput = z.infer<typeof BikeRecommendOutputSchema>;

export async function recommendBike(input: BikeRecommendInput): Promise<BikeRecommendOutput> {
  return recommendBikeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendBikePrompt',
  input: { schema: BikeRecommendInputSchema },
  output: { schema: BikeRecommendOutputSchema },
  prompt: `You are an expert bicycle recommendation assistant. Your task is to guide users through an interactive process to find the perfect bicycle for their needs.

For context, you have:
1. A conversation history with previous questions and answers: {{{conversation_history}}}
2. A list of currently viable bike candidates: {{{current_bike_candidates}}}
3. The user's latest response to your previous question: {{{user_latest_response}}}

Your task is to:
1. Interpret the user's latest response in the context of the conversation history.
2. Filter the current_bike_candidates based on the user's preferences.
3. Determine the next step in the conversation.

If more than one viable bike remains:
- Identify attributes that differentiate the remaining bikes (such as suspension type, frame material, etc.)
- Ask a clear, concise question to help differentiate user preference
- Return status "ASKING_QUESTION"

If exactly one viable bike remains:
- Provide a personalized recommendation
- Return status "RECOMMENDATION_MADE"

If no viable bikes remain:
- Provide a helpful error message
- Return status "NO_MATCH_FOUND"

Always maintain a conversational, helpful tone. Tailor your questions to effectively narrow down the selection.
`,
});

const recommendBikeFlow = ai.defineFlow(
  {
    name: 'recommendBikeFlow',
    inputSchema: BikeRecommendInputSchema,
    outputSchema: BikeRecommendOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);