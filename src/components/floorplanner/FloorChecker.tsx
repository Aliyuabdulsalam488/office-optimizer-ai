import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Canvas as FabricCanvas } from "fabric";

interface FloorCheckerProps {
  planId: string;
  canvas: FabricCanvas | null;
}

interface CheckIssue {
  severity: "info" | "warning" | "critical";
  title: string;
  description: string;
  suggestion?: string;
}

const FloorChecker = ({ planId, canvas }: FloorCheckerProps) => {
  const [checking, setChecking] = useState(false);
  const [issues, setIssues] = useState<CheckIssue[]>([]);
  const { toast } = useToast();

  const runChecks = async () => {
    if (!canvas) {
      toast({
        title: "Canvas not ready",
        description: "Please wait for the editor to load",
        variant: "destructive",
      });
      return;
    }

    try {
      setChecking(true);
      const canvasData = canvas.toJSON();

      const { data, error } = await supabase.functions.invoke("floor-plan-ai", {
        body: {
          planId,
          canvasData,
          action: "check",
        },
      });

      if (error) throw error;

      setIssues(data.issues || []);

      // Save check results to database
      await supabase.from("floor_plan_checks").insert({
        floor_plan_id: planId,
        check_type: "ai_analysis",
        issues_found: data.issues,
        ai_suggestions: data.suggestions,
      });

      toast({
        title: "Check complete",
        description: `Found ${data.issues?.length || 0} potential issues`,
      });
    } catch (error: any) {
      toast({
        title: "Error running checks",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setChecking(false);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="w-5 h-5 text-destructive" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Info className="w-5 h-5 text-primary" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-destructive/20 text-destructive";
      case "warning":
        return "bg-yellow-500/20 text-yellow-700";
      default:
        return "bg-primary/20 text-primary";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">AI Floor Plan Checker</h3>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Run automated checks to identify potential issues with room access, dimensions, 
          door conflicts, and basic compliance
        </p>

        <Button
          onClick={runChecks}
          disabled={checking}
          className="bg-gradient-primary"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          {checking ? "Running Checks..." : "Run Floor Check"}
        </Button>
      </Card>

      {issues.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold">Check Results</h4>
          {issues.map((issue, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start gap-3">
                {getSeverityIcon(issue.severity)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h5 className="font-semibold">{issue.title}</h5>
                    <Badge className={getSeverityColor(issue.severity)}>
                      {issue.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {issue.description}
                  </p>
                  {issue.suggestion && (
                    <p className="text-sm text-primary">
                      💡 Suggestion: {issue.suggestion}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {issues.length === 0 && (
        <Card className="p-12 text-center">
          <CheckCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            No checks run yet. Click "Run Floor Check" to analyze your floor plan.
          </p>
        </Card>
      )}
    </div>
  );
};

export default FloorChecker;
