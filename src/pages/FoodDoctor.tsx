import { useState, useEffect } from "react";
import { PageContainer } from "@/components/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingCard } from "@/components/LoadingSpinner";
import {
  getFoodSuggestions,
  saveFoodSuggestions,
  getUserProfile,
  getGeminiSettings,
} from "@/services/storage";
import { generateFoodSuggestions } from "@/services/gemini";
import { FoodSuggestions } from "@/types";
import { toast } from "@/hooks/use-toast";
import {
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Wallet,
  Utensils,
  AlertCircle,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const FoodDoctor = () => {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState<FoodSuggestions | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = getFoodSuggestions();
    if (saved) {
      setSuggestions(saved);
    } else {
      fetchSuggestions();
    }
  }, []);

  const fetchSuggestions = async () => {
    const settings = getGeminiSettings();
    if (!settings?.apiKey) {
      setError("Please set your Gemini API key in settings first");
      return;
    }

    const profile = getUserProfile();
    if (!profile) {
      toast({
        title: "Profile not found",
        description: "Please complete onboarding first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await generateFoodSuggestions(profile);
      saveFoodSuggestions(result);
      setSuggestions(result);
      toast({
        title: "Recommendations updated! 🎉",
        description: "Your personalized food guide is ready",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate suggestions";
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageContainer title="Food Doctor">
        <LoadingCard message="AI is analyzing your profile..." />
      </PageContainer>
    );
  }

  if (error || !suggestions) {
    return (
      <PageContainer title="Food Doctor">
        <Card className="animate-fade-in">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="font-bold text-lg mb-2">Setup Required</h3>
            <p className="text-muted-foreground mb-4">
              {error || "Please set up your Gemini API key to get personalized recommendations"}
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={() => navigate("/settings")}>
                <Settings className="w-4 h-4 mr-2" />
                Go to Settings
              </Button>
              {suggestions === null && getGeminiSettings()?.apiKey && (
                <Button variant="outline" onClick={fetchSuggestions}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate Recommendations
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  const sections = [
    {
      title: "Recommended Foods",
      icon: ThumbsUp,
      items: suggestions.recommended_foods,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Foods to Avoid",
      icon: ThumbsDown,
      items: suggestions.foods_to_avoid,
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
    {
      title: "Budget-Friendly Options",
      icon: Wallet,
      items: suggestions.affordable_foods,
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
  ];

  return (
    <PageContainer title="Food Doctor">
      <div className="space-y-4">
        {/* Meal Plan Card */}
        <Card className="animate-slide-up overflow-hidden">
          <div className="gradient-primary p-4">
            <div className="flex items-center gap-2 text-primary-foreground">
              <Utensils className="w-5 h-5" />
              <h2 className="font-bold text-lg">Today's Meal Plan</h2>
            </div>
          </div>
          <CardContent className="p-4 space-y-4">
            {Object.entries(suggestions.daily_meal_plan).map(([meal, description]) => (
              <div key={meal} className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div>
                  <p className="font-semibold capitalize text-foreground">{meal}</p>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Food Lists */}
        {sections.map((section, index) => (
          <Card
            key={section.title}
            className="animate-slide-up"
            style={{ animationDelay: `${0.1 + index * 0.1}s` }}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <div className={cn("p-2 rounded-xl", section.bg)}>
                  <section.icon className={cn("w-4 h-4", section.color)} />
                </div>
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                {section.items.map((item, i) => (
                  <span
                    key={i}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-medium",
                      section.bg,
                      section.color
                    )}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Regenerate Button */}
        <Button
          variant="outline"
          className="w-full"
          onClick={fetchSuggestions}
          disabled={loading}
        >
          <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
          Regenerate Recommendations
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Last updated: {new Date(suggestions.generatedAt).toLocaleDateString()}
        </p>
      </div>
    </PageContainer>
  );
};

export default FoodDoctor;
