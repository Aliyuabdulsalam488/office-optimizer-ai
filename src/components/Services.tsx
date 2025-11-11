import { useNavigate } from "react-router-dom";
import { DollarSign, Users, Home } from "lucide-react";

const Services = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: DollarSign,
      title: "Financial Insight Generator",
      description: "Complex financial modeling and reporting. Generate formal financial statements, P&L, balance sheets, risk analysis, and forecasting.",
      route: "/finance-dashboard"
    },
    {
      icon: Users,
      title: "HR Recruitment Intelligence",
      description: "Automated candidate screening and vetting. AI-powered shortlists, vetting summaries, and role-specific screening tests.",
      route: "/recruitment"
    },
    {
      icon: Home,
      title: "Architect Solution",
      description: "Two-round iterative architectural peer review system. AI-powered compliance checking, space optimization, and detailed efficiency metrics for residential design.",
      route: "/floor-planner"
    }
  ];

  const handleServiceClick = async (route: string) => {
    navigate(route);
  };

  return (
    <section id="services" className="py-20 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Core MVP Solutions
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Specialized AI-driven intelligence tools across three critical business domains, delivering instant actionable reports and transforming operational efficiency
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="group bg-card p-8 rounded-xl border-2 border-border/50 hover:border-primary transition-all duration-300 cursor-pointer hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 animate-fade-in"
                onClick={() => handleServiceClick(service.route)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-6 p-4 bg-gradient-to-br from-primary/20 to-primary/5 w-fit rounded-xl group-hover:scale-110 transition-transform">
                  <Icon className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
