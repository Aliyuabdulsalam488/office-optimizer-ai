import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Search, Plus, Mail, Phone, Building, Star } from "lucide-react";

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: "new" | "contacted" | "qualified" | "proposal" | "negotiation";
  score: number;
  value: number;
  source: string;
  assignedTo: string;
}

const mockLeads: Lead[] = [
  {
    id: "1",
    name: "Jennifer Martinez",
    company: "TechCorp Solutions",
    email: "j.martinez@techcorp.com",
    phone: "+1 (555) 234-5678",
    status: "qualified",
    score: 85,
    value: 75000,
    source: "Website",
    assignedTo: "Sarah Johnson",
  },
  {
    id: "2",
    name: "Michael Chen",
    company: "Global Industries",
    email: "m.chen@global.com",
    phone: "+1 (555) 345-6789",
    status: "proposal",
    score: 92,
    value: 120000,
    source: "Referral",
    assignedTo: "John Smith",
  },
  {
    id: "3",
    name: "Emma Williams",
    company: "Startup Ventures",
    email: "emma@startup.io",
    phone: "+1 (555) 456-7890",
    status: "new",
    score: 65,
    value: 35000,
    source: "LinkedIn",
    assignedTo: "Mike Davis",
  },
];

const LeadManagement = () => {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "contacted": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "qualified": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "proposal": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "negotiation": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      default: return "bg-muted";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === "new").length,
    qualified: leads.filter(l => l.status === "qualified").length,
    totalValue: leads.reduce((sum, l) => sum + l.value, 0),
  };

  return (
    <Card className="p-6 bg-gradient-card border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          <h3 className="text-xl font-bold">Lead Management</h3>
        </div>
        <Button className="bg-gradient-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Lead
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Total Leads</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">New Leads</p>
          <p className="text-2xl font-bold text-blue-500">{stats.new}</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Qualified</p>
          <p className="text-2xl font-bold text-green-500">{stats.qualified}</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Total Value</p>
          <p className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</p>
        </Card>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search leads..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="qualified">Qualified</TabsTrigger>
          <TabsTrigger value="proposal">Proposal</TabsTrigger>
          <TabsTrigger value="hot">Hot Leads</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4 space-y-3">
          {filteredLeads.map((lead) => (
            <Card key={lead.id} className="p-4 bg-background/50 border-border hover:border-primary/50 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                    {lead.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-semibold">{lead.name}</h4>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Building className="w-3 h-3" />
                      {lead.company}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="text-right mr-2">
                    <p className="text-xs text-muted-foreground">Lead Score</p>
                    <div className="flex items-center gap-1">
                      <Star className={`w-4 h-4 fill-current ${getScoreColor(lead.score)}`} />
                      <p className={`text-sm font-bold ${getScoreColor(lead.score)}`}>{lead.score}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(lead.status)}>
                    {lead.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="truncate">{lead.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{lead.phone}</span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Potential Value</p>
                  <p className="text-sm font-semibold">${lead.value.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Source</p>
                  <p className="text-sm font-semibold">{lead.source}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <div className="text-sm text-muted-foreground">
                  Assigned to: <span className="font-medium text-foreground">{lead.assignedTo}</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Contact</Button>
                  <Button size="sm" variant="outline">View Details</Button>
                  <Button size="sm" className="bg-gradient-primary">Move to Next Stage</Button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="new">
          <p className="text-sm text-muted-foreground text-center py-8">
            {leads.filter(l => l.status === "new").length} new leads to review
          </p>
        </TabsContent>

        <TabsContent value="qualified">
          <p className="text-sm text-muted-foreground text-center py-8">
            {leads.filter(l => l.status === "qualified").length} qualified leads
          </p>
        </TabsContent>

        <TabsContent value="proposal">
          <p className="text-sm text-muted-foreground text-center py-8">
            {leads.filter(l => l.status === "proposal").length} proposals sent
          </p>
        </TabsContent>

        <TabsContent value="hot">
          <p className="text-sm text-muted-foreground text-center py-8">
            {leads.filter(l => l.score >= 80).length} hot leads (score ≥ 80)
          </p>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default LeadManagement;
