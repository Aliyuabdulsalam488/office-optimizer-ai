import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Plus, Star, Target, AlertCircle } from "lucide-react";

interface Review {
  id: string;
  employeeName: string;
  position: string;
  reviewPeriod: string;
  overallScore: number;
  status: "completed" | "pending" | "overdue";
  strengths: string[];
  areas: string[];
  goals: number;
}

const mockReviews: Review[] = [
  {
    id: "1",
    employeeName: "John Smith",
    position: "Senior Developer",
    reviewPeriod: "Q3 2025",
    overallScore: 4.5,
    status: "completed",
    strengths: ["Technical expertise", "Team collaboration"],
    areas: ["Time management", "Documentation"],
    goals: 4,
  },
  {
    id: "2",
    employeeName: "Emily Davis",
    position: "Marketing Manager",
    reviewPeriod: "Q3 2025",
    overallScore: 0,
    status: "pending",
    strengths: [],
    areas: [],
    goals: 3,
  },
  {
    id: "3",
    employeeName: "Robert Wilson",
    position: "Sales Representative",
    reviewPeriod: "Q2 2025",
    overallScore: 3.8,
    status: "overdue",
    strengths: ["Client relationships"],
    areas: ["Follow-up", "CRM usage"],
    goals: 5,
  },
];

const PerformanceReviews = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "pending": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "overdue": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-muted";
    }
  };

  const stats = {
    completed: mockReviews.filter(r => r.status === "completed").length,
    pending: mockReviews.filter(r => r.status === "pending").length,
    overdue: mockReviews.filter(r => r.status === "overdue").length,
    avgScore: (mockReviews.filter(r => r.overallScore > 0).reduce((sum, r) => sum + r.overallScore, 0) / mockReviews.filter(r => r.overallScore > 0).length).toFixed(1),
  };

  return (
    <Card className="p-6 bg-gradient-card border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          <h3 className="text-xl font-bold">Performance Reviews</h3>
        </div>
        <Button className="bg-gradient-primary">
          <Plus className="w-4 h-4 mr-2" />
          New Review
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Completed</p>
          <p className="text-2xl font-bold text-green-500">{stats.completed}</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Overdue</p>
          <p className="text-2xl font-bold text-red-500">{stats.overdue}</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Avg Score</p>
          <p className="text-2xl font-bold">{stats.avgScore}</p>
        </Card>
      </div>

      <div className="space-y-3">
        {mockReviews.map((review) => (
          <Card key={review.id} className="p-4 bg-background/50 border-border hover:border-primary/50 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold mb-1">{review.employeeName}</h4>
                <p className="text-sm text-muted-foreground">{review.position}</p>
              </div>
              <Badge className={getStatusColor(review.status)}>
                {review.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
              <div>
                <p className="text-xs text-muted-foreground">Review Period</p>
                <p className="text-sm font-semibold">{review.reviewPeriod}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Overall Score</p>
                <div className="flex items-center gap-1">
                  {review.overallScore > 0 ? (
                    <>
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      <p className="text-sm font-semibold">{review.overallScore}</p>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">Not scored</p>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Goals Set</p>
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4 text-primary" />
                  <p className="text-sm font-semibold">{review.goals}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="text-sm font-semibold capitalize">{review.status}</p>
              </div>
            </div>

            {review.status === "completed" && (
              <div className="space-y-2 mb-3">
                <div className="p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                  <p className="text-xs font-semibold text-green-500 mb-1">Strengths</p>
                  <p className="text-sm">{review.strengths.join(", ")}</p>
                </div>
                <div className="p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <p className="text-xs font-semibold text-yellow-500 mb-1">Development Areas</p>
                  <p className="text-sm">{review.areas.join(", ")}</p>
                </div>
              </div>
            )}

            {review.status === "overdue" && (
              <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20 mb-3 flex items-center gap-2 text-sm text-red-500">
                <AlertCircle className="w-4 h-4" />
                Review is overdue. Please complete as soon as possible.
              </div>
            )}

            <div className="flex gap-2">
              {review.status === "completed" ? (
                <>
                  <Button size="sm" variant="outline" className="flex-1">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline">
                    Export
                  </Button>
                </>
              ) : (
                <>
                  <Button size="sm" className="flex-1 bg-gradient-primary">
                    Complete Review
                  </Button>
                  <Button size="sm" variant="outline">
                    Reschedule
                  </Button>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};

export default PerformanceReviews;
