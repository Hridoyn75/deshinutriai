import { useNavigate } from "react-router-dom";
import { PageContainer } from "@/components/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { getUserProfile, getTodayCalories } from "@/services/storage";
import { Apple, Flame, TrendingUp, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const Home = () => {
  const navigate = useNavigate();
  const profile = getUserProfile();
  const todayCalories = getTodayCalories();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const mainCards = [
    {
      title: "Food Doctor",
      subtitle: "Get personalized food recommendations",
      icon: Apple,
      path: "/food-doctor",
      gradient: "gradient-primary",
      glow: "shadow-glow-primary",
      emoji: "🍏",
    },
    {
      title: "Calorie Tracker",
      subtitle: "Track your daily food intake",
      icon: Flame,
      path: "/calorie-tracker",
      gradient: "gradient-secondary",
      glow: "shadow-glow-secondary",
      emoji: "🔥",
    },
  ];

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <p className="text-muted-foreground font-medium">{getGreeting()},</p>
        <h1 className="text-3xl font-bold text-foreground">
          {profile?.name || "Friend"} 👋
        </h1>
      </div>

      {/* Today's Summary */}
      <Card className="mb-6 animate-slide-up overflow-hidden">
        <div className="gradient-primary p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-foreground/80 text-sm font-medium">
                Today's Calories
              </p>
              <p className="text-4xl font-bold text-primary-foreground">
                {todayCalories.toLocaleString()}
              </p>
              <p className="text-primary-foreground/70 text-sm">kcal consumed</p>
            </div>
            <div className="w-20 h-20 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <TrendingUp className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Tip */}
      <Card className="mb-6 animate-slide-up border-primary/20 bg-accent/50" style={{ animationDelay: "0.1s" }}>
        <CardContent className="p-4 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground">Quick Tip</p>
            <p className="text-sm text-muted-foreground">
              Drink a glass of water before each meal to help with portion control!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Main Action Cards */}
      <div className="space-y-4">
        {mainCards.map((card, index) => (
          <Card
            key={card.path}
            className={cn(
              "cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-elevated active:scale-[0.98] animate-slide-up",
              card.glow
            )}
            style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            onClick={() => navigate(card.path)}
          >
            <CardContent className="p-0">
              <div className={cn("p-6", card.gradient)}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-3xl">{card.emoji}</span>
                      <h2 className="text-xl font-bold text-primary-foreground">
                        {card.title}
                      </h2>
                    </div>
                    <p className="text-primary-foreground/80 text-sm">
                      {card.subtitle}
                    </p>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
                    <card.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
};

export default Home;
