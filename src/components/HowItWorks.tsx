import { Bot, Zap, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: Bot,
    title: "Connect Your Systems",
    description: "Seamlessly integrate AI with your existing business tools and workflows.",
  },
  {
    icon: Zap,
    title: "Automate Processes",
    description: "Our AI learns your operations and automates repetitive tasks instantly.",
  },
  {
    icon: TrendingUp,
    title: "Scale & Optimize",
    description: "Continuously improve efficiency as AI adapts to your business needs.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20 animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get started in three simple steps and watch your business transform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connection Lines */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-primary opacity-30 -translate-y-1/2" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative animate-slide-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
                      <Icon className="w-12 h-12 text-primary-foreground" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-secondary-foreground shadow-lg">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed max-w-xs">
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
