import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";

const CTA = () => {
  return (
    <section id="contact" className="py-24 md:py-32 px-6 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 blur-3xl" />
      
      <div className="max-w-5xl mx-auto relative z-10 text-center animate-fade-in">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
          Ready to Transform Your Business?
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          Join leading companies using AI to automate operations and drive growth. 
          Start your journey today.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button size="xl" variant="gradient" className="group">
            Start Free Trial
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button size="xl" variant="outlinePrimary" className="group">
            <Mail className="mr-2 group-hover:scale-110 transition-transform" />
            Contact Sales
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          No credit card required • 14-day free trial • Cancel anytime
        </p>
      </div>
    </section>
  );
};

export default CTA;
