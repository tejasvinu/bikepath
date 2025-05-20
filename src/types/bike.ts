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

export const MotorcycleDataSchema = z.object({
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

export type MotorcycleData = z.infer<typeof MotorcycleDataSchema>;

// Simplified version for card display
export const MotorcycleCardSchema = MotorcycleDataSchema.pick({
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

export type MotorcycleCardType = z.infer<typeof MotorcycleCardSchema>;

// Schema for motorcycle attributes used in the recommendation system
export const MotorcycleAttributesSchema = z.object({
  type: z.string().describe('The type of the motorcycle (e.g., Commuter, Sport, Cruiser, Adventure/Off-road, Scooter)'),
  engineDisplacement: z.string().describe('Engine displacement category (e.g., "100-125cc", "150-200cc", "200-300cc", "300cc+")'),
  mileage: z.string().describe('Fuel efficiency category (e.g., "High", "Medium", "Low", or "40-50 kmpl")'),
  primaryUse: z.string().describe('The primary intended use (e.g., City Commute, Highway Touring, Off-road Adventures, Weekend Rides)'),
  budgetTier: z.string().describe('The budget tier based on Indian market (e.g., Entry (<1 lakh), Mid (1-2 lakhs), Premium (2-3 lakhs), Super Premium (>3 lakhs))'),
  keyFeatures: z.array(z.string()).describe('Notable features (e.g., "ABS", "Digital Console", "LED Headlights", "Pillion Comfort")'),
  brand: z.string().describe('Brand of the motorcycle (e.g., Hero, Bajaj, Royal Enfield, TVS, Honda, Yamaha, Suzuki, KTM, Jawa, Yezdi, Ola Electric, Ather)')
});

// Schema for a motorcycle candidate in the recommendation system
export const MotorcycleCandidateSchema = z.object({
  id: z.string().describe('Unique identifier for the motorcycle (usually _id.$oid from MongoDB)'),
  name: z.string().describe('The name/model of the motorcycle'),
  brand: z.string().describe('The brand of the motorcycle'),
  attributes: MotorcycleAttributesSchema,
  priceNumeric: z.number().describe('Approximate ex-showroom price in INR'),
  imageUrl: z.string().url().optional().describe('URL of an image of the motorcycle')
});

export type MotorcycleAttributes = z.infer<typeof MotorcycleAttributesSchema>;
export type MotorcycleCandidate = z.infer<typeof MotorcycleCandidateSchema>;
