import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";

const Hero = () => {
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
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent leading-tight">
          AI-Powered Business Automation
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
          Transform your daily operations with intelligent automation. From finance to HR, 
          let AI handle the routine so you can focus on what matters.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="text-lg px-8 py-6 bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow group">
            Get Started
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary/50 hover:border-primary hover:bg-primary/10">
            Watch Demo
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
