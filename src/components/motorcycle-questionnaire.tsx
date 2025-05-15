
"use client";

import type { Control } from "react-hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { RecommendMotorcycleInput } from "@/ai/flows/recommend-motorcycle";
import { Loader2 } from "lucide-react";

const ridingStyleOptions = ['Commuting (city rides)', 'Touring (long rides)', 'Sport (performance)', 'Cruising (relaxed rides)', 'Off-road (adventure)'] as const;
const terrainOptions = ['City roads (paved)', 'Highways', 'Rural roads (mixed/poor)', 'Off-road trails'] as const;
const mileagePreferenceOptions = ['Very important', 'Moderately important', 'Less important'] as const;
const distanceOptions = ['Short (less than 20 km)', 'Medium (20-100 km)', 'Long (100+ km)'] as const;
const frequencyOptions = ['Daily', 'Few times a week', 'Weekends/Occasionally'] as const;
const experienceLevelOptions = ['Beginner', 'Intermediate', 'Advanced'] as const;

const formSchema = z.object({
  ridingStyle: z.enum(ridingStyleOptions, {
    required_error: "Please select your riding style.",
  }),
  terrain: z.enum(terrainOptions, {
    required_error: "Please select the primary terrain.",
  }),
  budget: z.coerce.number({ invalid_type_error: "Budget must be a number."}).positive({ message: "Budget must be a positive number." }),
  mileagePreference: z.enum(mileagePreferenceOptions, {
    required_error: "Please select your mileage preference.",
  }),
  distance: z.enum(distanceOptions, {
    required_error: "Please select your typical riding distance.",
  }),
  frequency: z.enum(frequencyOptions, {
    required_error: "Please select how often you plan to ride.",
  }),
  experienceLevel: z.enum(experienceLevelOptions, {
    required_error: "Please select your experience level.",
  }),
  additionalPreferences: z.string().optional(),
});

type MotorcycleQuestionnaireFormValues = z.infer<typeof formSchema>;

interface MotorcycleQuestionnaireProps {
  onSubmit: (data: RecommendMotorcycleInput) => Promise<void>;
  isLoading: boolean;
}

export function MotorcycleQuestionnaire({ onSubmit, isLoading }: MotorcycleQuestionnaireProps) {
  const form = useForm<MotorcycleQuestionnaireFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ridingStyle: undefined,
      terrain: undefined,
      budget: 80000, // Adjusted for INR
      mileagePreference: 'Moderately important',
      distance: undefined,
      frequency: undefined,
      experienceLevel: undefined,
      additionalPreferences: "",
    },
  });

  const handleSubmit = (values: MotorcycleQuestionnaireFormValues) => {
    const dataToSubmit: RecommendMotorcycleInput = {
      ...values,
      budget: Number(values.budget),
    };
    onSubmit(dataToSubmit);
  };
  
  const control = form.control as unknown as Control<RecommendMotorcycleInput>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={control}
          name="ridingStyle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Riding Style</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your riding style" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ridingStyleOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="terrain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Terrain (India)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select terrain type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {terrainOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget (INR)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 120000" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} />
              </FormControl>
              <FormDescription>
                Enter your approximate budget for the motorcycle in Indian Rupees.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="mileagePreference"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fuel Efficiency (Mileage) Importance</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select mileage importance" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {mileagePreferenceOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="distance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Typical Riding Distance</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select distance" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {distanceOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="frequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Riding Frequency</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {frequencyOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="experienceLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Motorcycle Riding Experience Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {experienceLevelOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="additionalPreferences"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Preferences</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., specific brands (Hero, Bajaj, TVS, Royal Enfield), features (ABS, disc brakes, LED lights), preferred color, primary use (e.g. long tours, city commute)."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Optional: Tell us anything else for your motorcycle search in India.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Finding Your Motorcycle...
            </>
          ) : (
            "Get Motorcycle Recommendation"
          )}
        </Button>
      </form>
    </Form>
  );
}
