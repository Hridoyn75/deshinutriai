export interface UserProfile {
  name: string;
  age: number;
  height: number;
  weight: number;
  healthGoal: string;
  dietaryRestrictions: string;
  activityLevel: string;
  healthConditions: string;
  createdAt: string;
}

export interface FoodSuggestions {
  recommended_foods: string[];
  foods_to_avoid: string[];
  affordable_foods: string[];
  daily_meal_plan: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: string;
  };
  generatedAt: string;
}

export interface CalorieLogItem {
  id: string;
  food_text: string;
  items: { name: string; calories: number }[];
  total_calories: number;
  date: string;
}

