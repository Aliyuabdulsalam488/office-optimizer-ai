import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const CTA = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleContactSales = () => {
    toast({
      title: "Contact Sales",
      description: "Our sales team will reach out to you shortly. Email: sales@techstora.com",
    });
  };

  return (
    <section id="contact" className="py-20 px-6 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 blur-3xl" />
      
      <div className="max-w-4xl mx-auto relative z-10 text-center animate-fade-in">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Start Automating Today
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join businesses already using AI to save time and reduce costs.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="bg-gradient-primary text-lg px-8 py-6 group" onClick={() => navigate("/auth")}>
            Get Started Free
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 py-6 group" onClick={handleContactSales}>
            <Mail className="mr-2 group-hover:scale-110 transition-transform" />
            Talk to Sales
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
