import { useState, useEffect } from "react";
import { PageContainer } from "@/components/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCaloriesForWeek, getCalorieLogs, getTodayCalories } from "@/services/storage";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp, TrendingDown, Minus, Calendar, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

const Analytics = () => {
  const [weekData, setWeekData] = useState<{ day: string; calories: number }[]>([]);
  const [stats, setStats] = useState({
    today: 0,
    weekAvg: 0,
    weekTotal: 0,
    trend: 0,
  });

  useEffect(() => {
    const data = getCaloriesForWeek();
    setWeekData(data);

    const today = getTodayCalories();
    const weekTotal = data.reduce((sum, d) => sum + d.calories, 0);
    const weekAvg = Math.round(weekTotal / 7);

    // Calculate trend (compare last 3 days avg to first 3 days avg)
    const first3 = data.slice(0, 3).reduce((s, d) => s + d.calories, 0) / 3;
    const last3 = data.slice(-3).reduce((s, d) => s + d.calories, 0) / 3;
    const trend = first3 > 0 ? Math.round(((last3 - first3) / first3) * 100) : 0;

    setStats({ today, weekAvg, weekTotal, trend });
  }, []);

  const statCards = [
    {
      title: "Today",
      value: stats.today,
      suffix: "cal",
      icon: Flame,
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
    {
      title: "Weekly Avg",
      value: stats.weekAvg,
      suffix: "cal/day",
      icon: Calendar,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Week Total",
      value: stats.weekTotal,
      suffix: "cal",
      icon: TrendingUp,
      color: "text-accent-foreground",
      bg: "bg-accent",
    },
  ];

  const getTrendIcon = () => {
    if (stats.trend > 5) return TrendingUp;
    if (stats.trend < -5) return TrendingDown;
    return Minus;
  };

  const TrendIcon = getTrendIcon();

  return (
    <PageContainer title="Analytics">
      <div className="space-y-4">
        {/* Stat Cards */}
        <div className="grid grid-cols-3 gap-3">
          {statCards.map((stat, index) => (
            <Card
              key={stat.title}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-3 text-center">
                <div className={cn("w-10 h-10 mx-auto mb-2 rounded-xl flex items-center justify-center", stat.bg)}>
                  <stat.icon className={cn("w-5 h-5", stat.color)} />
                </div>
                <p className="text-lg font-bold text-foreground">
                  {stat.value.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">{stat.suffix}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trend Card */}
        <Card className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Weekly Trend</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.trend > 0 ? "+" : ""}
                  {stats.trend}%
                </p>
              </div>
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  stats.trend > 5
                    ? "bg-destructive/10"
                    : stats.trend < -5
                    ? "bg-primary/10"
                    : "bg-muted"
                )}
              >
                <TrendIcon
                  className={cn(
                    "w-6 h-6",
                    stats.trend > 5
                      ? "text-destructive"
                      : stats.trend < -5
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.trend > 5
                ? "Calorie intake increasing"
                : stats.trend < -5
                ? "Calorie intake decreasing"
                : "Calorie intake stable"}
            </p>
          </CardContent>
        </Card>

        {/* Chart */}
        <Card className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Last 7 Days</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => [`${value} cal`, "Calories"]}
                  />
                  <Bar
                    dataKey="calories"
                    fill="hsl(var(--primary))"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="animate-slide-up border-primary/20" style={{ animationDelay: "0.5s" }}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              💡 <span className="font-medium text-foreground">Tip:</span> Most adults need between
              1,600-2,400 calories per day, depending on activity level and goals.
            </p>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Analytics;
