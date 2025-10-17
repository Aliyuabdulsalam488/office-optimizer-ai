import { useState } from "react";
import { Package, Factory, Store, Truck, ShoppingCart, Boxes } from "lucide-react";
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

const procurementServices = [
  {
    icon: Factory,
    title: "Manufacturing Procurement",
    description: "Raw materials, components, and production supplies sourcing",
  },
  {
    icon: Store,
    title: "Retail Procurement",
    description: "Inventory purchasing, vendor management, and retail supply chain",
  },
  {
    icon: Truck,
    title: "Logistics & Distribution",
    description: "Transportation, warehousing, and distribution services procurement",
  },
  {
    icon: ShoppingCart,
    title: "Indirect Procurement",
    description: "Office supplies, services, and non-production materials",
  },
  {
    icon: Boxes,
    title: "Strategic Sourcing",
    description: "Supplier selection, contract negotiation, and cost optimization",
  },
  {
    icon: Package,
    title: "General Procurement",
    description: "General purchasing advice and procurement consulting",
  },
];

interface ProcurementServiceSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectService: (serviceType: string) => void;
}

const ProcurementServiceSelector = ({ isOpen, onClose, onSelectService }: ProcurementServiceSelectorProps) => {
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
            {!showResources ? "Select Your Procurement Service" : selectedService}
          </DialogTitle>
          <DialogDescription className="text-base">
            {!showResources 
              ? "Choose the procurement service category that best matches your needs"
              : "Upload documents, download templates, or connect your ERP before chatting with Penny"
            }
          </DialogDescription>
        </DialogHeader>
        
        {!showResources ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {procurementServices.map((service, index) => {
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
            <Tabs defaultValue="documents" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="erp">ERP Integration</TabsTrigger>
              </TabsList>
              <TabsContent value="documents" className="mt-4">
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
                Start Chat with Penny
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProcurementServiceSelector;
