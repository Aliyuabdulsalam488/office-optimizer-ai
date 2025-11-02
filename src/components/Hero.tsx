import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBackground} 
          alt="AI Business Automation" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      </div>

      {/* Gradient Glow Effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-primary opacity-20 blur-3xl rounded-full animate-glow-pulse" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center animate-fade-in">
        <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent leading-tight">
          AI-Powered Business Automation
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
          Transform your daily operations with intelligent automation. From finance to HR, 
          let AI handle the routine so you can focus on what matters.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="xl" variant="gradient" className="group" onClick={() => navigate("/auth")}>
            Get Started
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button size="xl" variant="outlinePrimary" onClick={() => navigate("/jobs")}>
            Find Jobs
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">10x</div>
            <div className="text-muted-foreground mt-2">Faster Processing</div>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">80%</div>
            <div className="text-muted-foreground mt-2">Cost Reduction</div>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "0.6s" }}>
            <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">24/7</div>
            <div className="text-muted-foreground mt-2">Automated Operations</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
