import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
  onClick?: () => void;
}

export const AnimatedCard = ({
  children,
  className,
  hover = true,
  delay = 0,
  onClick,
}: AnimatedCardProps) => {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "transition-all duration-300 animate-scale-in-bounce",
        hover && "hover:shadow-card-hover hover:-translate-y-1 cursor-pointer",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </Card>
  );
};
