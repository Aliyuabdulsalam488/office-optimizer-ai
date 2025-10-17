import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckSquare, Search, Plus, Flag, Calendar, User } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  dueDate: string;
  assignedTo?: string;
  category: string;
  completed: boolean;
}

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Review Q4 budget proposal",
    description: "Analyze department budgets and prepare recommendations",
    priority: "high",
    dueDate: "Today, 5:00 PM",
    assignedTo: "Self",
    category: "Finance",
    completed: false,
  },
  {
    id: "2",
    title: "Approve hiring requests",
    description: "Review and approve 3 pending job requisitions",
    priority: "high",
    dueDate: "Tomorrow",
    assignedTo: "Self",
    category: "HR",
    completed: false,
  },
  {
    id: "3",
    title: "Prepare board presentation",
    description: "Create slides for next week's board meeting",
    priority: "medium",
    dueDate: "Oct 20",
    assignedTo: "Self",
    category: "Strategy",
    completed: false,
  },
  {
    id: "4",
    title: "Sign contract renewals",
    description: "Review and sign vendor contract renewals",
    priority: "medium",
    dueDate: "Oct 18",
    assignedTo: "Self",
    category: "Legal",
    completed: true,
  },
  {
    id: "5",
    title: "Team 1-on-1 meetings",
    description: "Schedule Q4 check-ins with direct reports",
    priority: "low",
    dueDate: "Next week",
    assignedTo: "Self",
    category: "Management",
    completed: false,
  },
];

const TaskManagement = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "medium": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "low": return "bg-green-500/10 text-green-500 border-green-500/20";
      default: return "bg-muted";
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Finance": "bg-blue-500/10 text-blue-500 border-blue-500/20",
      "HR": "bg-purple-500/10 text-purple-500 border-purple-500/20",
      "Strategy": "bg-orange-500/10 text-orange-500 border-orange-500/20",
      "Legal": "bg-pink-500/10 text-pink-500 border-pink-500/20",
      "Management": "bg-teal-500/10 text-teal-500 border-teal-500/20",
    };
    return colors[category] || "bg-muted";
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    highPriority: tasks.filter(t => t.priority === "high" && !t.completed).length,
    dueToday: tasks.filter(t => t.dueDate.includes("Today") && !t.completed).length,
  };

  return (
    <Card className="p-6 bg-gradient-card border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-5 h-5" />
          <h3 className="text-xl font-bold">Task & Priority Management</h3>
        </div>
        <Button className="bg-gradient-primary">
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Total Tasks</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Completed</p>
          <p className="text-2xl font-bold text-green-500">{stats.completed}</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">High Priority</p>
          <p className="text-2xl font-bold text-red-500">{stats.highPriority}</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Due Today</p>
          <p className="text-2xl font-bold text-yellow-500">{stats.dueToday}</p>
        </Card>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="high-priority">High Priority</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="by-category">By Category</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4 space-y-3">
          {filteredTasks.filter(t => !t.completed).map((task) => (
            <Card key={task.id} className="p-4 bg-background/50 border-border hover:border-primary/50 transition-all">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold mb-1">{task.title}</h4>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getPriorityColor(task.priority)}>
                        <Flag className="w-3 h-3 mr-1" />
                        {task.priority}
                      </Badge>
                      <Badge className={getCategoryColor(task.category)} variant="outline">
                        {task.category}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{task.dueDate}</span>
                    </div>
                    {task.assignedTo && (
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{task.assignedTo}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="flex-1">
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Reschedule
                    </Button>
                    <Button size="sm" variant="outline">
                      Delegate
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="high-priority">
          <p className="text-sm text-muted-foreground text-center py-8">
            {tasks.filter(t => t.priority === "high" && !t.completed).length} high-priority tasks need attention
          </p>
        </TabsContent>

        <TabsContent value="completed">
          <div className="space-y-3">
            {filteredTasks.filter(t => t.completed).map((task) => (
              <Card key={task.id} className="p-4 bg-background/50 opacity-60">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold line-through">{task.title}</h4>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="by-category">
          <div className="space-y-4">
            {["Finance", "HR", "Strategy", "Legal", "Management"].map((category) => {
              const categoryTasks = tasks.filter(t => t.category === category && !t.completed);
              if (categoryTasks.length === 0) return null;
              return (
                <div key={category}>
                  <h4 className="text-sm font-semibold mb-2">{category}</h4>
                  <p className="text-sm text-muted-foreground">
                    {categoryTasks.length} active tasks in this category
                  </p>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <CheckSquare className="w-4 h-4" />
          Priority Recommendations
        </h4>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• Focus on "Review Q4 budget proposal" first - it's due today</li>
          <li>• "Approve hiring requests" can be delegated to VP of HR</li>
          <li>• Consider blocking 2 hours tomorrow for board presentation prep</li>
        </ul>
      </div>
    </Card>
  );
};

export default TaskManagement;
