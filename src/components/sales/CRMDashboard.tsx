import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Users, MessageSquare, Calendar, Mail, Phone, Clock } from "lucide-react";

interface Activity {
  id: string;
  type: "call" | "email" | "meeting" | "note";
  customer: string;
  description: string;
  time: string;
  outcome?: string;
}

const mockActivities: Activity[] = [
  {
    id: "1",
    type: "call",
    customer: "TechCorp Solutions",
    description: "Discussed Q1 contract renewal and pricing",
    time: "2 hours ago",
    outcome: "Follow-up scheduled",
  },
  {
    id: "2",
    type: "meeting",
    customer: "Global Industries",
    description: "Product demo for decision makers",
    time: "Yesterday",
    outcome: "Proposal requested",
  },
  {
    id: "3",
    type: "email",
    customer: "Startup Ventures",
    description: "Sent pricing proposal and case studies",
    time: "2 days ago",
  },
  {
    id: "4",
    type: "call",
    customer: "Retail Plus",
    description: "Discovery call - identified pain points",
    time: "3 days ago",
    outcome: "Qualified lead",
  },
];

const customers = [
  {
    name: "TechCorp Solutions",
    status: "active",
    lastContact: "2 hours ago",
    value: 150000,
    healthScore: 92,
    nextAction: "Contract renewal discussion",
  },
  {
    name: "Global Industries",
    status: "active",
    lastContact: "Yesterday",
    value: 85000,
    healthScore: 88,
    nextAction: "Send proposal",
  },
  {
    name: "Startup Ventures",
    status: "prospect",
    lastContact: "2 days ago",
    value: 35000,
    healthScore: 65,
    nextAction: "Follow up on pricing",
  },
];

const CRMDashboard = () => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "call": return <Phone className="w-4 h-4" />;
      case "email": return <Mail className="w-4 h-4" />;
      case "meeting": return <Users className="w-4 h-4" />;
      case "note": return <MessageSquare className="w-4 h-4" />;
      default: return null;
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <Card className="p-6 bg-gradient-card border-border">
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-5 h-5" />
        <h3 className="text-xl font-bold">CRM Dashboard</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Active Customers</p>
          <p className="text-2xl font-bold">42</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">This Week's Activities</p>
          <p className="text-2xl font-bold text-blue-500">28</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Upcoming Follow-ups</p>
          <p className="text-2xl font-bold text-yellow-500">12</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Avg Health Score</p>
          <p className="text-2xl font-bold text-green-500">85</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-semibold mb-4">Recent Activities</h4>
          <div className="space-y-3">
            {mockActivities.map((activity) => (
              <Card key={activity.id} className="p-3 bg-background/50">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-primary/20 flex items-center justify-center flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h5 className="font-semibold text-sm">{activity.customer}</h5>
                      <Badge variant="outline" className="text-xs capitalize">
                        {activity.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{activity.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{activity.time}</span>
                      {activity.outcome && (
                        <>
                          <span>•</span>
                          <span className="text-green-500">{activity.outcome}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-4">Customer Health</h4>
          <div className="space-y-3">
            {customers.map((customer, index) => (
              <Card key={index} className="p-4 bg-background/50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h5 className="font-semibold mb-1">{customer.name}</h5>
                    <Badge variant="outline" className="text-xs capitalize">
                      {customer.status}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Health Score</p>
                    <p className={`text-lg font-bold ${getHealthColor(customer.healthScore)}`}>
                      {customer.healthScore}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Account Value</p>
                    <p className="font-semibold">${customer.value.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Last Contact</p>
                    <p className="font-semibold">{customer.lastContact}</p>
                  </div>
                </div>

                <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20 mb-3">
                  <p className="text-xs font-semibold text-blue-500 mb-1">Next Action</p>
                  <p className="text-sm">{customer.nextAction}</p>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Calendar className="w-3 h-3 mr-1" />
                    Schedule
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    View History
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Relationship Insights
        </h4>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• TechCorp Solutions engagement up 45% this quarter - strong renewal opportunity</li>
          <li>• Global Industries decision maker meeting scheduled - high probability close</li>
          <li>• Startup Ventures hasn't responded in 2 days - consider follow-up call</li>
        </ul>
      </div>
    </Card>
  );
};

export default CRMDashboard;
