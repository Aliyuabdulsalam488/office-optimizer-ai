import { useState } from "react";
import { DollarSign, ShoppingCart, Users, Calendar, Database, TrendingUp, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import FreddyChat from "./FreddyChat";
import PennyChat from "./PennyChat";
import HildaChat from "./HildaChat";
import ClaraChat from "./ClaraChat";
import SallyChat from "./SallyChat";
import EvaChat from "./EvaChat";
import { BusinessSetup } from "./BusinessSetup";
import FinanceServiceSelector from "./FinanceServiceSelector";
import ProcurementServiceSelector from "./ProcurementServiceSelector";
import HRServiceSelector from "./HRServiceSelector";
import DataCleaningServiceSelector from "./DataCleaningServiceSelector";
import SalesServiceSelector from "./SalesServiceSelector";
import ExecutiveServiceSelector from "./ExecutiveServiceSelector";

const services = [
  {
    icon: Sparkles,
    title: "Business Setup",
    description: "Create and brand your new business with AI-powered name generation and branding guidelines.",
  },
  {
    icon: DollarSign,
    title: "Finance Automation",
    description: "Streamline invoicing, expense tracking, and financial reporting with intelligent AI systems.",
  },
  {
    icon: ShoppingCart,
    title: "Procurement",
    description: "Automate vendor management, purchase orders, and supply chain optimization.",
  },
  {
    icon: Users,
    title: "HR Management",
    description: "Smart recruitment, onboarding, and employee management powered by AI.",
  },
  {
    icon: Calendar,
    title: "Executive Assistant",
    description: "AI-powered inbox management, calendar scheduling, and meeting coordination.",
  },
  {
    icon: Database,
    title: "Data Cleaning",
    description: "Automatically clean, organize, and standardize your business data.",
  },
  {
    icon: TrendingUp,
    title: "Sales Automation",
    description: "AI-powered lead generation, pipeline management, and sales forecasting.",
  },
];

const Services = () => {
  const [showFreddyChat, setShowFreddyChat] = useState(false);
  const [showPennyChat, setShowPennyChat] = useState(false);
  const [showHildaChat, setShowHildaChat] = useState(false);
  const [showClaraChat, setShowClaraChat] = useState(false);
  const [showSallyChat, setShowSallyChat] = useState(false);
  const [showEvaChat, setShowEvaChat] = useState(false);
  const [showBusinessSetup, setShowBusinessSetup] = useState(false);
  const [showFinanceSelector, setShowFinanceSelector] = useState(false);
  const [showProcurementSelector, setShowProcurementSelector] = useState(false);
  const [showHRSelector, setShowHRSelector] = useState(false);
  const [showDataCleaningSelector, setShowDataCleaningSelector] = useState(false);
  const [showSalesSelector, setShowSalesSelector] = useState(false);
  const [showExecutiveSelector, setShowExecutiveSelector] = useState(false);
  const [selectedFinanceService, setSelectedFinanceService] = useState<string>("");
  const [selectedProcurementService, setSelectedProcurementService] = useState<string>("");
  const [selectedHRService, setSelectedHRService] = useState<string>("");
  const [selectedDataCleaningService, setSelectedDataCleaningService] = useState<string>("");
  const [selectedSalesService, setSelectedSalesService] = useState<string>("");
  const [selectedExecutiveService, setSelectedExecutiveService] = useState<string>("");

  return (
    <>
      <section id="solutions" className="py-24 md:py-32 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-20 animate-fade-in">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Our AI Solutions
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive automation across every aspect of your business operations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isBusinessSetup = service.title === "Business Setup";
            const isFinance = service.title === "Finance Automation";
            const isProcurement = service.title === "Procurement";
            const isHR = service.title === "HR Management";
            const isDataCleaning = service.title === "Data Cleaning";
            const isSales = service.title === "Sales Automation";
            const isExecutive = service.title === "Executive Assistant";
            return (
              <Card
                key={index}
                className="p-8 bg-gradient-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow group animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-transparent group-hover:bg-gradient-primary group-hover:bg-clip-text transition-all">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {service.description}
                </p>
                {isBusinessSetup && (
                  <Button 
                    onClick={() => setShowBusinessSetup(true)}
                    variant="gradient"
                    className="w-full"
                  >
                    Create Your Business
                  </Button>
                )}
                {isFinance && (
                  <Button 
                    onClick={() => setShowFinanceSelector(true)}
                    variant="gradient"
                    className="w-full"
                  >
                    Explore Finance Services
                  </Button>
                )}
                {isProcurement && (
                  <Button 
                    onClick={() => setShowProcurementSelector(true)}
                    variant="gradient"
                    className="w-full"
                  >
                    Explore Procurement Services
                  </Button>
                )}
                {isHR && (
                  <Button 
                    onClick={() => setShowHRSelector(true)}
                    variant="gradient"
                    className="w-full"
                  >
                    Explore HR Services
                  </Button>
                )}
                {isDataCleaning && (
                  <Button 
                    onClick={() => setShowDataCleaningSelector(true)}
                    variant="gradient"
                    className="w-full"
                  >
                    Explore Data Cleaning
                  </Button>
                )}
                {isSales && (
                  <Button 
                    onClick={() => setShowSalesSelector(true)}
                    variant="gradient"
                    className="w-full"
                  >
                    Explore Sales Services
                  </Button>
                )}
                {isExecutive && (
                  <Button 
                    onClick={() => setShowExecutiveSelector(true)}
                    variant="gradient"
                    className="w-full"
                  >
                    Explore Executive Services
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </section>
    <FinanceServiceSelector 
      isOpen={showFinanceSelector}
      onClose={() => setShowFinanceSelector(false)}
      onSelectService={(serviceType) => {
        setSelectedFinanceService(serviceType);
        setShowFinanceSelector(false);
        setShowFreddyChat(true);
      }}
    />
    <ProcurementServiceSelector 
      isOpen={showProcurementSelector}
      onClose={() => setShowProcurementSelector(false)}
      onSelectService={(serviceType) => {
        setSelectedProcurementService(serviceType);
        setShowProcurementSelector(false);
        setShowPennyChat(true);
      }}
    />
    <HRServiceSelector 
      isOpen={showHRSelector}
      onClose={() => setShowHRSelector(false)}
      onSelectService={(serviceType) => {
        setSelectedHRService(serviceType);
        setShowHRSelector(false);
        setShowHildaChat(true);
      }}
    />
    <DataCleaningServiceSelector 
      isOpen={showDataCleaningSelector}
      onClose={() => setShowDataCleaningSelector(false)}
      onSelectService={(serviceType) => {
        setSelectedDataCleaningService(serviceType);
        setShowDataCleaningSelector(false);
        setShowClaraChat(true);
      }}
    />
    <SalesServiceSelector 
      isOpen={showSalesSelector}
      onClose={() => setShowSalesSelector(false)}
      onSelectService={(serviceType) => {
        setSelectedSalesService(serviceType);
        setShowSalesSelector(false);
        setShowSallyChat(true);
      }}
    />
    <ExecutiveServiceSelector 
      isOpen={showExecutiveSelector}
      onClose={() => setShowExecutiveSelector(false)}
      onSelectService={(serviceType) => {
        setSelectedExecutiveService(serviceType);
        setShowExecutiveSelector(false);
        setShowEvaChat(true);
      }}
    />
    {showFreddyChat && (
      <FreddyChat 
        onClose={() => setShowFreddyChat(false)}
        serviceType={selectedFinanceService}
      />
    )}
    {showPennyChat && (
      <PennyChat 
        onClose={() => setShowPennyChat(false)}
        serviceType={selectedProcurementService}
      />
    )}
    {showHildaChat && (
      <HildaChat 
        onClose={() => setShowHildaChat(false)}
        serviceType={selectedHRService}
      />
    )}
    {showClaraChat && (
      <ClaraChat 
        onClose={() => setShowClaraChat(false)}
        serviceType={selectedDataCleaningService}
      />
    )}
    {showSallyChat && (
      <SallyChat 
        onClose={() => setShowSallyChat(false)}
        serviceType={selectedSalesService}
      />
    )}
    {showEvaChat && (
      <EvaChat 
        onClose={() => setShowEvaChat(false)}
        serviceType={selectedExecutiveService}
      />
    )}
    {showBusinessSetup && (
      <Dialog open={showBusinessSetup} onOpenChange={setShowBusinessSetup}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <BusinessSetup />
        </DialogContent>
      </Dialog>
    )}
    </>
  );
};

export default Services;
