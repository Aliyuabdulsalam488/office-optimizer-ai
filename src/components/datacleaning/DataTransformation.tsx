import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, ArrowRight, CheckCircle } from "lucide-react";

interface Transformation {
  id: string;
  name: string;
  type: "format" | "normalize" | "convert";
  before: string;
  after: string;
  affectedRecords: number;
}

const mockTransformations: Transformation[] = [
  {
    id: "1",
    name: "Phone Number Standardization",
    type: "format",
    before: "(555) 123-4567, 555.123.4567, 5551234567",
    after: "+1-555-123-4567",
    affectedRecords: 2341,
  },
  {
    id: "2",
    name: "Date Format Conversion",
    type: "convert",
    before: "MM/DD/YYYY, DD-MM-YYYY, YYYY.MM.DD",
    after: "YYYY-MM-DD (ISO 8601)",
    affectedRecords: 8542,
  },
  {
    id: "3",
    name: "Currency Normalization",
    type: "normalize",
    before: "$1,234.56, USD 1234.56, 1234.56 dollars",
    after: "1234.56 USD",
    affectedRecords: 1523,
  },
  {
    id: "4",
    name: "Address Standardization",
    type: "format",
    before: "st, street, St., STREET",
    after: "Street",
    affectedRecords: 4621,
  },
];

const DataTransformation = () => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "format": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "normalize": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "convert": return "bg-green-500/10 text-green-500 border-green-500/20";
      default: return "bg-muted";
    }
  };

  const stats = {
    total: mockTransformations.length,
    applied: 2,
    pending: 2,
    affectedRecords: mockTransformations.reduce((sum, t) => sum + t.affectedRecords, 0),
  };

  return (
    <Card className="p-6 bg-gradient-card border-border">
      <div className="flex items-center gap-2 mb-6">
        <Zap className="w-5 h-5" />
        <h3 className="text-xl font-bold">Data Transformation</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Total Rules</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Applied</p>
          <p className="text-2xl font-bold text-green-500">{stats.applied}</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Records Affected</p>
          <p className="text-2xl font-bold">{stats.affectedRecords.toLocaleString()}</p>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="format">Format</TabsTrigger>
          <TabsTrigger value="normalize">Normalize</TabsTrigger>
          <TabsTrigger value="convert">Convert</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4 space-y-3">
          {mockTransformations.map((transform) => (
            <Card key={transform.id} className="p-4 bg-background/50 border-border hover:border-primary/50 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h5 className="font-semibold mb-1">{transform.name}</h5>
                  <Badge className={getTypeColor(transform.type)}>
                    {transform.type}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Affected Records</p>
                  <p className="text-sm font-semibold">{transform.affectedRecords.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                  <p className="text-xs text-muted-foreground mb-1">Before</p>
                  <p className="text-sm font-mono">{transform.before}</p>
                </div>
                <div className="flex justify-center">
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <p className="text-xs text-muted-foreground mb-1">After</p>
                  <p className="text-sm font-mono">{transform.after}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" className="flex-1 bg-gradient-primary">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Apply Transform
                </Button>
                <Button size="sm" variant="outline">
                  Preview
                </Button>
                <Button size="sm" variant="outline">
                  Edit Rule
                </Button>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="format">
          <p className="text-sm text-muted-foreground text-center py-8">
            {mockTransformations.filter(t => t.type === "format").length} format transformations
          </p>
        </TabsContent>

        <TabsContent value="normalize">
          <p className="text-sm text-muted-foreground text-center py-8">
            {mockTransformations.filter(t => t.type === "normalize").length} normalization rules
          </p>
        </TabsContent>

        <TabsContent value="convert">
          <p className="text-sm text-muted-foreground text-center py-8">
            {mockTransformations.filter(t => t.type === "convert").length} conversion rules
          </p>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex gap-3">
        <Button className="flex-1 bg-gradient-primary">
          Apply All Transformations
        </Button>
        <Button variant="outline">
          Create New Rule
        </Button>
        <Button variant="outline">
          Import Rules
        </Button>
      </div>
    </Card>
  );
};

export default DataTransformation;
