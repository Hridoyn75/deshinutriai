import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: ReactNode;
  title?: string;
  showNav?: boolean;
  className?: string;
}

export const PageContainer = ({ 
  children, 
  title, 
  showNav = true,
  className 
}: PageContainerProps) => {
  return (
    <div className="min-h-screen bg-background">
      <main className={cn(
        "max-w-md mx-auto px-4 pt-6 pb-28 min-h-screen",
        className
      )}>
        {title && (
          <h1 className="text-2xl font-bold text-foreground mb-6 animate-fade-in">
            {title}
          </h1>
        )}
        {children}
      </main>
      {showNav && <BottomNav />}
    </div>
  );
};
