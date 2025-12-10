import { UserProfile, FoodSuggestions } from "@/types";
import { getGeminiSettings } from "./storage";

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const callGemini = async (prompt: string): Promise<string> => {
  const settings = getGeminiSettings();
  
  if (!settings?.apiKey) {
    throw new Error("Please set your Gemini API key in settings");
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${settings.apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Failed to call Gemini API");
  }

  const data = await response.json();
  return data.candidates[0]?.content?.parts[0]?.text || "";
};

const extractJSON = (text: string): string => {
  // Try to find JSON in the response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return jsonMatch[0];
  }
  return text;
};

export const generateFoodSuggestions = async (profile: UserProfile): Promise<FoodSuggestions> => {
  const prompt = `You are a professional nutritionist and food expert. Based on the user information below, provide personalized food recommendations.

User Information:
- Name: ${profile.name}
- Age: ${profile.age} years old
- Height: ${profile.height} cm
- Weight: ${profile.weight} kg
- Health Goal: ${profile.healthGoal}
- Dietary Restrictions: ${profile.dietaryRestrictions || "None"}
- Activity Level: ${profile.activityLevel}
- Health Conditions: ${profile.healthConditions || "None"}

Please respond with ONLY a valid JSON object (no markdown, no explanation) in this exact format:
{
  "recommended_foods": ["food1", "food2", "food3", "food4", "food5"],
  "foods_to_avoid": ["food1", "food2", "food3", "food4"],
  "affordable_foods": ["affordable food1", "affordable food2", "affordable food3", "affordable food4"],
  "daily_meal_plan": {
    "breakfast": "Detailed breakfast suggestion",
    "lunch": "Detailed lunch suggestion",
    "dinner": "Detailed dinner suggestion",
    "snacks": "Healthy snack suggestions"
  }
}`;

  const response = await callGemini(prompt);
  const jsonStr = extractJSON(response);
  
  try {
    const parsed = JSON.parse(jsonStr);
    return {
      ...parsed,
      generatedAt: new Date().toISOString(),
    };
  } catch {
    throw new Error("Failed to parse food suggestions. Please try again.");
  }
};

export const estimateCalories = async (foodText: string): Promise<{ items: { name: string; calories: number }[]; total_calories: number }> => {
  const prompt = `You are a nutrition expert. Estimate the calories for the following food items the user ate.

User input: "${foodText}"

Respond with ONLY a valid JSON object (no markdown, no explanation) in this exact format:
{
  "items": [
    {"name": "food item 1", "calories": 150},
    {"name": "food item 2", "calories": 200}
  ],
  "total_calories": 350
}

Be reasonable with portion sizes. If no portion is specified, assume a typical serving size.`;

  const response = await callGemini(prompt);
  const jsonStr = extractJSON(response);
  
  try {
    return JSON.parse(jsonStr);
  } catch {
    throw new Error("Failed to estimate calories. Please try again.");
  }
};
