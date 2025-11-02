import { Bot, Zap, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: Bot,
    title: "Sign Up",
    description: "Create your account in 30 seconds. No credit card required.",
  },
  {
    icon: Zap,
    title: "Connect",
    description: "Link your tools and let AI understand your workflow.",
  },
  {
    icon: TrendingUp,
    title: "Automate",
    description: "Watch AI handle tasks while you focus on growth.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 px-6 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Get Started in 3 Steps
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From signup to automation in minutes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative text-center"
              >
                <div className="flex flex-col items-center">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg">
                      <Icon className="w-10 h-10 text-primary-foreground" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-bold text-secondary-foreground shadow-md text-sm">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
