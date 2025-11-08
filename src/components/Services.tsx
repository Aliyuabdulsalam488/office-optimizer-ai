import { useState, useEffect } from "react";
import { DollarSign, ShoppingCart, Users, Calendar, Database, TrendingUp, Sparkles, Home } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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
  {
    icon: Home,
    title: "Architecture & Floor Planning",
    description: "AI-powered floor plan design, 3D visualization, cost estimation, and building code compliance.",
  },
];

const Services = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setIsAuthenticated(!!user);
  };

  const handleServiceClick = (serviceType: string) => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    // Handle authenticated user service selection
    switch(serviceType) {
      case "business-setup":
        setShowBusinessSetup(true);
        break;
      case "finance":
        setShowFinanceSelector(true);
        break;
      case "procurement":
        setShowProcurementSelector(true);
        break;
      case "hr":
        setShowHRSelector(true);
        break;
      case "data-cleaning":
        setShowDataCleaningSelector(true);
        break;
      case "sales":
        setShowSalesSelector(true);
        break;
      case "executive":
        setShowExecutiveSelector(true);
        break;
      case "architecture":
        navigate("/floor-planner");
        break;
    }
  };

  return (
    <>
      <section id="solutions" className="py-20 px-6 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            What We Automate
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Pick a department and start automating today
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isBusinessSetup = service.title === "Business Setup";
            const isFinance = service.title === "Finance Automation";
            const isProcurement = service.title === "Procurement";
            const isHR = service.title === "HR Management";
            const isDataCleaning = service.title === "Data Cleaning";
            const isSales = service.title === "Sales Automation";
            const isExecutive = service.title === "Executive Assistant";
            const isArchitecture = service.title === "Architecture & Floor Planning";
            return (
              <Card
                key={index}
                className="p-6 bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-2 group cursor-pointer animate-scale-in-bounce"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => {
                  if (isBusinessSetup) handleServiceClick("business-setup");
                  if (isFinance) handleServiceClick("finance");
                  if (isProcurement) handleServiceClick("procurement");
                  if (isHR) handleServiceClick("hr");
                  if (isDataCleaning) handleServiceClick("data-cleaning");
                  if (isSales) handleServiceClick("sales");
                  if (isExecutive) handleServiceClick("executive");
                  if (isArchitecture) handleServiceClick("architecture");
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-glow">
                    <Icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {service.description}
                    </p>
                  </div>
                </div>
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
