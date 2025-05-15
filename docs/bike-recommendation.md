# Bike Recommendation AI Flow

This document outlines the implementation of the conversational bike recommender system.

## Overview

The system provides a conversational interface for users to find the perfect bicycle based on their needs and preferences. It uses an AI flow that guides users through a series of questions, iteratively narrows down bike options, and finally makes a personalized recommendation.

## Components

1. **AI Flow (`recommend-bike.ts`)**:
   - Defines the core recommendation logic
   - Processes user input to filter bike candidates
   - Determines the next question or provides a final recommendation

2. **Types and Schemas**:
   - `BikeRecommendInput` - Input structure for the recommendation flow
   - `BikeRecommendOutput` - Output structure from the recommendation flow
   - `ConversationTurn` - Represents a Q&A pair in the conversation
   - `BikeCandidate` - Structure for a bike with its attributes

3. **UI Components**:
   - `BikeQuestionnaire` - Renders the conversation interface
   - `BikeRecommendation` - Displays the final recommendation

4. **Custom Hook**:
   - `useBikeRecommendation` - Manages the state and logic for the recommendation process

## Flow Logic

1. **State Management**:
   - Conversation history is maintained as an array of question-answer pairs
   - The current set of viable bike candidates is filtered after each user response
   - Questions are dynamically chosen based on what attributes would best narrow down the options

2. **Decision Making Logic**:
   - If multiple bikes remain: Ask a question about a distinguishing attribute
   - If exactly one bike remains: Provide a personalized recommendation
   - If no bikes remain: Inform the user that no matches were found

3. **Response Structure**:
   - `status`: Indicates if we're asking a question, making a recommendation, or have no matches
   - `next_question`: The next question to ask (if applicable)
   - `updated_bike_candidates_ids`: IDs of bikes that are still viable
   - `final_recommendation`: Details about the recommended bike (if applicable)
   - `error_message`: Any error or informational message

## Sample Interaction

1. AI: "What type of terrain will you primarily ride on?"
2. User: "Mostly paved roads with some light gravel"
3. AI analyzes and filters bikes suitable for paved/light gravel
4. AI: "Are you looking for a bike primarily for commuting or exercise?"
5. User: "Commuting to work"
6. AI further filters bikes for commuting use
7. AI: "How important is having multiple gears versus a simpler single-speed setup?"
8. User: "I prefer having some gears for hills"
9. AI: "Based on your preferences, the City Commuter is the perfect bike for you..." (provides recommendation)

## Implementation Notes

- The recommendation flow is stateless between calls - all state is maintained by the client
- Sample bike data is included for demonstration but should be replaced with a database in production
- The AI flow uses the Genkit framework with Google AI as the provider
