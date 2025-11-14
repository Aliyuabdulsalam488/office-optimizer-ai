import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VendorFormProps {
  vendor?: any;
  onClose: () => void;
}

const VendorForm = ({ vendor, onClose }: VendorFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    tin: "",
    category: "",
    status: "active",
    performance_rating: 0,
    bank_details: {
      bank_name: "",
      account_number: "",
      account_name: "",
      swift_code: ""
    }
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (vendor) {
      setFormData({
        name: vendor.name || "",
        email: vendor.email || "",
        phone: vendor.phone || "",
        address: vendor.address || "",
        tin: vendor.tin || "",
        category: vendor.category || "",
        status: vendor.status || "active",
        performance_rating: vendor.performance_rating || 0,
        bank_details: vendor.bank_details || {
          bank_name: "",
          account_number: "",
          account_name: "",
          swift_code: ""
        }
      });
    }
  }, [vendor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      if (vendor) {
        const { error } = await supabase
          .from("vendors")
          .update(formData)
          .eq("id", vendor.id);

        if (error) throw error;
        toast({ title: "Vendor updated successfully" });
      } else {
        const { error } = await supabase
          .from("vendors")
          .insert([{ ...formData, created_by: user.id }]);

        if (error) throw error;
        toast({ title: "Vendor created successfully" });
      }

      onClose();
    } catch (error: any) {
      toast({
        title: "Error saving vendor",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Vendor Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="tin">TIN</Label>
          <Input
            id="tin"
            value={formData.tin}
            onChange={(e) => setFormData({ ...formData, tin: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="materials">Materials</SelectItem>
              <SelectItem value="services">Services</SelectItem>
              <SelectItem value="equipment">Equipment</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="consulting">Consulting</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          rows={2}
        />
      </div>

      <div className="border-t pt-4 mt-4">
        <h3 className="font-semibold mb-3">Bank Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Bank Name</Label>
            <Input
              value={formData.bank_details.bank_name}
              onChange={(e) => setFormData({
                ...formData,
                bank_details: { ...formData.bank_details, bank_name: e.target.value }
              })}
            />
          </div>
          <div>
            <Label>Account Number</Label>
            <Input
              value={formData.bank_details.account_number}
              onChange={(e) => setFormData({
                ...formData,
                bank_details: { ...formData.bank_details, account_number: e.target.value }
              })}
            />
          </div>
          <div>
            <Label>Account Name</Label>
            <Input
              value={formData.bank_details.account_name}
              onChange={(e) => setFormData({
                ...formData,
                bank_details: { ...formData.bank_details, account_name: e.target.value }
              })}
            />
          </div>
          <div>
            <Label>SWIFT Code</Label>
            <Input
              value={formData.bank_details.swift_code}
              onChange={(e) => setFormData({
                ...formData,
                bank_details: { ...formData.bank_details, swift_code: e.target.value }
              })}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : vendor ? "Update Vendor" : "Create Vendor"}
        </Button>
      </div>
    </form>
  );
};

export default VendorForm;