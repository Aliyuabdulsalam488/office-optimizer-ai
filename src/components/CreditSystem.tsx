import { useState } from "react";
import { Zap, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CreditSystemProps {
  currentCredits?: number;
  maxCredits?: number;
  variant?: "compact" | "detailed";
}

export const CreditSystem = ({ 
  currentCredits = 150, 
  maxCredits = 500,
  variant = "compact" 
}: CreditSystemProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const percentage = (currentCredits / maxCredits) * 100;
  
  const getColorScheme = () => {
    if (percentage > 60) return "text-success";
    if (percentage > 30) return "text-warning";
    return "text-destructive";
  };

  if (variant === "compact") {
    return (
      <Popover open={showDetails} onOpenChange={setShowDetails}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2 hover:bg-muted/50 transition-colors">
            <Zap className={`w-4 h-4 ${getColorScheme()}`} />
            <span className="font-semibold">{currentCredits}</span>
            <span className="text-muted-foreground text-sm">/ {maxCredits}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="end">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">AI Credits</h4>
                <p className="text-xs text-muted-foreground">
                  Use credits for AI-powered automation tasks
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Available Credits</span>
                <span className={`font-bold ${getColorScheme()}`}>
                  {currentCredits} / {maxCredits}
                </span>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>

            <div className="pt-3 border-t space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Credit Usage</span>
                <span className="font-medium">{maxCredits - currentCredits} used</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Refresh Date</span>
                <span className="font-medium">Nov 30, 2024</span>
              </div>
            </div>

            <Button className="w-full" size="sm">
              Top Up Credits
            </Button>

            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
              <Info className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                Credits refresh monthly. Unused credits don't roll over.
              </p>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-gradient-primary shadow-glow">
            <Zap className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">AI Credits</h3>
            <p className="text-sm text-muted-foreground">
              Power your automation with AI credits
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-baseline">
            <span className="text-sm font-medium text-muted-foreground">Available Credits</span>
            <div className="flex items-baseline gap-1">
              <span className={`text-3xl font-bold ${getColorScheme()}`}>{currentCredits}</span>
              <span className="text-sm text-muted-foreground">/ {maxCredits}</span>
            </div>
          </div>
          <Progress value={percentage} className="h-3" />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-3 border-t">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Used This Month</p>
            <p className="text-lg font-semibold">{maxCredits - currentCredits}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Resets In</p>
            <p className="text-lg font-semibold">15 days</p>
          </div>
        </div>

        <Button className="w-full">
          Buy More Credits
        </Button>

        <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
          <Info className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• 1 credit = 1 AI automation task</p>
            <p>• Credits refresh on the 1st of each month</p>
            <p>• Unused credits do not carry over</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
