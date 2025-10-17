import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, DollarSign, Calendar, User } from "lucide-react";

interface Deal {
  id: string;
  title: string;
  company: string;
  value: number;
  stage: string;
  probability: number;
  closeDate: string;
  owner: string;
}

const mockDeals: Deal[] = [
  {
    id: "1",
    title: "Enterprise Software License",
    company: "TechCorp Solutions",
    value: 150000,
    stage: "Negotiation",
    probability: 75,
    closeDate: "2025-11-15",
    owner: "Sarah Johnson",
  },
  {
    id: "2",
    title: "Annual Service Contract",
    company: "Global Industries",
    value: 85000,
    stage: "Proposal",
    probability: 60,
    closeDate: "2025-11-30",
    owner: "John Smith",
  },
  {
    id: "3",
    title: "Cloud Migration Project",
    company: "Startup Ventures",
    value: 220000,
    stage: "Discovery",
    probability: 40,
    closeDate: "2025-12-20",
    owner: "Mike Davis",
  },
  {
    id: "4",
    title: "Training & Consulting",
    company: "Retail Plus",
    value: 45000,
    stage: "Negotiation",
    probability: 80,
    closeDate: "2025-10-31",
    owner: "Sarah Johnson",
  },
];

const stages = [
  { name: "Discovery", deals: 2, value: 265000 },
  { name: "Qualification", deals: 3, value: 340000 },
  { name: "Proposal", deals: 4, value: 420000 },
  { name: "Negotiation", deals: 2, value: 195000 },
  { name: "Closed Won", deals: 8, value: 890000 },
];

const PipelineTracking = () => {
  const totalValue = mockDeals.reduce((sum, deal) => sum + deal.value, 0);
  const weightedValue = mockDeals.reduce((sum, deal) => sum + (deal.value * deal.probability / 100), 0);

  const getProbabilityColor = (prob: number) => {
    if (prob >= 70) return "text-green-500";
    if (prob >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <Card className="p-6 bg-gradient-card border-border">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5" />
        <h3 className="text-xl font-bold">Sales Pipeline</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Pipeline Value</p>
          <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Weighted Value</p>
          <p className="text-2xl font-bold text-green-500">${Math.round(weightedValue).toLocaleString()}</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Active Deals</p>
          <p className="text-2xl font-bold">{mockDeals.length}</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Avg Deal Size</p>
          <p className="text-2xl font-bold">${Math.round(totalValue / mockDeals.length).toLocaleString()}</p>
        </Card>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-semibold mb-4">Pipeline by Stage</h4>
        <div className="space-y-3">
          {stages.map((stage, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{stage.name}</span>
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground">{stage.deals} deals</span>
                  <span className="font-semibold">${stage.value.toLocaleString()}</span>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-gradient-primary h-2 rounded-full transition-all"
                  style={{ width: `${(stage.value / 890000) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <h4 className="text-sm font-semibold mb-4">Active Opportunities</h4>
      <div className="space-y-3">
        {mockDeals.map((deal) => (
          <Card key={deal.id} className="p-4 bg-background/50 border-border hover:border-primary/50 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h5 className="font-semibold mb-1">{deal.title}</h5>
                <p className="text-sm text-muted-foreground">{deal.company}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">${deal.value.toLocaleString()}</p>
                <Badge variant="outline" className="mt-1">{deal.stage}</Badge>
              </div>
            </div>

            <div className="space-y-3 mb-3">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Win Probability</span>
                  <span className={`font-semibold ${getProbabilityColor(deal.probability)}`}>
                    {deal.probability}%
                  </span>
                </div>
                <Progress value={deal.probability} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Expected Close</p>
                    <p className="font-medium">{deal.closeDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Deal Owner</p>
                    <p className="font-medium">{deal.owner}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1">
                Update Stage
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                View Details
              </Button>
              <Button size="sm" variant="outline">
                <DollarSign className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};

export default PipelineTracking;
