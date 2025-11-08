import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  colorScheme?: "primary" | "secondary" | "success" | "warning" | "info";
  className?: string;
}

const colorSchemes = {
  primary: {
    bg: "bg-gradient-primary",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    trendPositive: "text-primary",
    trendNegative: "text-destructive",
  },
  secondary: {
    bg: "bg-gradient-secondary",
    iconBg: "bg-secondary/10",
    iconColor: "text-secondary",
    trendPositive: "text-secondary",
    trendNegative: "text-destructive",
  },
  success: {
    bg: "bg-gradient-success",
    iconBg: "bg-success/10",
    iconColor: "text-success",
    trendPositive: "text-success",
    trendNegative: "text-destructive",
  },
  warning: {
    bg: "bg-gradient-warning",
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
    trendPositive: "text-warning",
    trendNegative: "text-destructive",
  },
  info: {
    bg: "bg-gradient-primary",
    iconBg: "bg-info/10",
    iconColor: "text-info",
    trendPositive: "text-info",
    trendNegative: "text-destructive",
  },
};

export const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  colorScheme = "primary",
  className,
}: StatCardProps) => {
  const colors = colorSchemes[colorScheme];

  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 cursor-pointer",
      className
    )}>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {title}
            </p>
            <p className="text-3xl font-bold text-foreground mb-2">
              {value}
            </p>
            {trend && (
              <p className={cn(
                "text-sm font-medium",
                trend.isPositive ? colors.trendPositive : colors.trendNegative
              )}>
                {trend.isPositive ? "↑" : "↓"} {trend.value}
              </p>
            )}
          </div>
          <div className={cn(
            "rounded-lg p-3 transition-transform duration-300 group-hover:scale-110",
            colors.iconBg
          )}>
            <Icon className={cn("w-6 h-6", colors.iconColor)} />
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
    </Card>
  );
};
