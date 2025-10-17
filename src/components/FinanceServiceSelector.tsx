import { DollarSign, Building2, User, TrendingUp, Briefcase, Home } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const financeServices = [
  {
    icon: Building2,
    title: "Manufacturing Finance",
    description: "Production costs, inventory management, and supply chain financing",
  },
  {
    icon: User,
    title: "Personal Finance",
    description: "Budgeting, savings, investments, and personal financial planning",
  },
  {
    icon: Briefcase,
    title: "Corporate Finance",
    description: "Capital structure, mergers & acquisitions, and corporate strategy",
  },
  {
    icon: TrendingUp,
    title: "Investment Finance",
    description: "Portfolio management, risk assessment, and investment strategies",
  },
  {
    icon: Home,
    title: "Real Estate Finance",
    description: "Property financing, mortgages, and real estate investment",
  },
  {
    icon: DollarSign,
    title: "General Finance",
    description: "General financial advice and business finance consulting",
  },
];

interface FinanceServiceSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectService: (serviceType: string) => void;
}

const FinanceServiceSelector = ({ isOpen, onClose, onSelectService }: FinanceServiceSelectorProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Select Your Finance Service
          </DialogTitle>
          <DialogDescription className="text-base">
            Choose the financial service category that best matches your needs
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {financeServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card
                key={index}
                className="p-6 bg-gradient-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow group cursor-pointer"
                onClick={() => onSelectService(service.title)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-transparent group-hover:bg-gradient-primary group-hover:bg-clip-text transition-all">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FinanceServiceSelector;
