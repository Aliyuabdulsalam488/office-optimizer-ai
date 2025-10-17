import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, AlertCircle, CheckCircle, TrendingUp, Upload } from "lucide-react";

interface QualityMetric {
  name: string;
  score: number;
  status: "good" | "warning" | "critical";
  issues: number;
}

const mockMetrics: QualityMetric[] = [
  { name: "Completeness", score: 92, status: "good", issues: 234 },
  { name: "Accuracy", score: 78, status: "warning", issues: 512 },
  { name: "Consistency", score: 65, status: "critical", issues: 845 },
  { name: "Uniqueness", score: 88, status: "good", issues: 156 },
  { name: "Timeliness", score: 95, status: "good", issues: 45 },
];

const DataQualityAssessment = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "good": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "warning": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "critical": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-muted";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good": return <CheckCircle className="w-4 h-4" />;
      case "warning": return <AlertCircle className="w-4 h-4" />;
      case "critical": return <AlertCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const overallScore = Math.round(mockMetrics.reduce((sum, m) => sum + m.score, 0) / mockMetrics.length);
  const totalIssues = mockMetrics.reduce((sum, m) => sum + m.issues, 0);

  return (
    <Card className="p-6 bg-gradient-card border-border">
      <div className="flex items-center gap-2 mb-6">
        <Search className="w-5 h-5" />
        <h3 className="text-xl font-bold">Data Quality Assessment</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Overall Quality Score</p>
          <p className="text-3xl font-bold">{overallScore}%</p>
          <Progress value={overallScore} className="mt-2" />
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Total Issues</p>
          <p className="text-3xl font-bold text-yellow-500">{totalIssues}</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Records Analyzed</p>
          <p className="text-3xl font-bold">125,430</p>
        </Card>
      </div>

      <div className="space-y-3 mb-6">
        <h4 className="text-sm font-semibold">Quality Dimensions</h4>
        {mockMetrics.map((metric, index) => (
          <Card key={index} className="p-4 bg-background/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-muted-foreground" />
                <div>
                  <h5 className="font-semibold">{metric.name}</h5>
                  <p className="text-xs text-muted-foreground">{metric.issues} issues found</p>
                </div>
              </div>
              <Badge className={`${getStatusColor(metric.status)} flex items-center gap-1`}>
                {getStatusIcon(metric.status)}
                {metric.status}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Quality Score</span>
                <span className="font-semibold">{metric.score}%</span>
              </div>
              <Progress value={metric.score} className="h-2" />
            </div>
          </Card>
        ))}
      </div>

      <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 mb-4">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Critical Issues Detected
        </h4>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-red-500">•</span>
            <span>845 consistency violations in "customer_address" field</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500">•</span>
            <span>512 potential accuracy issues in "phone_number" format</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-500">•</span>
            <span>234 missing values in critical fields</span>
          </li>
        </ul>
      </div>

      <div className="flex gap-3">
        <Button className="flex-1 bg-gradient-primary">
          <Upload className="w-4 h-4 mr-2" />
          Analyze New Dataset
        </Button>
        <Button variant="outline">
          Export Report
        </Button>
        <Button variant="outline">
          Auto-Fix Issues
        </Button>
      </div>
    </Card>
  );
};

export default DataQualityAssessment;
