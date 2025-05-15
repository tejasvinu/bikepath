
'use server';
/**
 * @fileOverview A motorcycle recommendation AI agent for the Indian market.
 *
 * - recommendMotorcycle - A function that handles the motorcycle recommendation process.
 * - RecommendMotorcycleInput - The input type for the recommendMotorcycle function.
 * - RecommendMotorcycleOutput - The return type for the recommendMotorcycle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendMotorcycleInputSchema = z.object({
  ridingStyle: z
    .string()
    .describe("What is your preferred riding style? Options: 'Commuting (city rides)', 'Touring (long rides)', 'Sport (performance)', 'Cruising (relaxed rides)', 'Off-road (adventure)'. Consider Indian road conditions and typical usage."),
  terrain: z
    .string()
    .describe('What type of terrain will you be riding on primarily in India? Options: City roads (paved), Highways, Rural roads (mixed/poor), Off-road trails.'),
  budget: z
    .number()
    .describe('What is your budget for the motorcycle in Indian Rupees (INR)? E.g., 80000, 150000, 300000.'),
  mileagePreference: z
    .string()
    .describe('How important is fuel efficiency (mileage) to you? Options: Very important, Moderately important, Less important.'),
  distance: z
    .string()
    .describe('What is the typical distance you plan to ride? Options: Short (less than 20 km), Medium (20-100 km), Long (100+ km).'),
  frequency: z
    .string()
    .describe('How often do you plan to ride? Options: Daily, Few times a week, Weekends/Occasionally.'),
  experienceLevel: z
    .string()
    .describe('What is your experience level with riding motorcycles? Options: Beginner, Intermediate, Advanced.'),
  additionalPreferences: z
    .string()
    .describe('Any additional preferences or requirements for the motorcycle (e.g., specific brands like Hero, Bajaj, Royal Enfield, TVS, Honda, Yamaha, Suzuki; features like ABS, digital console; or if it is for a specific purpose like delivery).'),
});
export type RecommendMotorcycleInput = z.infer<typeof RecommendMotorcycleInputSchema>;

const RecommendMotorcycleOutputSchema = z.object({
  brand: z.string().describe('The recommended brand of the motorcycle popular in India.'),
  model: z.string().describe('The recommended model of the motorcycle.'),
  description: z.string().describe('A detailed description of the motorcycle and its features, relevant to the Indian context (e.g., suitability for city traffic, comfort for Indian roads).'),
  price: z.number().describe('The approximate ex-showroom price of the recommended motorcycle in INR.'),
  image: z.string().describe('The URL of an image of the recommended motorcycle. Use a placeholder if a real one is not available.'),
  highlights: z.array(z.string()).describe('A list of the key highlights of the recommended motorcycle (e.g., engine cc, mileage kmpl, key features like ABS, comfort).'),
  suitabilityReason: z.string().describe('A brief explanation of why this motorcycle is suitable for the user based on their Indian context and preferences.'),
});

export type RecommendMotorcycleOutput = z.infer<typeof RecommendMotorcycleOutputSchema>;

export async function recommendMotorcycle(input: RecommendMotorcycleInput): Promise<RecommendMotorcycleOutput> {
  return recommendMotorcycleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendMotorcyclePrompt',
  input: {schema: RecommendMotorcycleInputSchema},
  output: {schema: RecommendMotorcycleOutputSchema},
  prompt: `You are an expert motorcycle recommendation engine specializing in the Indian market. A user will provide their preferences and needs for a motorcycle, and you will recommend the most suitable motorcycle for them. Prioritize models available and popular in India.

  Consider the following information when recommending a motorcycle:

  Riding Style: {{{ridingStyle}}}
  Primary Terrain: {{{terrain}}}
  Budget (INR): {{{budget}}}
  Mileage Preference: {{{mileagePreference}}}
  Typical Riding Distance: {{{distance}}}
  Riding Frequency: {{{frequency}}}
  Experience Level: {{{experienceLevel}}}
  Additional Preferences: {{{additionalPreferences}}}

  Based on the above information, recommend a specific motorcycle brand and model. Provide a detailed description of the motorcycle and its features, emphasizing aspects relevant to Indian riders (e.g., mileage, maintenance, handling in traffic, suitability for Indian road conditions).
  Include the approximate ex-showroom price of the motorcycle in INR.
  Provide a URL for an image of the motorcycle. If a real image URL is not known, use a placeholder like 'https://placehold.co/600x400.png'.
  List key highlights (e.g., engine displacement (cc), claimed mileage (kmpl), safety features like ABS, comfort aspects).
  Include a "suitabilityReason" explaining why this specific motorcycle is a good fit for the user's stated needs and the Indian context.

  Popular brands in India to consider include (but are not limited to): Hero MotoCorp, Bajaj Auto, TVS Motor Company, Royal Enfield, Honda Motorcycle & Scooter India (HMSI), Yamaha Motor India, Suzuki Motorcycle India. Prioritize fuel-efficient models for commuters if mileage is important.

  Return the recommendation in the specified JSON format.
  `,
});

const recommendMotorcycleFlow = ai.defineFlow(
  {
    name: 'recommendMotorcycleFlow',
    inputSchema: RecommendMotorcycleInputSchema,
    outputSchema: RecommendMotorcycleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

