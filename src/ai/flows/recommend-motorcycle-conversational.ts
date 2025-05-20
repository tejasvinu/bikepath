
'use server';
/**
 * @fileOverview A motorcycle recommendation AI flow for a conversational recommender system.
 *
 * - recommendMotorcycleConversational - A function that handles the motorcycle recommendation process.
 * - MotorcycleRecommendInput - The input type for the recommendMotorcycleConversational function.
 * - MotorcycleRecommendOutput - The return type for the recommendMotorcycleConversational function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { MotorcycleCandidateSchema, MotorcycleAttributesSchema } from '@/types/bike'; // Adjusted import

// Define a schema for a conversation turn (question and answer)
const ConversationTurnSchema = z.object({
  question: z.string().describe('A question asked by the AI during the recommendation flow'),
  answer: z.string().describe('The user response to the question')
});

// Using imported MotorcycleCandidateSchema directly for the list of candidates
const MotorcycleCandidateSchemaImported = MotorcycleCandidateSchema.describe('Schema for a motorcycle candidate provided in the input');

// Define the input schema for the recommendation function
const MotorcycleRecommendInputSchema = z.object({
  conversation_history: z.array(ConversationTurnSchema).describe('The history of questions and answers in the conversation'),
  current_motorcycle_candidates: z.array(MotorcycleCandidateSchemaImported).describe('The current list of motorcycles being considered'),
  user_latest_response: z.string().describe('The latest response from the user')
});

export type MotorcycleRecommendInput = z.infer<typeof MotorcycleRecommendInputSchema>;

// Define the output schema for motorcycle recommendation
const MotorcycleRecommendationSchema = z.object({
  bike_id: z.string().describe('The ID of the recommended motorcycle'), // Retaining 'bike_id' for now as per original, can be changed to motorcycle_id if preferred
  bike_details: z.object({ // Similarly, 'bike_details'
    name: z.string().describe('The name of the recommended motorcycle'),
    brand: z.string().optional().describe('The brand of the recommended motorcycle')
  }).describe('Key identifying details of the motorcycle'),
  summary: z.string().describe('A personalized explanation of why this motorcycle is recommended based on the conversation')
});

// Define the final output schema for the recommendation function
const MotorcycleRecommendOutputSchema = z.object({
  status: z.enum(['ASKING_QUESTION', 'RECOMMENDATION_MADE', 'NO_MATCH_FOUND']).describe('The current status of the recommendation process'),
  next_question: z.string().nullable().describe('The next question to ask the user, or null if not applicable'),
  updated_motorcycle_candidates_ids: z.array(z.string()).describe('IDs of motorcycles still considered viable after processing the user input'),
  final_recommendation: MotorcycleRecommendationSchema.nullable().describe('The final motorcycle recommendation if status is RECOMMENDATION_MADE, otherwise null'),
  error_message: z.string().nullable().describe('Any error message if status is NO_MATCH_FOUND or other errors occurred')
});

export type MotorcycleRecommendOutput = z.infer<typeof MotorcycleRecommendOutputSchema>;

export async function recommendMotorcycleConversational(input: MotorcycleRecommendInput): Promise<MotorcycleRecommendOutput> {
  return recommendMotorcycleConversationalFlow(input);
}

const motorcyclePrompt = ai.definePrompt({ // Renamed from 'prompt' to avoid potential conflicts if other prompts exist
  name: 'recommendMotorcycleConversationalPrompt',
  input: { schema: MotorcycleRecommendInputSchema },
  output: { schema: MotorcycleRecommendOutputSchema },
  prompt: `You are an expert motorcycle recommendation assistant specializing in the Indian market. Your task is to guide users through an interactive process to find the perfect motorcycle for their needs.

For context, you have:
1. A conversation history with previous questions and answers: {{{conversation_history}}}
2. A list of currently viable motorcycle candidates: {{{current_motorcycle_candidates}}}
3. The user's latest response to your previous question: {{{user_latest_response}}}

Your task is to:
1. Interpret the user's latest response in the context of the conversation history.
2. Filter the current_motorcycle_candidates based on the user's preferences.
3. Determine the next step in the conversation.

If more than one viable motorcycle remains:
- Identify attributes that differentiate the remaining motorcycles (such as type - Commuter/Sport/Cruiser/Adventure, engine displacement, mileage, brand, key features like ABS, etc.).
- Ask a clear, concise question to help differentiate user preference.
- Return status "ASKING_QUESTION" and the "next_question".

If exactly one viable motorcycle remains:
- Provide a personalized recommendation.
- Return status "RECOMMENDATION_MADE", and set "next_question" to null.

If no viable motorcycles remain:
- Provide a helpful error message.
- Return status "NO_MATCH_FOUND", and set "next_question" to null.

Always maintain a conversational, helpful tone. Tailor your questions effectively to narrow down the selection.
`,
});

const recommendMotorcycleConversationalFlow = ai.defineFlow(
  {
    name: 'recommendMotorcycleConversationalFlow',
    inputSchema: MotorcycleRecommendInputSchema,
    outputSchema: MotorcycleRecommendOutputSchema,
  },
  async input => {
    const { output } = await motorcyclePrompt(input); // Use the renamed prompt
    return output!;
  }
);
