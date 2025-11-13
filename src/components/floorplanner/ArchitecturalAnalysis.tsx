import { useState } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, Info, Sparkles, FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import jsPDF from "jspdf";

interface ArchitecturalAnalysisProps {
  planId: string;
  canvas: FabricCanvas | null;
  planData: any;
}

const ArchitecturalAnalysis = ({ planId, canvas, planData }: ArchitecturalAnalysisProps) => {
  const [floorPlanData, setFloorPlanData] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [round1Report, setRound1Report] = useState<string>('');
  const [round2Report, setRound2Report] = useState<string>('');
  const { toast } = useToast();

  const exportToPDF = () => {
    if (!round1Report && !round2Report) {
      toast({
        title: "No analysis to export",
        description: "Please run an analysis first",
        variant: "destructive",
      });
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const maxWidth = pageWidth - 2 * margin;
    let yPosition = margin;

    // Title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Architectural Analysis Report", margin, yPosition);
    yPosition += 10;

    // Content
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const fullReport = round1Report + '\n\n' + round2Report;
    const lines = doc.splitTextToSize(fullReport, maxWidth);
    
    lines.forEach((line: string) => {
      if (yPosition > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
      doc.text(line, margin, yPosition);
      yPosition += 5;
    });

    doc.save("architectural-analysis-report.pdf");
    toast({
      title: "PDF Exported",
      description: "Your analysis report has been downloaded",
    });
  };

  const defaultJsonExample = `{
  "floorPlanName": "Modern Single-Story Ranch",
  "design_goal": "High Efficiency (Net-Zero Ready)",
  "rooms": [
    { "name": "Master Bedroom", "type": "Bedroom", "area_sqft": 180, "window_area_sqft": 15, "egress_width_in": 32, "wall_shared_with": "Laundry Room" },
    { "name": "Kitchen", "type": "Kitchen", "area_sqft": 150, "window_area_sqft": 18, "adjacent_to_entry": "Long Hallway", "clearance_at_island_in": 34 },
    { "name": "Flex Room", "type": "Office/Gym", "area_sqft": 120, "window_area_sqft": 10, "egress_width_in": 36, "is_habitable": true },
    { "name": "Living Room", "type": "Living", "area_sqft": 350, "window_area_sqft": 50, "connects_to_outdoor": true },
    { "name": "Laundry Room", "type": "Utility", "area_sqft": 60, "noise_level": "High", "wall_shared_with": "Master Bedroom", "door_type": "Pocket" }
  ],
  "circulation": {
    "hallway_width_in": 34,
    "main_exit_door_width_in": 36,
    "stair_riser_height_in": 7.7
  },
  "construction_metrics": {
    "total_gsf": 1500,
    "non_habitable_sqft": 350,
    "exterior_wall_linear_ft": 280
  }
}`;

  const runAnalysis = async () => {
    if (!floorPlanData.trim()) {
      toast({
        title: "Floor Plan Data Required",
        description: "Please provide floor plan data in JSON format",
        variant: "destructive",
      });
      return;
    }

    try {
      setAnalyzing(true);
      setRound1Report('');
      setRound2Report('');

      // Validate JSON
      let parsedData;
      try {
        parsedData = JSON.parse(floorPlanData);
      } catch (e) {
        throw new Error("Invalid JSON format. Please check your floor plan data.");
      }

      const systemPrompt = `You are a highly experienced, detail-oriented Senior Architectural Consultant specializing in high-efficiency residential design. Your task is to perform a two-round, iterative peer review of the provided floor plan data.

Your report must be strictly formatted in **Markdown** and adhere to the following structure for both rounds: **Compliance, Optimization, and Metrics**.

**Round 1:** Analyze the raw data and generate the initial report.
**Round 2:** Based on Round 1 findings, propose specific, impactful revisions, and then generate a **hypothetical re-analysis** of the modified plan, explicitly stating if and how the efficiency and compliance improved.

Base all findings strictly on the provided input data and industry-standard US residential building codes.`;

      const userPrompt = `Perform the two-round iterative analysis on the following floor plan data. The design goal is High Efficiency and Usability.

**Floor Plan Data (JSON):**

\`\`\`json
${floorPlanData}
\`\`\`

**Generate the report using this detailed format:**

## Iterative Analysis Report - Round 1 (Initial Review)

### 1.1 Critical Compliance & Error Detection
* [List of compliance issues/errors with US residential building codes]
* Check for: minimum room dimensions, egress requirements, door clearances, hallway widths, window-to-floor ratios
* Flag critical safety issues

### 1.2 Space Optimization & Technical Recommendations
* [High-value optimization suggestions]
* Analyze: room adjacencies, circulation efficiency, noise isolation, natural lighting
* Identify wasted space or inefficient layouts
* Suggest practical improvements

### 1.3 Project Metrics & Assessment
* **Total GSF:** [from data]
* **Habitable Area:** [calculated]
* **Circulation Efficiency:** [percentage of non-habitable to total]
* **Exterior Wall Ratio:** [linear ft per sqft]
* **Overall Assessment:** [Professional judgment on design quality]

---

## Iterative Analysis Report - Round 2 (Hypothetical Revision)

### 2.1 Proposed Design Revisions (3 Critical Changes)
* **Revision 1 (e.g., Noise Mitigation):** [Specific change - e.g., "Move Laundry Room away from Master Bedroom, add buffer hallway"]
* **Revision 2 (e.g., Circulation Improvement):** [Specific change - e.g., "Widen hallway from 34" to 42" for better accessibility"]
* **Revision 3 (e.g., Efficiency/Daylighting):** [Specific change - e.g., "Increase Kitchen window area from 18 sqft to 25 sqft"]

### 2.2 Hypothetical Modified Data Summary
* [List the specific JSON fields that would change due to the 3 revisions]
* Example: 'Master Bedroom: wall_shared_with changed from "Laundry Room" to "Hallway"'
* Example: 'Circulation: hallway_width_in changed from 34 to 42'

### 2.3 Re-Analysis of Revised Plan
* **Compliance:** [Did the revised plan pass all checks? Note specific improvements or any remaining issues]
* **Optimization:** [How did the changes improve flow, usability, and efficiency? Quantify improvements]
* **Metrics:** [Recalculated metrics based on hypothetical changes - show before/after comparison]

### 2.4 Comparative Summary & Final Judgment
* [Concise comparison of Round 1 vs. Round 2]
* [Percentage improvements in key metrics]
* [Final professional recommendation]
* [Overall grade: A+ to F]`;

      // Call the AI function
      const { data, error } = await supabase.functions.invoke('floor-plan-ai', {
        body: {
          planId,
          planData,
          action: 'architectural-analysis',
          floorPlanData: parsedData,
          systemPrompt,
          userPrompt
        }
      });

      if (error) throw error;

      // Split response into Round 1 and Round 2
      const fullReport = data.report || '';
      const round2Start = fullReport.indexOf('## Iterative Analysis Report - Round 2');
      
      if (round2Start !== -1) {
        setRound1Report(fullReport.substring(0, round2Start).trim());
        setRound2Report(fullReport.substring(round2Start).trim());
      } else {
        setRound1Report(fullReport);
      }

      toast({
        title: "Analysis Complete",
        description: "Two-round architectural analysis has been generated",
      });

    } catch (error: any) {
      console.error('Error running architectural analysis:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to generate architectural analysis",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Two-Round Architectural Peer Review</h3>
            <p className="text-sm text-muted-foreground mb-4">
              AI-powered architectural consultant performing comprehensive code compliance, space optimization, 
              and efficiency analysis with iterative revision recommendations.
            </p>
            <div className="flex gap-2 mb-4">
              <Badge variant="outline">Compliance Checking</Badge>
              <Badge variant="outline">Space Optimization</Badge>
              <Badge variant="outline">Metrics Analysis</Badge>
              <Badge variant="outline">Revision Planning</Badge>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Floor Plan Data (JSON Format)
            </label>
            <Textarea
              placeholder={`Paste your floor plan data in JSON format or use the example below:\n\n${defaultJsonExample}`}
              value={floorPlanData}
              onChange={(e) => setFloorPlanData(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Include rooms, circulation metrics, and construction data for comprehensive analysis
            </p>
          </div>

          <Button
            onClick={runAnalysis}
            disabled={analyzing}
            className="w-full bg-gradient-primary"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {analyzing ? "Analyzing Floor Plan..." : "Run Two-Round Analysis"}
          </Button>
        </div>
      </Card>

      {(round1Report || round2Report) && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Analysis Reports</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={exportToPDF}
            >
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
          <Tabs defaultValue="round1" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="round1" className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Round 1: Initial Review
              </TabsTrigger>
              <TabsTrigger value="round2" className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Round 2: Hypothetical Revision
              </TabsTrigger>
            </TabsList>

            <TabsContent value="round1" className="space-y-4">
              {round1Report ? (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown>{round1Report}</ReactMarkdown>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Info className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Round 1 analysis will appear here after running the analysis</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="round2" className="space-y-4">
              {round2Report ? (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown>{round2Report}</ReactMarkdown>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Info className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Round 2 analysis will appear here after running the analysis</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      )}
    </div>
  );
};

export default ArchitecturalAnalysis;
