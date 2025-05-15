
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
import type { RecommendBikeInput } from "@/ai/flows/recommend-bike";
import { Loader2 } from "lucide-react";

const ridingStyleOptions = ['Road cycling', 'Mountain biking', 'Commuting', 'Touring'] as const;
const terrainOptions = ['Pavement', 'Gravel', 'Trails', 'Mixed'] as const;
const distanceOptions = ['Short (less than 10 miles)', 'Medium (10-30 miles)', 'Long (30+ miles)'] as const;
const frequencyOptions = ['Few times a month', 'Few times a week', 'Daily'] as const;
const experienceLevelOptions = ['Beginner', 'Intermediate', 'Advanced'] as const;

const formSchema = z.object({
  ridingStyle: z.enum(ridingStyleOptions, {
    required_error: "Please select your riding style.",
  }),
  terrain: z.enum(terrainOptions, {
    required_error: "Please select the terrain.",
  }),
  budget: z.coerce.number({ invalid_type_error: "Budget must be a number."}).positive({ message: "Budget must be a positive number." }),
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

type BikeQuestionnaireFormValues = z.infer<typeof formSchema>;

interface BikeQuestionnaireProps {
  onSubmit: (data: RecommendBikeInput) => Promise<void>;
  isLoading: boolean;
}

export function BikeQuestionnaire({ onSubmit, isLoading }: BikeQuestionnaireProps) {
  const form = useForm<BikeQuestionnaireFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ridingStyle: undefined,
      terrain: undefined,
      budget: 1000,
      distance: undefined,
      frequency: undefined,
      experienceLevel: undefined,
      additionalPreferences: "",
    },
  });

  const handleSubmit = (values: BikeQuestionnaireFormValues) => {
    // Ensure budget is a number, react-hook-form might pass it as string initially from number input
    const dataToSubmit: RecommendBikeInput = {
      ...values,
      budget: Number(values.budget),
    };
    onSubmit(dataToSubmit);
  };
  
  // Type assertion for control due to potential complexity with generic types in FormField
  const control = form.control as unknown as Control<RecommendBikeInput>;


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
              <FormLabel>Typical Terrain</FormLabel>
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
              <FormLabel>Budget (USD)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 1500" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} />
              </FormControl>
              <FormDescription>
                Enter your approximate budget for the bicycle.
              </FormDescription>
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
              <FormLabel>Cycling Experience Level</FormLabel>
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
                  placeholder="Any other specific needs or features (e.g., color, accessories, specific brands to avoid)"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Optional: Tell us anything else that might help narrow down the search.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Finding Your Bike...
            </>
          ) : (
            "Get Recommendation"
          )}
        </Button>
      </form>
    </Form>
  );
}
