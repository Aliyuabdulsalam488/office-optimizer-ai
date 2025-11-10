import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, Users, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroBackground from "@/assets/hero-background.jpg";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBackground} 
          alt="Techstora X-AI Enterprise Intelligence" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      </div>

      {/* Animated Gradient Glows */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center px-6 animate-fade-in">
        <div className="mb-4">
          <span className="text-primary text-sm font-semibold tracking-wider uppercase">Techstora X-AI</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
          Enterprise Intelligence Suite
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto">
          Transform operational efficiency with specialized AI-driven solutions across Finance, HR, and Architecture
        </p>
        <p className="text-lg text-muted-foreground/80 mb-12 max-w-2xl mx-auto">
          Dynamic problem decomposition • Instant actionable reports • Cross-functional utility
        </p>
        
        {/* MVP Access Buttons */}
        <div className="grid md:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto">
          <Button 
            size="lg" 
            className="h-auto py-6 px-6 flex flex-col items-center gap-2 bg-gradient-to-br from-primary to-primary/80 hover:scale-105 transition-transform"
            onClick={() => navigate("/finance-dashboard")}
          >
            <Building2 className="w-8 h-8" />
            <div className="text-center">
              <div className="font-bold text-base">Financial Insight</div>
              <div className="text-xs opacity-90">P&L, Balance Sheets, Forecasting</div>
            </div>
          </Button>
          
          <Button 
            size="lg" 
            className="h-auto py-6 px-6 flex flex-col items-center gap-2 bg-gradient-to-br from-secondary to-secondary/80 hover:scale-105 transition-transform"
            onClick={() => navigate("/recruitment")}
          >
            <Users className="w-8 h-8" />
            <div className="text-center">
              <div className="font-bold text-base">HR Recruitment</div>
              <div className="text-xs opacity-90">Candidate Screening & Vetting</div>
            </div>
          </Button>
          
          <Button 
            size="lg" 
            className="h-auto py-6 px-6 flex flex-col items-center gap-2 bg-gradient-to-br from-accent to-accent/80 hover:scale-105 transition-transform"
            onClick={() => navigate("/floor-planner")}
          >
            <Home className="w-8 h-8" />
            <div className="text-center">
              <div className="font-bold text-base">Spatial Solver</div>
              <div className="text-xs opacity-90">Floor Plans & Optimization</div>
            </div>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            variant="outline" 
            className="text-base px-8 py-5 border-border/50 hover:border-primary/50" 
            onClick={() => navigate("/auth")}
          >
            Sign In / Register
            <ArrowRight className="ml-2" />
          </Button>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto mt-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">3</div>
            <div className="text-muted-foreground">Core MVPs</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">Instant</div>
            <div className="text-muted-foreground">AI-Generated Reports</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">500+</div>
            <div className="text-muted-foreground">Enterprise Scale</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
