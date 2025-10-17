import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, PieChart, TrendingUp, Database } from "lucide-react";

interface FieldProfile {
  name: string;
  type: string;
  completeness: number;
  uniqueness: number;
  nullCount: number;
  distinctValues: number;
  topValues: { value: string; count: number }[];
}

const mockProfiles: FieldProfile[] = [
  {
    name: "customer_id",
    type: "integer",
    completeness: 100,
    uniqueness: 100,
    nullCount: 0,
    distinctValues: 8542,
    topValues: [],
  },
  {
    name: "email",
    type: "string",
    completeness: 97,
    uniqueness: 98,
    nullCount: 234,
    distinctValues: 8308,
    topValues: [
      { value: "gmail.com", count: 3421 },
      { value: "outlook.com", count: 2134 },
      { value: "yahoo.com", count: 1523 },
    ],
  },
  {
    name: "status",
    type: "string",
    completeness: 100,
    uniqueness: 3,
    nullCount: 0,
    distinctValues: 3,
    topValues: [
      { value: "active", count: 5234 },
      { value: "pending", count: 2156 },
      { value: "inactive", count: 1152 },
    ],
  },
];

const DataProfiling = () => {
  const stats = {
    totalFields: mockProfiles.length,
    avgCompleteness: Math.round(mockProfiles.reduce((sum, p) => sum + p.completeness, 0) / mockProfiles.length),
    totalRecords: 8542,
    dataTypes: new Set(mockProfiles.map(p => p.type)).size,
  };

  return (
    <Card className="p-6 bg-gradient-card border-border">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5" />
        <h3 className="text-xl font-bold">Data Profiling</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Total Fields</p>
          <p className="text-2xl font-bold">{stats.totalFields}</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Avg Completeness</p>
          <p className="text-2xl font-bold text-green-500">{stats.avgCompleteness}%</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Total Records</p>
          <p className="text-2xl font-bold">{stats.totalRecords.toLocaleString()}</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Data Types</p>
          <p className="text-2xl font-bold">{stats.dataTypes}</p>
        </Card>
      </div>

      <div className="space-y-4 mb-6">
        {mockProfiles.map((profile, index) => (
          <Card key={index} className="p-4 bg-background/50">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h5 className="font-semibold text-lg mb-1">{profile.name}</h5>
                <Badge variant="outline" className="text-xs">
                  {profile.type}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Database className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Completeness</p>
                <p className="text-sm font-semibold">{profile.completeness}%</p>
                <Progress value={profile.completeness} className="h-1 mt-1" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Uniqueness</p>
                <p className="text-sm font-semibold">{profile.uniqueness}%</p>
                <Progress value={profile.uniqueness} className="h-1 mt-1" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Null Count</p>
                <p className="text-sm font-semibold">{profile.nullCount}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Distinct Values</p>
                <p className="text-sm font-semibold">{profile.distinctValues.toLocaleString()}</p>
              </div>
            </div>

            {profile.topValues.length > 0 && (
              <div className="p-3 bg-background rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <PieChart className="w-4 h-4 text-muted-foreground" />
                  <p className="text-xs font-semibold text-muted-foreground">Top Values</p>
                </div>
                <div className="space-y-2">
                  {profile.topValues.map((tv, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="font-mono">{tv.value}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{tv.count.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground">
                          ({Math.round((tv.count / stats.totalRecords) * 100)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 mb-4">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <h4 className="font-semibold mb-1">Profiling Insights</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Average field completeness is {stats.avgCompleteness}%</li>
              <li>• {mockProfiles.filter(p => p.completeness < 100).length} fields have missing values</li>
              <li>• Dataset contains {stats.dataTypes} different data types</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button className="flex-1 bg-gradient-primary">
          Generate Full Report
        </Button>
        <Button variant="outline">
          Export Statistics
        </Button>
        <Button variant="outline">
          Visualize Data
        </Button>
      </div>
    </Card>
  );
};

export default DataProfiling;
