import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { FileSpreadsheet, AlertTriangle, CheckCircle, X } from "lucide-react";
import { useState } from "react";

interface Duplicate {
  id: string;
  originalId: string;
  duplicateId: string;
  matchScore: number;
  fields: string[];
  selected: boolean;
}

const mockDuplicates: Duplicate[] = [
  {
    id: "1",
    originalId: "CUST-001",
    duplicateId: "CUST-457",
    matchScore: 98,
    fields: ["name", "email", "phone"],
    selected: false,
  },
  {
    id: "2",
    originalId: "PROD-123",
    duplicateId: "PROD-891",
    matchScore: 95,
    fields: ["sku", "description"],
    selected: false,
  },
  {
    id: "3",
    originalId: "INV-2024-001",
    duplicateId: "INV-2024-442",
    matchScore: 92,
    fields: ["invoice_number", "date", "amount"],
    selected: false,
  },
];

const DuplicateDetection = () => {
  const [duplicates, setDuplicates] = useState(mockDuplicates);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setDuplicates(duplicates.map(d => ({ ...d, selected: newSelectAll })));
  };

  const handleSelect = (id: string) => {
    setDuplicates(duplicates.map(d => 
      d.id === id ? { ...d, selected: !d.selected } : d
    ));
  };

  const getScoreColor = (score: number) => {
    if (score >= 95) return "text-red-500";
    if (score >= 85) return "text-yellow-500";
    return "text-green-500";
  };

  const selectedCount = duplicates.filter(d => d.selected).length;

  return (
    <Card className="p-6 bg-gradient-card border-border">
      <div className="flex items-center gap-2 mb-6">
        <FileSpreadsheet className="w-5 h-5" />
        <h3 className="text-xl font-bold">Duplicate Detection</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Duplicates Found</p>
          <p className="text-3xl font-bold text-red-500">{duplicates.length}</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Selected for Removal</p>
          <p className="text-3xl font-bold text-yellow-500">{selectedCount}</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Total Records</p>
          <p className="text-3xl font-bold">8,542</p>
        </Card>
      </div>

      <div className="flex items-center justify-between mb-4 p-3 bg-background/50 rounded-lg border">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="select-all"
            checked={selectAll}
            onCheckedChange={handleSelectAll}
          />
          <label
            htmlFor="select-all"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Select All Duplicates
          </label>
        </div>
        <Badge variant="outline">
          {selectedCount} selected
        </Badge>
      </div>

      <div className="space-y-3 mb-6">
        {duplicates.map((duplicate) => (
          <Card key={duplicate.id} className="p-4 bg-background/50 border-border hover:border-primary/50 transition-all">
            <div className="flex items-start gap-3">
              <Checkbox
                checked={duplicate.selected}
                onCheckedChange={() => handleSelect(duplicate.id)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h5 className="font-semibold text-sm mb-1">Duplicate Pair Detected</h5>
                    <p className="text-xs text-muted-foreground">
                      Original: <span className="font-medium text-foreground">{duplicate.originalId}</span>
                      {" → "}
                      Duplicate: <span className="font-medium text-foreground">{duplicate.duplicateId}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-1">Match Score</p>
                    <p className={`text-lg font-bold ${getScoreColor(duplicate.matchScore)}`}>
                      {duplicate.matchScore}%
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <p className="text-xs text-muted-foreground">Matching fields:</p>
                  {duplicate.fields.map((field, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {field}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    Compare Records
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Merge Data
                  </Button>
                  <Button size="sm" variant="outline">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedCount > 0 && (
        <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-500" />
          <p className="text-sm text-yellow-500">
            {selectedCount} duplicate(s) will be removed. This action cannot be undone.
          </p>
        </div>
      )}

      <div className="flex gap-3">
        <Button 
          className="flex-1 bg-gradient-primary"
          disabled={selectedCount === 0}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Remove Selected ({selectedCount})
        </Button>
        <Button variant="outline">
          Scan Again
        </Button>
        <Button variant="outline">
          Export Report
        </Button>
      </div>
    </Card>
  );
};

export default DuplicateDetection;
