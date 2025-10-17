import { useState } from "react";
import { Calendar, Plane, DollarSign, CheckSquare, Clock, Briefcase } from "lucide-react";
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
import CalendarManagement from "./executive/CalendarManagement";
import MeetingScheduler from "./executive/MeetingScheduler";
import TravelPlanning from "./executive/TravelPlanning";
import ExpenseTracking from "./executive/ExpenseTracking";
import TaskManagement from "./executive/TaskManagement";

const executiveServices = [
  {
    icon: Calendar,
    title: "Calendar Management",
    description: "Schedule and organize meetings, events, and appointments",
  },
  {
    icon: Clock,
    title: "Meeting Scheduler",
    description: "Coordinate meetings with multiple participants efficiently",
  },
  {
    icon: Plane,
    title: "Travel Planning",
    description: "Arrange business travel, itineraries, and accommodations",
  },
  {
    icon: DollarSign,
    title: "Expense Tracking",
    description: "Track and manage business expenses and reimbursements",
  },
  {
    icon: CheckSquare,
    title: "Task & Priority Management",
    description: "Organize tasks, priorities, and action items",
  },
  {
    icon: Briefcase,
    title: "General Executive Support",
    description: "General executive assistance and administrative support",
  },
];

interface ExecutiveServiceSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectService: (serviceType: string) => void;
}

const ExecutiveServiceSelector = ({ isOpen, onClose, onSelectService }: ExecutiveServiceSelectorProps) => {
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
            {!showResources ? "Select Your Executive Service" : selectedService}
          </DialogTitle>
          <DialogDescription className="text-base">
            {!showResources 
              ? "Choose the executive assistance service that best matches your needs"
              : "Access executive tools, upload documents, or chat with Eva before starting"
            }
          </DialogDescription>
        </DialogHeader>
        
        {!showResources ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {executiveServices.map((service, index) => {
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
            <Tabs defaultValue="calendar" className="w-full">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 text-xs">
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
                <TabsTrigger value="meetings">Meetings</TabsTrigger>
                <TabsTrigger value="travel">Travel</TabsTrigger>
                <TabsTrigger value="expenses">Expenses</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="erp">ERP</TabsTrigger>
              </TabsList>
              <TabsContent value="calendar" className="mt-4">
                <CalendarManagement />
              </TabsContent>
              <TabsContent value="meetings" className="mt-4">
                <MeetingScheduler />
              </TabsContent>
              <TabsContent value="travel" className="mt-4">
                <TravelPlanning />
              </TabsContent>
              <TabsContent value="expenses" className="mt-4">
                <ExpenseTracking />
              </TabsContent>
              <TabsContent value="tasks" className="mt-4">
                <TaskManagement />
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
                Start Chat with Eva
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ExecutiveServiceSelector;
