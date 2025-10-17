import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FileText, AlertCircle, CheckCircle, Clock, Search, Plus } from "lucide-react";
import { useState } from "react";

interface Contract {
  id: string;
  title: string;
  supplier: string;
  value: number;
  startDate: string;
  endDate: string;
  status: "active" | "expiring" | "expired";
  renewalDue: number; // days
}

const mockContracts: Contract[] = [
  {
    id: "1",
    title: "Raw Materials Supply Agreement",
    supplier: "ABC Manufacturing Co.",
    value: 500000,
    startDate: "2024-01-15",
    endDate: "2025-01-15",
    status: "expiring",
    renewalDue: 45,
  },
  {
    id: "2",
    title: "Component Procurement Contract",
    supplier: "Global Supplies Inc.",
    value: 350000,
    startDate: "2023-06-01",
    endDate: "2025-06-01",
    status: "active",
    renewalDue: 180,
  },
  {
    id: "3",
    title: "Equipment Maintenance Service",
    supplier: "TechService Pro",
    value: 120000,
    startDate: "2023-03-01",
    endDate: "2024-03-01",
    status: "expired",
    renewalDue: -30,
  },
];

const ContractManagement = () => {
  const [contracts, setContracts] = useState<Contract[]>(mockContracts);
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "expiring": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "expired": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-muted";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="w-4 h-4" />;
      case "expiring": return <Clock className="w-4 h-4" />;
      case "expired": return <AlertCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const filteredContracts = contracts.filter(contract =>
    contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = contracts.filter(c => c.status === "active").length;
  const expiringCount = contracts.filter(c => c.status === "expiring").length;
  const totalValue = contracts.reduce((sum, c) => sum + c.value, 0);

  return (
    <Card className="p-6 bg-gradient-card border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          <h3 className="text-xl font-bold">Contract Management</h3>
        </div>
        <Button className="bg-gradient-primary">
          <Plus className="w-4 h-4 mr-2" />
          New Contract
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Active Contracts</p>
          <p className="text-2xl font-bold">{activeCount}</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Expiring Soon</p>
          <p className="text-2xl font-bold text-yellow-500">{expiringCount}</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Total Value</p>
          <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
        </Card>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search contracts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-3">
        {filteredContracts.map((contract) => (
          <Card key={contract.id} className="p-4 bg-background/50 border-border hover:border-primary/50 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold mb-1">{contract.title}</h4>
                <p className="text-sm text-muted-foreground">{contract.supplier}</p>
              </div>
              <Badge className={`${getStatusColor(contract.status)} flex items-center gap-1`}>
                {getStatusIcon(contract.status)}
                {contract.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
              <div>
                <p className="text-xs text-muted-foreground">Contract Value</p>
                <p className="text-sm font-semibold">${contract.value.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Start Date</p>
                <p className="text-sm font-semibold">{contract.startDate}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">End Date</p>
                <p className="text-sm font-semibold">{contract.endDate}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Renewal Due</p>
                <p className={`text-sm font-semibold ${
                  contract.renewalDue < 0 ? "text-red-500" : 
                  contract.renewalDue < 60 ? "text-yellow-500" : ""
                }`}>
                  {contract.renewalDue > 0 ? `${contract.renewalDue} days` : "Overdue"}
                </p>
              </div>
            </div>

            {contract.status === "expiring" && (
              <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20 mb-3">
                <p className="text-sm text-yellow-500 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Contract expires in {contract.renewalDue} days. Consider renewal soon.
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1">
                View Details
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                Renew Contract
              </Button>
              <Button size="sm" variant="outline">
                Download
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};

export default ContractManagement;
