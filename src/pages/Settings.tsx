import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageContainer } from "@/components/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getGeminiSettings,
  saveGeminiSettings,
  getUserProfile,
  clearAllData,
} from "@/services/storage";
import { toast } from "@/hooks/use-toast";
import { Key, User, Trash2, ExternalLink, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const Settings = () => {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState("");
  const [hasKey, setHasKey] = useState(false);
  const profile = getUserProfile();

  useEffect(() => {
    const settings = getGeminiSettings();
    if (settings?.apiKey) {
      setApiKey(settings.apiKey);
      setHasKey(true);
    }
  }, []);

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key",
        variant: "destructive",
      });
      return;
    }

    saveGeminiSettings({ apiKey: apiKey.trim() });
    setHasKey(true);
    toast({
      title: "API Key Saved! ✓",
      description: "You can now use AI-powered features",
    });
  };

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
        {/* API Key Section */}
        <Card className="animate-slide-up">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="p-2 rounded-xl bg-primary/10">
                <Key className="w-4 h-4 text-primary" />
              </div>
              Gemini API Key
              {hasKey && (
                <CheckCircle className="w-4 h-4 text-primary ml-auto" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <Input
              type="password"
              placeholder="Enter your API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <Button onClick={handleSaveApiKey} className="w-full">
              Save API Key
            </Button>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-sm text-primary hover:underline"
            >
              Get your free API key
              <ExternalLink className="w-3 h-3" />
            </a>
          </CardContent>
        </Card>

        {/* Profile Section */}
        {profile && (
          <Card className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
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
        <Card className="animate-slide-up border-destructive/30" style={{ animationDelay: "0.2s" }}>
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
        <Card className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
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
