import { z } from 'zod';

const DetailedSpecificationsSchema = z.object({
  "Engine and Transmission": z.record(z.string()).optional(),
  "Features": z.record(z.string()).optional(),
  "Features and Safety": z.record(z.string()).optional(),
  "Chassis and Suspension": z.record(z.string()).optional(),
  "Dimensions and Capacity": z.record(z.string()).optional(),
  "Electricals": z.record(z.string()).optional(),
  "Performance": z.record(z.string()).optional(),
  "Motor & Battery": z.record(z.string()).optional(),
  "Range": z.record(z.string()).optional(),
  "Charging": z.record(z.string()).optional(),
  "Underpinnings": z.record(z.string()).optional(),
  "What’s Included": z.record(z.string()).optional(),
  "App Features": z.record(z.string()).optional(),
}).catchall(z.record(z.string())); // Allows other keys with string record values

export const BikeSchema = z.object({
  _id: z.object({ $oid: z.string() }),
  source_file: z.string().optional(),
  page_url: z.string().url().optional(),
  image_url: z.string().url().optional(),
  name: z.string(),
  brand: z.string(),
  price_display: z.string(),
  price_numeric: z.number(),
  emi_display: z.string().optional(),
  rating_value: z.number().optional(),
  review_count: z.number().optional(),
  reviews_link: z.string().url().optional(),
  detailed_specifications: DetailedSpecificationsSchema.optional(),
});

export type Bike = z.infer<typeof BikeSchema>;

// Simplified version for card display
export const BikeCardSchema = BikeSchema.pick({
  _id: true,
  image_url: true,
  name: true,
  brand: true,
  price_display: true,
  price_numeric: true,
  rating_value: true,
  review_count: true,
  page_url: true, // for linking to details page or external
});

export type BikeCardType = z.infer<typeof BikeCardSchema>;

// Schema for bike attributes used in the recommendation system
export const BikeAttributesSchema = z.object({
  type: z.string().describe('The type of the bike (e.g., Hybrid, Commuter, Mountain, Road)'),
  terrain: z.array(z.string()).describe('The types of terrain this bike is suitable for'),
  primary_use: z.string().describe('The primary intended use of the bike (e.g., Commuting, Recreation, Exercise)'),
  suspension: z.string().describe('The type of suspension, if any (e.g., None, Front Fork, Full)'),
  gears: z.string().describe('Description of the gear system'),
  budget_tier: z.string().describe('The budget tier (e.g., Entry, Mid, Premium)'),
  frame_material: z.string().describe('The material the frame is made of (e.g., Aluminum, Steel, Carbon Fiber)')
});

// Schema for a bike candidate in the recommendation system
export const BikeCandidateSchema = z.object({
  id: z.string().describe('Unique identifier for the bike'),
  name: z.string().describe('The name/model of the bike'),
  attributes: BikeAttributesSchema
});

export type BikeAttributes = z.infer<typeof BikeAttributesSchema>;
export type BikeCandidate = z.infer<typeof BikeCandidateSchema>;
