import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Plus, AlertCircle, TrendingUp } from "lucide-react";

interface ValidationRule {
  id: string;
  name: string;
  field: string;
  condition: string;
  severity: "error" | "warning" | "info";
  violations: number;
  active: boolean;
}

const mockRules: ValidationRule[] = [
  {
    id: "1",
    name: "Email Format Validation",
    field: "email",
    condition: "Must match email pattern",
    severity: "error",
    violations: 234,
    active: true,
  },
  {
    id: "2",
    name: "Age Range Check",
    field: "age",
    condition: "Must be between 18 and 120",
    severity: "error",
    violations: 12,
    active: true,
  },
  {
    id: "3",
    name: "Phone Number Length",
    field: "phone",
    condition: "Must be 10 digits",
    severity: "warning",
    violations: 567,
    active: true,
  },
  {
    id: "4",
    name: "Postal Code Format",
    field: "postal_code",
    condition: "Must match region format",
    severity: "warning",
    violations: 89,
    active: true,
  },
  {
    id: "5",
    name: "Required Field Check",
    field: "company_name",
    condition: "Cannot be null or empty",
    severity: "error",
    violations: 0,
    active: true,
  },
];

const ValidationRules = () => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "error": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "warning": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "info": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default: return "bg-muted";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "error": return <AlertCircle className="w-4 h-4" />;
      case "warning": return <AlertCircle className="w-4 h-4" />;
      case "info": return <CheckCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const stats = {
    total: mockRules.length,
    active: mockRules.filter(r => r.active).length,
    violations: mockRules.reduce((sum, r) => sum + r.violations, 0),
    passing: mockRules.filter(r => r.violations === 0).length,
  };

  return (
    <Card className="p-6 bg-gradient-card border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <h3 className="text-xl font-bold">Validation Rules</h3>
        </div>
        <Button className="bg-gradient-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Rule
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Total Rules</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Active</p>
          <p className="text-2xl font-bold text-green-500">{stats.active}</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Total Violations</p>
          <p className="text-2xl font-bold text-red-500">{stats.violations}</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Passing</p>
          <p className="text-2xl font-bold text-green-500">{stats.passing}</p>
        </Card>
      </div>

      <div className="space-y-3 mb-6">
        {mockRules.map((rule) => (
          <Card key={rule.id} className="p-4 bg-background/50 border-border hover:border-primary/50 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h5 className="font-semibold mb-1">{rule.name}</h5>
                <p className="text-sm text-muted-foreground">
                  Field: <span className="font-medium text-foreground">{rule.field}</span>
                </p>
              </div>
              <Badge className={`${getSeverityColor(rule.severity)} flex items-center gap-1`}>
                {getSeverityIcon(rule.severity)}
                {rule.severity}
              </Badge>
            </div>

            <div className="p-3 bg-background rounded-lg border mb-3">
              <p className="text-xs text-muted-foreground mb-1">Validation Condition</p>
              <p className="text-sm font-mono">{rule.condition}</p>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Violations</p>
                  <p className={`text-lg font-bold ${rule.violations > 0 ? "text-red-500" : "text-green-500"}`}>
                    {rule.violations}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge variant="outline" className={rule.active ? "text-green-500" : "text-gray-500"}>
                    {rule.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              {rule.violations > 0 && (
                <div className="flex items-center gap-2 text-sm text-red-500">
                  <TrendingUp className="w-4 h-4" />
                  <span>Needs attention</span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1">
                View Violations
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                Edit Rule
              </Button>
              <Button size="sm" variant="outline">
                {rule.active ? "Disable" : "Enable"}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 mb-4">
        <h4 className="font-semibold mb-2">Validation Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Error Rules</p>
            <p className="text-lg font-bold text-red-500">
              {mockRules.filter(r => r.severity === "error").length}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Warning Rules</p>
            <p className="text-lg font-bold text-yellow-500">
              {mockRules.filter(r => r.severity === "warning").length}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Pass Rate</p>
            <p className="text-lg font-bold text-green-500">
              {Math.round((stats.passing / stats.total) * 100)}%
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button className="flex-1 bg-gradient-primary">
          Validate All Data
        </Button>
        <Button variant="outline">
          Export Rules
        </Button>
        <Button variant="outline">
          Import Rules
        </Button>
      </div>
    </Card>
  );
};

export default ValidationRules;
