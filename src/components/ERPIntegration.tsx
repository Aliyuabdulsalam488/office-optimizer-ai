import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ERPSystem {
  name: string;
  logo: string;
  description: string;
}

const erpSystems: ERPSystem[] = [
  {
    name: "SAP",
    logo: "🔷",
    description: "Enterprise resource planning",
  },
  {
    name: "Oracle",
    logo: "🔴",
    description: "Cloud ERP solutions",
  },
  {
    name: "QuickBooks",
    logo: "💚",
    description: "Small business accounting",
  },
  {
    name: "Xero",
    logo: "🔵",
    description: "Online accounting software",
  },
  {
    name: "NetSuite",
    logo: "🟠",
    description: "Cloud business software",
  },
  {
    name: "Microsoft Dynamics",
    logo: "🟦",
    description: "Business applications",
  },
];

interface ERPIntegrationProps {
  serviceType: string;
}

const ERPIntegration = ({ serviceType }: ERPIntegrationProps) => {
  const [selectedERP, setSelectedERP] = useState<string>("");
  const [apiKey, setApiKey] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  const handleConnect = () => {
    if (!selectedERP || !apiKey) {
      toast({
        title: "Missing Information",
        description: "Please select an ERP system and enter your API key",
        variant: "destructive",
      });
      return;
    }

    setIsConnected(true);
    toast({
      title: "ERP Connected",
      description: `Successfully connected to ${selectedERP}`,
    });
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setSelectedERP("");
    setApiKey("");
    toast({
      title: "Disconnected",
      description: "ERP integration has been disconnected",
    });
  };

  return (
    <Card className="p-6 bg-gradient-card border-border">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Link2 className="w-5 h-5" />
        ERP Integration
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        Connect your ERP system to sync financial data with {serviceType}
      </p>

      {!isConnected ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {erpSystems.map((erp, index) => (
              <div
                key={index}
                onClick={() => setSelectedERP(erp.name)}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all text-center ${
                  selectedERP === erp.name
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="text-3xl mb-2">{erp.logo}</div>
                <p className="text-sm font-semibold">{erp.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {erp.description}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="erp-select">Select ERP System</Label>
            <Select value={selectedERP} onValueChange={setSelectedERP}>
              <SelectTrigger id="erp-select">
                <SelectValue placeholder="Choose your ERP system" />
              </SelectTrigger>
              <SelectContent>
                {erpSystems.map((erp) => (
                  <SelectItem key={erp.name} value={erp.name}>
                    {erp.logo} {erp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="api-key">API Key / Connection String</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Enter your ERP API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Your API key is encrypted and stored securely
            </p>
          </div>

          <Button
            onClick={handleConnect}
            className="w-full bg-gradient-primary"
            disabled={!selectedERP || !apiKey}
          >
            Connect ERP System
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 p-4 bg-primary/10 rounded-lg border border-primary/20">
            <CheckCircle2 className="w-6 h-6 text-primary" />
            <div>
              <p className="font-semibold">Connected to {selectedERP}</p>
              <p className="text-sm text-muted-foreground">
                Financial data is now synced
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 bg-background/50 rounded-lg">
            <div>
              <p className="text-xs text-muted-foreground">Last Sync</p>
              <p className="text-sm font-semibold">Just now</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <p className="text-sm font-semibold text-primary">Active</p>
            </div>
          </div>

          <Button
            onClick={handleDisconnect}
            variant="outline"
            className="w-full"
          >
            Disconnect
          </Button>
        </div>
      )}
    </Card>
  );
};

export default ERPIntegration;
