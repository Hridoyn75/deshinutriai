import { useNavigate } from "react-router-dom";
import { PageContainer } from "@/components/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  getUserProfile,
  clearAllData,
} from "@/services/storage";
import { toast } from "@/hooks/use-toast";
import { User, Trash2 } from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();
  const profile = getUserProfile();

  const handleClearData = () => {
    if (confirm("Are you sure you want to delete all data? This cannot be undone.")) {
      clearAllData();
      toast({
        title: "Data Cleared",
        description: "All your data has been deleted",
      });
      navigate("/");
    }
  };

  return (
    <PageContainer title="Settings">
      <div className="space-y-4">
        {/* Profile Section */}
        {profile && (
          <Card className="animate-slide-up">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="p-2 rounded-xl bg-accent">
                  <User className="w-4 h-4 text-accent-foreground" />
                </div>
                Your Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium">{profile.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Age</span>
                  <span className="font-medium">{profile.age} years</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Height</span>
                  <span className="font-medium">{profile.height} cm</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Weight</span>
                  <span className="font-medium">{profile.weight} kg</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Goal</span>
                  <span className="font-medium capitalize">
                    {profile.healthGoal.replace("_", " ")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Danger Zone */}
        <Card className="animate-slide-up border-destructive/30" style={{ animationDelay: "0.1s" }}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-destructive">
              <div className="p-2 rounded-xl bg-destructive/10">
                <Trash2 className="w-4 h-4 text-destructive" />
              </div>
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-3">
              This will permanently delete all your data including profile, food suggestions, and calorie logs.
            </p>
            <Button variant="destructive" onClick={handleClearData} className="w-full">
              Delete All Data
            </Button>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">
              NutriTrack v1.0
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Your personal nutrition companion
            </p>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Settings;
