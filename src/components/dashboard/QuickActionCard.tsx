import { LucideIcon } from "lucide-react";
import { AnimatedCard } from "@/components/ui/animated-card";
import { cn } from "@/lib/utils";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  colorScheme?: "primary" | "secondary" | "success" | "warning";
  delay?: number;
}

const colorSchemes = {
  primary: "hover:border-primary/50 hover:bg-primary/5",
  secondary: "hover:border-secondary/50 hover:bg-secondary/5",
  success: "hover:border-success/50 hover:bg-success/5",
  warning: "hover:border-warning/50 hover:bg-warning/5",
};

export const QuickActionCard = ({
  title,
  description,
  icon: Icon,
  onClick,
  colorScheme = "primary",
  delay = 0,
}: QuickActionCardProps) => {
  return (
    <AnimatedCard
      onClick={onClick}
      className={cn(
        "p-6 border-2 transition-all duration-300",
        colorSchemes[colorScheme]
      )}
      delay={delay}
    >
      <div className="flex items-start gap-4">
        <div className="rounded-lg bg-gradient-primary p-3">
          <Icon className="w-6 h-6 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </AnimatedCard>
  );
};
