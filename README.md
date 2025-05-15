# BikePath - Motorcycle and Bicycle Recommendation Platform

BikePath is a Next.js application that provides AI-powered recommendation systems for both motorcycles and bicycles.

## Features

### 1. Motorcycle Recommendation
- Complete a questionnaire about your preferences and riding style
- AI analyzes your inputs and suggests the perfect motorcycle for your needs
- Focus on the Indian motorcycle market with region-specific recommendations

### 2. Conversational Bike Recommendation
- Engage in a natural language conversation about your cycling needs
- AI asks targeted questions to understand your preferences
- Dynamic filtering narrows down options based on your responses
- Personalized bike recommendations with detailed explanations

## Technical Stack

- **Framework**: Next.js with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **AI Integration**: Google AI (Gemini) via Genkit
- **Database**: MongoDB (for bike/motorcycle data)

## Implementation Details

- The motorcycle recommender uses a form-based approach
- The bicycle recommender uses a conversational AI flow
- Both systems leverage AI to match user preferences with ideal options
- See `/docs/bike-recommendation.md` for detailed information on the conversational recommender

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Run the development server with `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Pages

- Home: Motorcycle recommendation (`/`)
- Bikes List: Browse all motorcycles (`/bikes`)
- Bike Recommendation: Find your perfect bicycle (`/bikes/recommend`)
