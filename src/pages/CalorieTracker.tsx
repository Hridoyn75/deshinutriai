import { useState, useEffect } from "react";
import { PageContainer } from "@/components/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
  getCalorieLogs,
  saveCalorieLog,
  deleteCalorieLog,
  getTodayCalories,
} from "@/services/storage";
import { estimateCalories } from "@/services/gemini";
import { CalorieLogItem } from "@/types";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Flame, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const CalorieTracker = () => {
  const [foodInput, setFoodInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<CalorieLogItem[]>([]);
  const [todayTotal, setTodayTotal] = useState(0);

  useEffect(() => {
    refreshLogs();
  }, []);

  const refreshLogs = () => {
    const allLogs = getCalorieLogs();
    const today = new Date().toISOString().split("T")[0];
    const todayLogs = allLogs
      .filter((log) => log.date.split("T")[0] === today)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setLogs(todayLogs);
    setTodayTotal(getTodayCalories());
  };

  const handleAddFood = async () => {
    if (!foodInput.trim()) {
      toast({
        title: "Please enter food",
        description: "Type what you ate to track calories",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await estimateCalories(foodInput);
      const logItem: CalorieLogItem = {
        id: crypto.randomUUID(),
        food_text: foodInput,
        items: result.items,
        total_calories: result.total_calories,
        date: new Date().toISOString(),
      };
      saveCalorieLog(logItem);
      setFoodInput("");
      refreshLogs();
      toast({
        title: "Food logged! 🎉",
        description: `Added ${result.total_calories} calories`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to estimate calories";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    deleteCalorieLog(id);
    refreshLogs();
    toast({
      title: "Entry deleted",
      description: "Food log has been removed",
    });
  };

  return (
    <PageContainer title="Calorie Tracker">
      <div className="space-y-4">
        {/* Today's Total */}
        <Card className="animate-slide-up overflow-hidden">
          <div className="gradient-secondary p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-foreground/80 text-sm font-medium">
                  Today's Total
                </p>
                <p className="text-4xl font-bold text-secondary-foreground">
                  {todayTotal.toLocaleString()}
                </p>
                <p className="text-secondary-foreground/70 text-sm">calories</p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-secondary-foreground/20 flex items-center justify-center">
                <Flame className="w-8 h-8 text-secondary-foreground" />
              </div>
            </div>
          </div>
        </Card>

        {/* Input Section */}
        <Card className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Input
                placeholder="e.g., 2 eggs and toast with butter"
                value={foodInput}
                onChange={(e) => setFoodInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddFood()}
                disabled={loading}
              />
              <Button onClick={handleAddFood} disabled={loading} size="icon">
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Describe your food naturally — AI will estimate the calories
            </p>
          </CardContent>
        </Card>

        {/* Food Logs */}
        <div className="space-y-3">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            Today's Food Log
          </h2>

          {logs.length === 0 ? (
            <Card className="animate-fade-in">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  No food logged yet today. Start tracking above!
                </p>
              </CardContent>
            </Card>
          ) : (
            logs.map((log, index) => (
              <Card
                key={log.id}
                className="animate-slide-up"
                style={{ animationDelay: `${0.2 + index * 0.05}s` }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {log.food_text}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {log.items.map((item, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
                          >
                            {item.name}: {item.calories} cal
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(log.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="font-bold text-secondary text-lg">
                          {log.total_calories}
                        </p>
                        <p className="text-xs text-muted-foreground">cal</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(log.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default CalorieTracker;
