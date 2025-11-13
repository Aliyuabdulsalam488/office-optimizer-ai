import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, CheckCircle, Info, XCircle, Shield, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface BuildingCodeCheckerProps {
  planId: string;
}

export const BuildingCodeChecker = ({ planId }: BuildingCodeCheckerProps) => {
  const [planData, setPlanData] = useState("");
  const [checking, setChecking] = useState(false);
  const [results, setResults] = useState("");
  const { toast } = useToast();

  const runCodeCheck = async () => {
    if (!planData.trim()) {
      toast({
        title: "Missing Data",
        description: "Please provide floor plan specifications",
        variant: "destructive",
      });
      return;
    }

    try {
      setChecking(true);
      setResults("");

      const systemPrompt = `You are a certified building code compliance expert specializing in US International Residential Code (IRC) and International Building Code (IBC). Your role is to review architectural plans for code compliance and safety violations.`;

      const userPrompt = `Perform a comprehensive building code compliance check on the following floor plan specifications:

${planData}

**Analyze and report on:**

## Critical Violations (Red Flags)
* Life safety issues
* Structural integrity concerns
* Fire safety violations
* Accessibility non-compliance (ADA)

## Code Compliance Issues
* Egress requirements (doors, windows, exits)
* Room dimension requirements
* Ceiling height minimums
* Stairway and railing specifications
* Ventilation and natural light requirements

## Recommendations
* Best practices for compliance
* Suggested modifications
* Alternative design approaches
* Cost-effective solutions

## Compliance Score
* Overall compliance rating (0-100%)
* Breakdown by category
* Priority of fixes (Critical, High, Medium, Low)

Format your response in clear markdown with specific code references (IRC/IBC sections).`;

      const { data, error } = await supabase.functions.invoke('floor-plan-ai', {
        body: {
          planId,
          action: 'code-check',
          systemPrompt,
          userPrompt,
        }
      });

      if (error) throw error;

      setResults(data.report || '');
      toast({
        title: "Code Check Complete",
        description: "Building code analysis is ready",
      });

    } catch (error: any) {
      console.error('Error checking building codes:', error);
      toast({
        title: "Check Failed",
        description: error.message || "Failed to complete code compliance check",
        variant: "destructive",
      });
    } finally {
      setChecking(false);
    }
  };

  const commonCodeChecks = [
    {
      title: "Egress Windows",
      icon: CheckCircle,
      description: "Bedrooms require >= 5.7 sq ft opening, >= 24\" high, >= 20\" wide",
      color: "text-blue-500"
    },
    {
      title: "Door Width",
      icon: Info,
      description: "Minimum 32\" clear width for accessibility",
      color: "text-green-500"
    },
    {
      title: "Hallway Width",
      icon: AlertTriangle,
      description: "Minimum 36\" width required",
      color: "text-yellow-500"
    },
    {
      title: "Ceiling Height",
      icon: Info,
      description: "Habitable rooms: 7'0\" minimum, Bathrooms: 6'8\" minimum",
      color: "text-blue-500"
    },
    {
      title: "Stair Dimensions",
      icon: AlertTriangle,
      description: "Max riser 7.75\", Min tread 10\", Handrails 34-38\" high",
      color: "text-yellow-500"
    },
    {
      title: "Smoke Alarms",
      icon: XCircle,
      description: "Required in each bedroom, outside sleeping areas, and each floor",
      color: "text-red-500"
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Building Code Compliance Checker</h3>
            <p className="text-sm text-muted-foreground">
              Automated analysis of IRC/IBC compliance with actionable recommendations
            </p>
          </div>
        </div>

        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            This tool checks against US International Residential Code (IRC) and International Building Code (IBC).
            Always verify with local building authorities for jurisdiction-specific requirements.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Floor Plan Specifications
            </label>
            <Textarea
              placeholder="Describe your floor plan: room dimensions, door/window sizes, ceiling heights, stairways, etc.&#10;&#10;Example:&#10;- Master Bedroom: 12' x 14', one window 3' x 4'&#10;- Hallway: 36&quot; wide&#10;- Stairs: 13 steps, 7&quot; rise, 11&quot; tread"
              value={planData}
              onChange={(e) => setPlanData(e.target.value)}
              rows={10}
              className="font-mono text-sm"
            />
          </div>

          <Button
            onClick={runCodeCheck}
            disabled={checking || !planData.trim()}
            className="w-full"
          >
            {checking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking Building Codes...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Run Code Compliance Check
              </>
            )}
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h4 className="font-semibold mb-4">Common Code Requirements (IRC)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {commonCodeChecks.map((check, index) => {
            const Icon = check.icon;
            return (
              <Card key={index} className="p-4 bg-muted/30">
                <div className="flex items-start gap-3">
                  <Icon className={`w-5 h-5 mt-0.5 ${check.color}`} />
                  <div>
                    <h5 className="font-semibold text-sm mb-1">{check.title}</h5>
                    <p className="text-xs text-muted-foreground">{check.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Card>

      {results && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Compliance Report</h3>
            <Badge variant="outline">AI Analysis</Badge>
          </div>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown>{results}</ReactMarkdown>
          </div>
        </Card>
      )}
    </div>
  );
};
