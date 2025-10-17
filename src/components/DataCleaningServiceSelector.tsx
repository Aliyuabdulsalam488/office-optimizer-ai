import { useState } from "react";
import { Database, FileSpreadsheet, Search, Zap, CheckCircle, Settings } from "lucide-react";
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
import DataQualityAssessment from "./datacleaning/DataQualityAssessment";
import DuplicateDetection from "./datacleaning/DuplicateDetection";
import DataTransformation from "./datacleaning/DataTransformation";
import ValidationRules from "./datacleaning/ValidationRules";
import DataProfiling from "./datacleaning/DataProfiling";

const dataCleaningServices = [
  {
    icon: Search,
    title: "Data Quality Assessment",
    description: "Analyze datasets for completeness, accuracy, and consistency issues",
  },
  {
    icon: FileSpreadsheet,
    title: "Duplicate Detection",
    description: "Identify and remove duplicate records across datasets",
  },
  {
    icon: Zap,
    title: "Data Transformation",
    description: "Standardize formats, normalize values, and convert data types",
  },
  {
    icon: CheckCircle,
    title: "Validation Rules",
    description: "Set up and enforce data quality rules and constraints",
  },
  {
    icon: Settings,
    title: "Data Profiling",
    description: "Generate comprehensive statistics and insights about your data",
  },
  {
    icon: Database,
    title: "General Data Cleaning",
    description: "General data cleaning advice and automated workflows",
  },
];

interface DataCleaningServiceSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectService: (serviceType: string) => void;
}

const DataCleaningServiceSelector = ({ isOpen, onClose, onSelectService }: DataCleaningServiceSelectorProps) => {
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
            {!showResources ? "Select Your Data Cleaning Service" : selectedService}
          </DialogTitle>
          <DialogDescription className="text-base">
            {!showResources 
              ? "Choose the data cleaning service that best matches your needs"
              : "Upload datasets, access cleaning tools, or chat with Clara before starting"
            }
          </DialogDescription>
        </DialogHeader>
        
        {!showResources ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {dataCleaningServices.map((service, index) => {
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
            <Tabs defaultValue="quality" className="w-full">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 text-xs">
                <TabsTrigger value="quality">Quality</TabsTrigger>
                <TabsTrigger value="duplicates">Duplicates</TabsTrigger>
                <TabsTrigger value="transform">Transform</TabsTrigger>
                <TabsTrigger value="validation">Validation</TabsTrigger>
                <TabsTrigger value="profiling">Profiling</TabsTrigger>
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
              </TabsList>
              <TabsContent value="quality" className="mt-4">
                <DataQualityAssessment />
              </TabsContent>
              <TabsContent value="duplicates" className="mt-4">
                <DuplicateDetection />
              </TabsContent>
              <TabsContent value="transform" className="mt-4">
                <DataTransformation />
              </TabsContent>
              <TabsContent value="validation" className="mt-4">
                <ValidationRules />
              </TabsContent>
              <TabsContent value="profiling" className="mt-4">
                <DataProfiling />
              </TabsContent>
              <TabsContent value="upload" className="mt-4">
                <DocumentUpload serviceType={selectedService} />
              </TabsContent>
              <TabsContent value="templates" className="mt-4">
                <TemplateLibrary serviceType={selectedService} />
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
                Start Chat with Clara
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DataCleaningServiceSelector;
