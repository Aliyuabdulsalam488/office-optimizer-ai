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

      {/* Animated Gradient Glows */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent leading-tight animate-fade-in">
          Automate Your Business with AI
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto animate-slide-up">
          One platform to handle recruitment, finance, sales, and operations. Let AI do the heavy lifting.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-scale-in-bounce" style={{ animationDelay: "300ms" }}>
          <Button 
            size="lg" 
            className="bg-gradient-primary text-lg px-8 py-6 group shadow-glow hover:shadow-glow hover:scale-105 transition-all duration-300" 
            onClick={() => navigate("/auth")}
          >
            Get Started Free
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            size="lg" 
            variant="outlinePrimary" 
            className="text-lg px-8 py-6 hover:scale-105 transition-all duration-300" 
            onClick={() => navigate("/jobs")}
          >
            Browse Jobs
          </Button>
        </div>
        
        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: "600ms" }}>
          {[
            { label: "Tasks Automated", value: "10M+" },
            { label: "Hours Saved", value: "500K+" },
            { label: "Happy Users", value: "50K+" },
          ].map((stat, index) => (
            <div key={index} className="group">
              <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
