import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileCheck, CheckCircle, Clock, Plus } from "lucide-react";

interface OnboardingTask {
  id: string;
  title: string;
  completed: boolean;
}

interface NewHire {
  id: string;
  name: string;
  position: string;
  department: string;
  startDate: string;
  progress: number;
  status: "not-started" | "in-progress" | "completed";
  tasks: OnboardingTask[];
}

const mockNewHires: NewHire[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    position: "Software Engineer",
    department: "Engineering",
    startDate: "2025-10-20",
    progress: 65,
    status: "in-progress",
    tasks: [
      { id: "1", title: "Complete paperwork", completed: true },
      { id: "2", title: "IT setup (laptop, accounts)", completed: true },
      { id: "3", title: "Department orientation", completed: true },
      { id: "4", title: "Meet team members", completed: false },
      { id: "5", title: "Review company policies", completed: false },
      { id: "6", title: "Set up development environment", completed: true },
      { id: "7", title: "First project assignment", completed: false },
    ],
  },
  {
    id: "2",
    name: "Michael Chen",
    position: "Product Designer",
    department: "Design",
    startDate: "2025-10-25",
    progress: 30,
    status: "in-progress",
    tasks: [
      { id: "1", title: "Complete paperwork", completed: true },
      { id: "2", title: "IT setup (laptop, accounts)", completed: true },
      { id: "3", title: "Department orientation", completed: false },
      { id: "4", title: "Design tools access", completed: true },
      { id: "5", title: "Review design system", completed: false },
    ],
  },
];

const OnboardingWorkflow = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "in-progress": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "not-started": return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      default: return "bg-muted";
    }
  };

  const stats = {
    active: mockNewHires.filter(h => h.status === "in-progress").length,
    completed: mockNewHires.filter(h => h.status === "completed").length,
    avgProgress: Math.round(mockNewHires.reduce((sum, h) => sum + h.progress, 0) / mockNewHires.length),
  };

  return (
    <Card className="p-6 bg-gradient-card border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileCheck className="w-5 h-5" />
          <h3 className="text-xl font-bold">Onboarding Workflow</h3>
        </div>
        <Button className="bg-gradient-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add New Hire
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Active Onboarding</p>
          <p className="text-2xl font-bold text-blue-500">{stats.active}</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Completed</p>
          <p className="text-2xl font-bold text-green-500">{stats.completed}</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Avg Progress</p>
          <p className="text-2xl font-bold">{stats.avgProgress}%</p>
        </Card>
      </div>

      <div className="space-y-4">
        {mockNewHires.map((hire) => (
          <Card key={hire.id} className="p-5 bg-background/50 border-border hover:border-primary/50 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-semibold text-lg mb-1">{hire.name}</h4>
                <p className="text-sm text-muted-foreground">{hire.position} • {hire.department}</p>
              </div>
              <Badge className={getStatusColor(hire.status)}>
                {hire.status === "in-progress" ? "In Progress" : hire.status}
              </Badge>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Onboarding Progress</p>
                <p className="text-sm text-muted-foreground">{hire.progress}%</p>
              </div>
              <Progress value={hire.progress} className="h-2" />
            </div>

            <div className="space-y-2 mb-4">
              <p className="text-sm font-medium">Checklist ({hire.tasks.filter(t => t.completed).length}/{hire.tasks.length})</p>
              <div className="space-y-2">
                {hire.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${
                      task.completed
                        ? "bg-green-500/10 border-green-500/20"
                        : "bg-background border-border"
                    }`}
                  >
                    {task.completed ? (
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    )}
                    <p className={`text-sm ${task.completed ? "text-green-500 line-through" : ""}`}>
                      {task.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t">
              <div className="text-sm text-muted-foreground">
                Start Date: <span className="font-medium text-foreground">{hire.startDate}</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">View Details</Button>
                <Button size="sm" variant="outline">Send Reminder</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <FileCheck className="w-4 h-4" />
          Standard Onboarding Timeline
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Day 1</p>
            <p className="font-medium">Welcome & Setup</p>
          </div>
          <div>
            <p className="text-muted-foreground">Week 1</p>
            <p className="font-medium">Team Integration</p>
          </div>
          <div>
            <p className="text-muted-foreground">Month 1</p>
            <p className="font-medium">Project Assignment</p>
          </div>
          <div>
            <p className="text-muted-foreground">Month 3</p>
            <p className="font-medium">Performance Check-in</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default OnboardingWorkflow;
