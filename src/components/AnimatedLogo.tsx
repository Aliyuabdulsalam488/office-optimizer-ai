import { useNavigate } from "react-router-dom";
import { Zap } from "lucide-react";

export const AnimatedLogo = () => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/")}
      className="flex items-center gap-2 cursor-pointer group"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-primary rounded-lg blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-300 animate-glow-pulse" />
        <div className="relative bg-gradient-primary p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
          <Zap className="w-5 h-5 text-primary-foreground animate-float" />
        </div>
      </div>
      <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
        TechStora
      </span>
    </div>
  );
};
