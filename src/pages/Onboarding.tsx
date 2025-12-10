import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { saveUserProfile } from "@/services/storage";
import { UserProfile } from "@/types";
import { ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { title: "Let's get to know you", subtitle: "What's your name?" },
  { title: "Basic info", subtitle: "Age, height & weight" },
  { title: "Your health goal", subtitle: "What are you aiming for?" },
  { title: "Almost there!", subtitle: "A few more details" },
];

const healthGoals = [
  { value: "lose_weight", label: "🎯 Lose Weight", color: "bg-secondary/20" },
  { value: "gain_muscle", label: "💪 Gain Muscle", color: "bg-primary/20" },
  { value: "maintain", label: "⚖️ Maintain Weight", color: "bg-accent" },
  { value: "eat_healthy", label: "🥗 Eat Healthier", color: "bg-primary/10" },
];

const activityLevels = [
  { value: "sedentary", label: "🛋️ Sedentary" },
  { value: "light", label: "🚶 Light Activity" },
  { value: "moderate", label: "🏃 Moderate" },
  { value: "active", label: "🏋️ Very Active" },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    height: "",
    weight: "",
    healthGoal: "",
    dietaryRestrictions: "",
    activityLevel: "",
    healthConditions: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return formData.name.trim().length >= 2;
      case 1:
        return formData.age && formData.height && formData.weight;
      case 2:
        return formData.healthGoal;
      case 3:
        return formData.activityLevel;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      const profile: UserProfile = {
        name: formData.name,
        age: parseInt(formData.age),
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        healthGoal: formData.healthGoal,
        dietaryRestrictions: formData.dietaryRestrictions,
        activityLevel: formData.activityLevel,
        healthConditions: formData.healthConditions,
        createdAt: new Date().toISOString(),
      };
      saveUserProfile(profile);
      navigate("/home");
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex gap-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-all duration-500",
                  i <= step ? "gradient-primary" : "bg-muted"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-md mx-auto px-4 pt-20 pb-8 flex flex-col">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {steps[step].title}
          </h1>
          <p className="text-lg text-muted-foreground">{steps[step].subtitle}</p>
        </div>

        {/* Content */}
        <div className="flex-1 animate-slide-up">
          {step === 0 && (
            <div className="space-y-6">
              <Input
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="text-lg h-14"
                autoFocus
              />
              <div className="flex items-center gap-3 p-4 bg-accent rounded-2xl">
                <Sparkles className="w-6 h-6 text-primary" />
                <p className="text-sm text-foreground">
                  We'll personalize your nutrition journey just for you!
                </p>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Age
                </label>
                <Input
                  type="number"
                  placeholder="e.g., 25"
                  value={formData.age}
                  onChange={(e) => updateField("age", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Height (cm)
                </label>
                <Input
                  type="number"
                  placeholder="e.g., 170"
                  value={formData.height}
                  onChange={(e) => updateField("height", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Weight (kg)
                </label>
                <Input
                  type="number"
                  placeholder="e.g., 70"
                  value={formData.weight}
                  onChange={(e) => updateField("weight", e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-2 gap-3">
              {healthGoals.map((goal) => (
                <Card
                  key={goal.value}
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:shadow-elevated",
                    formData.healthGoal === goal.value
                      ? "ring-2 ring-primary shadow-glow-primary"
                      : "hover:border-primary/50"
                  )}
                  onClick={() => updateField("healthGoal", goal.value)}
                >
                  <CardContent className="p-4 text-center">
                    <span className="text-2xl block mb-2">
                      {goal.label.split(" ")[0]}
                    </span>
                    <span className="font-semibold text-sm">
                      {goal.label.split(" ").slice(1).join(" ")}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Activity Level
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {activityLevels.map((level) => (
                    <Card
                      key={level.value}
                      className={cn(
                        "cursor-pointer transition-all duration-200",
                        formData.activityLevel === level.value
                          ? "ring-2 ring-primary shadow-glow-primary"
                          : "hover:border-primary/50"
                      )}
                      onClick={() => updateField("activityLevel", level.value)}
                    >
                      <CardContent className="p-3 text-center">
                        <span className="font-medium text-sm">{level.label}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Dietary Restrictions (optional)
                </label>
                <Input
                  placeholder="e.g., Vegetarian, Gluten-free"
                  value={formData.dietaryRestrictions}
                  onChange={(e) =>
                    updateField("dietaryRestrictions", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Health Conditions (optional)
                </label>
                <Input
                  placeholder="e.g., Diabetes, High blood pressure"
                  value={formData.healthConditions}
                  onChange={(e) =>
                    updateField("healthConditions", e.target.value)
                  }
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <Button variant="outline" size="lg" onClick={handleBack}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
          )}
          <Button
            className="flex-1"
            size="lg"
            onClick={handleNext}
            disabled={!canProceed()}
          >
            {step === steps.length - 1 ? "Get Started" : "Continue"}
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Onboarding;
