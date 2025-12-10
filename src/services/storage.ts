import { UserProfile, FoodSuggestions, CalorieLogItem } from "@/types";

const KEYS = {
  USER_PROFILE: "userProfile",
  FOOD_SUGGESTIONS: "foodSuggestions",
  CALORIE_LOGS: "calorieLogs",
};

// User Profile
export const getUserProfile = (): UserProfile | null => {
  const data = localStorage.getItem(KEYS.USER_PROFILE);
  return data ? JSON.parse(data) : null;
};

export const saveUserProfile = (profile: UserProfile): void => {
  localStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
};

export const hasCompletedOnboarding = (): boolean => {
  return getUserProfile() !== null;
};

// Food Suggestions
export const getFoodSuggestions = (): FoodSuggestions | null => {
  const data = localStorage.getItem(KEYS.FOOD_SUGGESTIONS);
  return data ? JSON.parse(data) : null;
};

export const saveFoodSuggestions = (suggestions: FoodSuggestions): void => {
  localStorage.setItem(KEYS.FOOD_SUGGESTIONS, JSON.stringify(suggestions));
};

// Calorie Logs
export const getCalorieLogs = (): CalorieLogItem[] => {
  const data = localStorage.getItem(KEYS.CALORIE_LOGS);
  return data ? JSON.parse(data) : [];
};

export const saveCalorieLog = (log: CalorieLogItem): void => {
  const logs = getCalorieLogs();
  logs.push(log);
  localStorage.setItem(KEYS.CALORIE_LOGS, JSON.stringify(logs));
};

export const deleteCalorieLog = (id: string): void => {
  const logs = getCalorieLogs().filter(log => log.id !== id);
  localStorage.setItem(KEYS.CALORIE_LOGS, JSON.stringify(logs));
};

// Analytics helpers
export const getCaloriesForDate = (date: Date): number => {
  const logs = getCalorieLogs();
  const dateStr = date.toISOString().split('T')[0];
  return logs
    .filter(log => log.date.split('T')[0] === dateStr)
    .reduce((sum, log) => sum + log.total_calories, 0);
};

export const getCaloriesForWeek = (): { day: string; calories: number }[] => {
  const result = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    result.push({
      day: dayName,
      calories: getCaloriesForDate(date),
    });
  }
  
  return result;
};

export const getTodayCalories = (): number => {
  return getCaloriesForDate(new Date());
};

// Clear all data
export const clearAllData = (): void => {
  Object.values(KEYS).forEach(key => localStorage.removeItem(key));
};
