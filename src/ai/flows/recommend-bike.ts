// This file is machine-generated - edit with care!

'use server';
/**
 * @fileOverview A bike recommendation AI agent.
 *
 * - recommendBike - A function that handles the bike recommendation process.
 * - RecommendBikeInput - The input type for the recommendBike function.
 * - RecommendBikeOutput - The return type for the recommendBike function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendBikeInputSchema = z.object({
  ridingStyle: z
    .string()
    .describe("What is your preferred riding style? Options: 'Road cycling', 'Mountain biking', 'Commuting', 'Touring'."),
  terrain: z
    .string()
    .describe('What type of terrain will you be riding on? Options: Pavement, Gravel, Trails, Mixed.'),
  budget: z
    .number()
    .describe('What is your budget for the bicycle in USD?'),
  distance: z
    .string()
    .describe('What is the typical distance you plan to ride? Options: Short (less than 10 miles), Medium (10-30 miles), Long (30+ miles).'),
  frequency: z
    .string()
    .describe('How often do you plan to ride? Options: Few times a month, Few times a week, Daily.'),
  experienceLevel: z
    .string()
    .describe('What is your experience level with cycling? Options: Beginner, Intermediate, Advanced.'),
  additionalPreferences: z
    .string()
    .describe('Any additional preferences or requirements for the bicycle.'),
});
export type RecommendBikeInput = z.infer<typeof RecommendBikeInputSchema>;

const RecommendBikeOutputSchema = z.object({
  brand: z.string().describe('The recommended brand of the bicycle.'),
  model: z.string().describe('The recommended model of the bicycle.'),
  description: z.string().describe('A detailed description of the bicycle and its features.'),
  price: z.number().describe('The price of the recommended bicycle in USD.'),
  image: z.string().describe('The URL of an image of the recommended bicycle.'),
  highlights: z.array(z.string()).describe('A list of the key highlights of the recommended bicycle.'),
});

export type RecommendBikeOutput = z.infer<typeof RecommendBikeOutputSchema>;

export async function recommendBike(input: RecommendBikeInput): Promise<RecommendBikeOutput> {
  return recommendBikeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendBikePrompt',
  input: {schema: RecommendBikeInputSchema},
  output: {schema: RecommendBikeOutputSchema},
  prompt: `You are an expert bicycle recommendation engine. A user will provide their preferences and needs for a bicycle, and you will recommend the most suitable bicycle for them from the database.

  Consider the following information when recommending a bicycle:

  Riding Style: {{{ridingStyle}}}
  Terrain: {{{terrain}}}
  Budget: {{{budget}}}
  Distance: {{{distance}}}
  Frequency: {{{frequency}}}
  Experience Level: {{{experienceLevel}}}
  Additional Preferences: {{{additionalPreferences}}}

  Based on the above information, recommend a specific bicycle brand and model, and provide a detailed description of the bicycle and its features. Include the price of the bicycle, the URL of an image of the bicycle, and a list of the key highlights of the bicycle.

  Ensure that the recommended bicycle is within the user's budget and suitable for their riding style, terrain, distance, frequency, and experience level.

  Return the recommendation in the following JSON format:
  {{$type: RecommendBikeOutput}}
  `,
});

const recommendBikeFlow = ai.defineFlow(
  {
    name: 'recommendBikeFlow',
    inputSchema: RecommendBikeInputSchema,
    outputSchema: RecommendBikeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
