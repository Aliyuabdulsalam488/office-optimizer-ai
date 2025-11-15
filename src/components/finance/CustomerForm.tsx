import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CurrencySelector } from "./CurrencySelector";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface CustomerFormProps {
  customer: any;
  onSuccess: () => void;
  onCancel: () => void;
}

const COUNTRIES = [
  "US", "GB", "CA", "AU", "DE", "FR", "IT", "ES", "NL", "BE", "CH", "AT", "SE", "NO", "DK", "FI",
  "JP", "CN", "IN", "SG", "HK", "KR", "TH", "ID", "MY", "PH", "VN", "AE", "SA", "IL", "TR",
  "BR", "MX", "AR", "CL", "CO", "PE", "ZA", "NG", "KE", "EG", "PL", "CZ", "RO", "GR", "PT"
];

export const CustomerForm = ({ customer, onSuccess, onCancel }: CustomerFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_type: customer?.customer_type || "individual",
    name: customer?.name || "",
    display_name: customer?.display_name || "",
    company_name: customer?.company_name || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
    address: customer?.address || "",
    country: customer?.country || "US",
    currency: customer?.currency || "USD",
    payment_terms: customer?.payment_terms || 30,
    opening_balance: customer?.opening_balance || 0,
    tax_id: customer?.tax_id || "",
    portal_enabled: customer?.portal_enabled || false,
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const dataToSave = {
        ...formData,
        user_id: user.id,
        opening_balance: Number(formData.opening_balance) || 0,
        payment_terms: Number(formData.payment_terms) || 30,
      };

      if (customer) {
        const { error } = await supabase
          .from("customers")
          .update(dataToSave)
          .eq("id", customer.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("customers").insert(dataToSave);
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Customer ${customer ? "updated" : "created"} successfully`,
      });
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Customer Type</Label>
        <Select value={formData.customer_type} onValueChange={(value) => setFormData({ ...formData, customer_type: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="individual">Individual</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="walk-in">Walk-in</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Name *</Label>
          <Input
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Customer name"
          />
        </div>
        <div>
          <Label>Display Name</Label>
          <Input
            value={formData.display_name}
            onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
            placeholder="Display name"
          />
        </div>
      </div>

      {formData.customer_type === "business" && (
        <div>
          <Label>Company Name</Label>
          <Input
            value={formData.company_name}
            onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
            placeholder="Company name"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="email@example.com"
          />
        </div>
        <div>
          <Label>Phone</Label>
          <Input
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+1234567890"
          />
        </div>
      </div>

      <div>
        <Label>Address</Label>
        <Textarea
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="Street address"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Country</Label>
          <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((country) => (
                <SelectItem key={country} value={country}>{country}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Currency *</Label>
          <CurrencySelector
            value={formData.currency}
            onValueChange={(value) => setFormData({ ...formData, currency: value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Payment Terms (days)</Label>
          <Input
            type="number"
            value={formData.payment_terms}
            onChange={(e) => setFormData({ ...formData, payment_terms: Number(e.target.value) })}
          />
        </div>
        <div>
          <Label>Opening Balance</Label>
          <Input
            type="number"
            step="0.01"
            value={formData.opening_balance}
            onChange={(e) => setFormData({ ...formData, opening_balance: Number(e.target.value) })}
          />
        </div>
      </div>

      <div>
        <Label>Tax ID</Label>
        <Input
          value={formData.tax_id}
          onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })}
          placeholder="Tax identification number"
        />
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={formData.portal_enabled}
          onCheckedChange={(checked) => setFormData({ ...formData, portal_enabled: checked })}
        />
        <Label>Enable Client Portal Access</Label>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : customer ? "Update Customer" : "Create Customer"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
