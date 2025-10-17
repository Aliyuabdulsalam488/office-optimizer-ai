import { useState } from "react";
import { Users, UserPlus, Calendar, TrendingUp, GraduationCap, FileCheck } from "lucide-react";
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
import EmployeeManagement from "./hr/EmployeeManagement";
import RecruitmentTracking from "./hr/RecruitmentTracking";
import LeaveManagement from "./hr/LeaveManagement";
import PerformanceReviews from "./hr/PerformanceReviews";
import OnboardingWorkflow from "./hr/OnboardingWorkflow";

const hrServices = [
  {
    icon: Users,
    title: "Employee Management",
    description: "Employee records, org structure, and workforce analytics",
  },
  {
    icon: UserPlus,
    title: "Recruitment & Talent",
    description: "Job postings, applicant tracking, and hiring workflows",
  },
  {
    icon: Calendar,
    title: "Leave & Attendance",
    description: "Time-off requests, attendance tracking, and shift management",
  },
  {
    icon: TrendingUp,
    title: "Performance Management",
    description: "Reviews, goal tracking, and performance analytics",
  },
  {
    icon: GraduationCap,
    title: "Learning & Development",
    description: "Training programs, skill development, and career paths",
  },
  {
    icon: FileCheck,
    title: "General HR",
    description: "General HR advice, policies, and employee relations",
  },
];

interface HRServiceSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectService: (serviceType: string) => void;
}

const HRServiceSelector = ({ isOpen, onClose, onSelectService }: HRServiceSelectorProps) => {
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
            {!showResources ? "Select Your HR Service" : selectedService}
          </DialogTitle>
          <DialogDescription className="text-base">
            {!showResources 
              ? "Choose the HR service category that best matches your needs"
              : "Upload documents, download templates, or access HR tools before chatting with Hilda"
            }
          </DialogDescription>
        </DialogHeader>
        
        {!showResources ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {hrServices.map((service, index) => {
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
            <Tabs defaultValue="analytics" className="w-full">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 text-xs">
                <TabsTrigger value="analytics">Employees</TabsTrigger>
                <TabsTrigger value="recruitment">Recruitment</TabsTrigger>
                <TabsTrigger value="leave">Leave</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="erp">ERP</TabsTrigger>
              </TabsList>
              <TabsContent value="analytics" className="mt-4">
                <EmployeeManagement />
              </TabsContent>
              <TabsContent value="recruitment" className="mt-4">
                <RecruitmentTracking />
              </TabsContent>
              <TabsContent value="leave" className="mt-4">
                <LeaveManagement />
              </TabsContent>
              <TabsContent value="performance" className="mt-4">
                <PerformanceReviews />
              </TabsContent>
              <TabsContent value="onboarding" className="mt-4">
                <OnboardingWorkflow />
              </TabsContent>
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
                Start Chat with Hilda
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default HRServiceSelector;
