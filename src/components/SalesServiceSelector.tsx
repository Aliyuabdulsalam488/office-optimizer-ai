import { useState } from "react";
import { TrendingUp, Users, Target, BarChart3, FileText, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DocumentUpload from "./DocumentUpload";
import TemplateLibrary from "./TemplateLibrary";
import ERPIntegration from "./ERPIntegration";
import LeadManagement from "./sales/LeadManagement";
import PipelineTracking from "./sales/PipelineTracking";
import SalesForecasting from "./sales/SalesForecasting";
import CRMDashboard from "./sales/CRMDashboard";
import QuoteGenerator from "./sales/QuoteGenerator";

const salesServices = [
  {
    icon: Users,
    title: "Lead Management",
    description: "Track and nurture leads through the sales funnel",
  },
  {
    icon: TrendingUp,
    title: "Pipeline Tracking",
    description: "Monitor deals and opportunities across sales stages",
  },
  {
    icon: BarChart3,
    title: "Sales Forecasting",
    description: "Predict revenue and analyze sales trends",
  },
  {
    icon: Target,
    title: "CRM & Customer Management",
    description: "Manage customer relationships and interaction history",
  },
  {
    icon: FileText,
    title: "Quote & Proposal Generation",
    description: "Create professional quotes and proposals quickly",
  },
  {
    icon: DollarSign,
    title: "General Sales Support",
    description: "General sales advice and automation assistance",
  },
];

interface SalesServiceSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectService: (serviceType: string) => void;
}

const SalesServiceSelector = ({ isOpen, onClose, onSelectService }: SalesServiceSelectorProps) => {
  const [selectedService, setSelectedService] = useState<string>("");
  const [showResources, setShowResources] = useState(false);

  const handleServiceClick = (serviceTitle: string) => {
    setSelectedService(serviceTitle);
    setShowResources(true);
  };

  const handleStartChat = () => {
    onSelectService(selectedService);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            {!showResources ? "Select Your Sales Service" : selectedService}
          </DialogTitle>
          <DialogDescription className="text-base">
            {!showResources 
              ? "Choose the sales service that best matches your needs"
              : "Access sales tools, upload documents, or chat with Sally before starting"
            }
          </DialogDescription>
        </DialogHeader>
        
        {!showResources ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {salesServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card
                  key={index}
                  className="p-6 bg-gradient-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow group cursor-pointer"
                  onClick={() => handleServiceClick(service.title)}
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
        ) : (
          <div className="space-y-6 mt-6">
            <Tabs defaultValue="leads" className="w-full">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 text-xs">
                <TabsTrigger value="leads">Leads</TabsTrigger>
                <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
                <TabsTrigger value="forecast">Forecast</TabsTrigger>
                <TabsTrigger value="crm">CRM</TabsTrigger>
                <TabsTrigger value="quotes">Quotes</TabsTrigger>
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="erp">ERP</TabsTrigger>
              </TabsList>
              <TabsContent value="leads" className="mt-4">
                <LeadManagement />
              </TabsContent>
              <TabsContent value="pipeline" className="mt-4">
                <PipelineTracking />
              </TabsContent>
              <TabsContent value="forecast" className="mt-4">
                <SalesForecasting />
              </TabsContent>
              <TabsContent value="crm" className="mt-4">
                <CRMDashboard />
              </TabsContent>
              <TabsContent value="quotes" className="mt-4">
                <QuoteGenerator />
              </TabsContent>
              <TabsContent value="upload" className="mt-4">
                <DocumentUpload serviceType={selectedService} />
              </TabsContent>
              <TabsContent value="templates" className="mt-4">
                <TemplateLibrary serviceType={selectedService} />
              </TabsContent>
              <TabsContent value="erp" className="mt-4">
                <ERPIntegration serviceType={selectedService} />
              </TabsContent>
            </Tabs>

            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowResources(false)}
              >
                Back to Services
              </Button>
              <Button
                onClick={handleStartChat}
                className="bg-gradient-primary"
              >
                Start Chat with Sally
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SalesServiceSelector;
