import { useState } from "react";
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
  estimated_unit_price: number;
  estimated_total: number;
}

const PurchaseRequestForm = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({
    department: "",
    description: "",
    justification: "",
  });
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: "1", item_description: "", quantity: 0, estimated_unit_price: 0, estimated_total: 0 }
  ]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { id: Date.now().toString(), item_description: "", quantity: 0, estimated_unit_price: 0, estimated_total: 0 }
    ]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length === 1) return;
    setLineItems(lineItems.filter((item) => item.id !== id));
  };

  const updateLineItem = (id: string, field: string, value: any) => {
    setLineItems(lineItems.map((item) => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === "quantity" || field === "estimated_unit_price") {
          updated.estimated_total = updated.quantity * updated.estimated_unit_price;
        }
        return updated;
      }
      return item;
    }));
  };

  const getTotalAmount = () => {
    return lineItems.reduce((sum, item) => sum + (item.estimated_total || 0), 0);
  };

  const generatePRNumber = () => {
    const date = new Date();
    return `PR-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}-${Date.now().toString().slice(-6)}`;
  };

  const handleSubmit = async (e: React.FormEvent, submitStatus: string = "draft") => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const prData = {
        pr_number: generatePRNumber(),
        department: formData.department,
        description: formData.description,
        justification: formData.justification,
        total_amount: getTotalAmount(),
        requested_by: user.id,
        status: submitStatus,
      };

      const { data: prResponse, error: prError } = await supabase
        .from("purchase_requests")
        .insert([prData])
        .select()
        .single();

      if (prError) throw prError;

      const itemsToInsert = lineItems.map((item) => ({
        pr_id: prResponse.id,
        item_description: item.item_description,
        quantity: item.quantity,
        estimated_unit_price: item.estimated_unit_price,
        estimated_total: item.estimated_total,
      }));

      const { error: itemsError } = await supabase
        .from("pr_items")
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      toast({
        title: "Purchase request created",
        description: `PR ${prResponse.pr_number} has been ${submitStatus === "submitted" ? "submitted" : "saved as draft"}`,
      });

      onClose();
    } catch (error: any) {
      toast({
        title: "Error creating purchase request",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, "submitted")} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="department">Department *</Label>
          <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })} required>
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="hr">HR</SelectItem>
              <SelectItem value="it">IT</SelectItem>
              <SelectItem value="operations">Operations</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="justification">Justification *</Label>
        <Textarea
          id="justification"
          value={formData.justification}
          onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
          rows={3}
          required
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
          {lineItems.map((item, index) => (
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
                <Label>Unit Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={item.estimated_unit_price || ""}
                  onChange={(e) => updateLineItem(item.id, "estimated_unit_price", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="col-span-2">
                <Label>Total</Label>
                <Input value={item.estimated_total.toFixed(2)} disabled />
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

        <div className="flex justify-end mt-4 text-lg font-semibold">
          Total Amount: ${getTotalAmount().toFixed(2)}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={(e) => handleSubmit(e, "draft")}
          disabled={loading}
        >
          Save Draft
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Request"}
        </Button>
      </div>
    </form>
  );
};

export default PurchaseRequestForm;