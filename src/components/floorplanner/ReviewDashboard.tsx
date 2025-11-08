import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface FloorPlan {
  id: string;
  title: string;
  description: string;
  status: string;
  project_type: string;
  area_sqm: number;
  created_at: string;
  updated_at: string;
}

interface ReviewDashboardProps {
  onSelectPlan: (planId: string) => void;
}

const ReviewDashboard = ({ onSelectPlan }: ReviewDashboardProps) => {
  const [plans, setPlans] = useState<FloorPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPlansForReview();
  }, []);

  const fetchPlansForReview = async () => {
    try {
      const { data, error } = await supabase
        .from("floor_plans")
        .select("*")
        .in("status", ["in_review", "draft"])
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setPlans(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading floor plans",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft": return "bg-secondary";
      case "in_review": return "bg-primary/20 text-primary";
      case "approved": return "bg-green-500/20 text-green-700";
      case "rejected": return "bg-destructive/20 text-destructive";
      default: return "bg-muted";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading plans for review..." />
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <Card className="p-12 text-center">
        <h3 className="text-xl font-semibold mb-2">No Plans to Review</h3>
        <p className="text-muted-foreground">
          There are no floor plans pending review at the moment
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <Card key={plan.id} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-semibold text-lg">{plan.title}</h3>
            <Badge className={getStatusColor(plan.status)}>
              {plan.status.replace('_', ' ')}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {plan.description || "No description"}
          </p>

          <div className="space-y-2 text-sm text-muted-foreground mb-4">
            {plan.project_type && (
              <div className="flex items-center gap-2">
                <span>📋</span>
                <span>{plan.project_type}</span>
              </div>
            )}
            {plan.area_sqm && (
              <div className="flex items-center gap-2">
                <span>📐</span>
                <span>{plan.area_sqm} m²</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(plan.updated_at).toLocaleDateString()}</span>
            </div>
          </div>

          <Button
            onClick={() => onSelectPlan(plan.id)}
            className="w-full"
            variant="outline"
          >
            <Eye className="w-4 h-4 mr-2" />
            Review Plan
          </Button>
        </Card>
      ))}
    </div>
  );
};

export default ReviewDashboard;
