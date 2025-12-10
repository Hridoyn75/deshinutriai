import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { hasCompletedOnboarding } from "@/services/storage";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has completed onboarding
    if (hasCompletedOnboarding()) {
      navigate("/home", { replace: true });
    } else {
      navigate("/onboarding", { replace: true });
    }
  }, [navigate]);

  // Show nothing while redirecting
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default Index;
