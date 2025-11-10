import { Bot, Zap, TrendingUp } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Zap,
      title: "Problem Definition",
      description: "Input your business goal or challenge in natural language - whether it's financial analysis, candidate screening, or spatial optimization"
    },
    {
      icon: Bot,
      title: "Dynamic Input Generation",
      description: "AI analyzes your problem and generates a precise, structured form with exactly the data fields and constraints needed to solve it"
    },
    {
      icon: TrendingUp,
      title: "Actionable Solution",
      description: "Receive professional-grade deliverables: Financial Statements, Candidate Reports, or Architectural Concepts - ready to implement"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-6 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Problem-to-Solution Cycle
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our unique AI approach decomposes complex business problems into structured, actionable solutions
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="text-center animate-fade-in relative"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary to-transparent" />
                )}
                <div className="relative mb-6 inline-block">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary via-primary/90 to-primary/70 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-primary/30 hover:scale-110 transition-transform">
                    <Icon className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-accent rounded-full flex items-center justify-center font-bold text-accent-foreground shadow-lg">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
