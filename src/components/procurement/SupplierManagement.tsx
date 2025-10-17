import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Star, TrendingUp, AlertCircle, CheckCircle, Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Supplier {
  id: string;
  name: string;
  rating: number;
  status: "active" | "pending" | "inactive";
  category: string;
  totalSpend: number;
  onTimeDelivery: number;
  qualityScore: number;
  riskLevel: "low" | "medium" | "high";
}

const mockSuppliers: Supplier[] = [
  {
    id: "1",
    name: "ABC Manufacturing Co.",
    rating: 4.5,
    status: "active",
    category: "Raw Materials",
    totalSpend: 145000,
    onTimeDelivery: 96,
    qualityScore: 94,
    riskLevel: "low",
  },
  {
    id: "2",
    name: "Global Supplies Inc.",
    rating: 4.2,
    status: "active",
    category: "Components",
    totalSpend: 89000,
    onTimeDelivery: 88,
    qualityScore: 91,
    riskLevel: "medium",
  },
  {
    id: "3",
    name: "Premium Parts Ltd.",
    rating: 4.8,
    status: "active",
    category: "Specialized Equipment",
    totalSpend: 203000,
    onTimeDelivery: 98,
    qualityScore: 97,
    riskLevel: "low",
  },
];

const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "medium": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "high": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-muted";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending": return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "inactive": return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="p-6 bg-gradient-card border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          <h3 className="text-xl font-bold">Supplier Management</h3>
        </div>
        <Button className="bg-gradient-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Supplier
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search suppliers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({suppliers.length})</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="risk">High Risk</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4 space-y-3">
          {filteredSuppliers.map((supplier) => (
            <Card key={supplier.id} className="p-4 bg-background/50 border-border hover:border-primary/50 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{supplier.name}</h4>
                    {getStatusIcon(supplier.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">{supplier.category}</p>
                </div>
                <Badge className={getRiskColor(supplier.riskLevel)}>
                  {supplier.riskLevel} risk
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div>
                  <p className="text-xs text-muted-foreground">Total Spend</p>
                  <p className="text-sm font-semibold">${supplier.totalSpend.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">On-Time Delivery</p>
                  <p className="text-sm font-semibold">{supplier.onTimeDelivery}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Quality Score</p>
                  <p className="text-sm font-semibold">{supplier.qualityScore}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Rating</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    <p className="text-sm font-semibold">{supplier.rating}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  View Details
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Create PO
                </Button>
                <Button size="sm" variant="outline">
                  <TrendingUp className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="active">
          <p className="text-sm text-muted-foreground text-center py-8">
            {suppliers.filter(s => s.status === "active").length} active suppliers
          </p>
        </TabsContent>

        <TabsContent value="pending">
          <p className="text-sm text-muted-foreground text-center py-8">
            No pending suppliers
          </p>
        </TabsContent>

        <TabsContent value="risk">
          <p className="text-sm text-muted-foreground text-center py-8">
            {suppliers.filter(s => s.riskLevel === "high").length} high-risk suppliers
          </p>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default SupplierManagement;
