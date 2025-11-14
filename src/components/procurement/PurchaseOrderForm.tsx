import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

interface LineItem {
  id: string;
  item_description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

const PurchaseOrderForm = ({ onClose }: { onClose: () => void }) => {
  const [vendors, setVendors] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    vendor_id: "",
    delivery_date: "",
    notes: "",
    terms_conditions: "Payment due within 30 days. All items subject to inspection.",
    tax: 0,
    discount: 0,
  });
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: "1", item_description: "", quantity: 0, unit_price: 0, total: 0 }
  ]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    const { data } = await supabase.from("vendors").select("*").eq("status", "active");
    setVendors(data || []);
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { id: Date.now().toString(), item_description: "", quantity: 0, unit_price: 0, total: 0 }]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length === 1) return;
    setLineItems(lineItems.filter((item) => item.id !== id));
  };

  const updateLineItem = (id: string, field: string, value: any) => {
    setLineItems(lineItems.map((item) => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === "quantity" || field === "unit_price") {
          updated.total = updated.quantity * updated.unit_price;
        }
        return updated;
      }
      return item;
    }));
  };

  const getSubtotal = () => lineItems.reduce((sum, item) => sum + (item.total || 0), 0);
  const getTotal = () => {
    const subtotal = getSubtotal();
    return subtotal + formData.tax - formData.discount;
  };

  const generatePONumber = () => {
    const date = new Date();
    return `PO-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}-${Date.now().toString().slice(-6)}`;
  };

  const handleSubmit = async (e: React.FormEvent, submitStatus: string = "draft") => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const poData = {
        po_number: generatePONumber(),
        vendor_id: formData.vendor_id,
        delivery_date: formData.delivery_date,
        notes: formData.notes,
        terms_conditions: formData.terms_conditions,
        subtotal: getSubtotal(),
        tax: formData.tax,
        discount: formData.discount,
        total: getTotal(),
        created_by: user.id,
        status: submitStatus,
      };

      const { data: poResponse, error: poError } = await supabase
        .from("purchase_orders")
        .insert([poData])
        .select()
        .single();

      if (poError) throw poError;

      const itemsToInsert = lineItems.map((item) => ({
        po_id: poResponse.id,
        item_description: item.item_description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total: item.total,
      }));

      const { error: itemsError } = await supabase.from("po_items").insert(itemsToInsert);
      if (itemsError) throw itemsError;

      toast({
        title: "Purchase order created",
        description: `PO ${poResponse.po_number} has been created`,
      });

      onClose();
    } catch (error: any) {
      toast({
        title: "Error creating purchase order",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, "pending_approval")} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Vendor *</Label>
          <Select value={formData.vendor_id} onValueChange={(value) => setFormData({ ...formData, vendor_id: value })} required>
            <SelectTrigger>
              <SelectValue placeholder="Select vendor" />
            </SelectTrigger>
            <SelectContent>
              {vendors.map((vendor) => (
                <SelectItem key={vendor.id} value={vendor.id}>{vendor.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Delivery Date</Label>
          <Input
            type="date"
            value={formData.delivery_date}
            onChange={(e) => setFormData({ ...formData, delivery_date: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label>Notes</Label>
        <Textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={2}
        />
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Line Items</h3>
          <Button type="button" variant="outline" size="sm" onClick={addLineItem}>
            <Plus className="h-4 w-4 mr-1" />
            Add Item
          </Button>
        </div>

        <div className="space-y-4">
          {lineItems.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 items-end p-3 border rounded-lg">
              <div className="col-span-5">
                <Label>Item Description *</Label>
                <Input
                  value={item.item_description}
                  onChange={(e) => updateLineItem(item.id, "item_description", e.target.value)}
                  required
                />
              </div>
              <div className="col-span-2">
                <Label>Quantity *</Label>
                <Input
                  type="number"
                  value={item.quantity || ""}
                  onChange={(e) => updateLineItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                  required
                />
              </div>
              <div className="col-span-2">
                <Label>Unit Price *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={item.unit_price || ""}
                  onChange={(e) => updateLineItem(item.id, "unit_price", parseFloat(e.target.value) || 0)}
                  required
                />
              </div>
              <div className="col-span-2">
                <Label>Total</Label>
                <Input value={item.total.toFixed(2)} disabled />
              </div>
              <div className="col-span-1">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeLineItem(item.id)}
                  disabled={lineItems.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2 border-t pt-4">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="font-medium">${getSubtotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Tax:</span>
            <Input
              type="number"
              step="0.01"
              value={formData.tax || ""}
              onChange={(e) => setFormData({ ...formData, tax: parseFloat(e.target.value) || 0 })}
              className="w-32 text-right"
            />
          </div>
          <div className="flex justify-between items-center">
            <span>Discount:</span>
            <Input
              type="number"
              step="0.01"
              value={formData.discount || ""}
              onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
              className="w-32 text-right"
            />
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-2">
            <span>Total:</span>
            <span>${getTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div>
        <Label>Terms & Conditions</Label>
        <Textarea
          value={formData.terms_conditions}
          onChange={(e) => setFormData({ ...formData, terms_conditions: e.target.value })}
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="button" variant="outline" onClick={(e) => handleSubmit(e, "draft")} disabled={loading}>
          Save Draft
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create PO"}
        </Button>
      </div>
    </form>
  );
};

export default PurchaseOrderForm;