import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CurrencySelector } from "./CurrencySelector";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2 } from "lucide-react";

interface InvoiceFormProps {
  invoice: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export const InvoiceForm = ({ invoice, onSuccess, onCancel }: InvoiceFormProps) => {
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    customer_id: invoice?.customer_id || "",
    invoice_type: invoice?.invoice_type || "business",
    invoice_date: invoice?.invoice_date || new Date().toISOString().split("T")[0],
    due_date: invoice?.due_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    currency: invoice?.currency || "USD",
    tax_enabled: false,
    transport_fee: invoice?.transport_fee || 0,
    other_charges: invoice?.other_charges || 0,
    discount: invoice?.discount || 0,
    notes: invoice?.notes || "",
    terms: invoice?.terms || "",
  });
  const [lineItems, setLineItems] = useState([
    { item_id: "", description: "", quantity: 1, unit_price: 0, tax_enabled: false, tax_rate: 0 }
  ]);
  const { toast } = useToast();

  useEffect(() => {
    loadCustomers();
    loadItems();
  }, []);

  const loadCustomers = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("customers")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("name");
    setCustomers(data || []);
  };

  const loadItems = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("items")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("name");
    setItems(data || []);
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { item_id: "", description: "", quantity: 1, unit_price: 0, tax_enabled: false, tax_rate: 0 }]);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const updateLineItem = (index: number, field: string, value: any) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    
    if (field === "item_id" && value) {
      const item = items.find(i => i.id === value);
      if (item) {
        updated[index].description = item.name;
        updated[index].unit_price = item.unit_price;
        updated[index].tax_enabled = item.tax_enabled;
        updated[index].tax_rate = item.tax_rate;
      }
    }
    
    setLineItems(updated);
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let totalTax = 0;

    lineItems.forEach((item) => {
      const itemTotal = (item.quantity || 0) * (item.unit_price || 0);
      subtotal += itemTotal;
      if (item.tax_enabled && item.tax_rate) {
        totalTax += itemTotal * (item.tax_rate / 100);
      }
    });

    const discount = Number(formData.discount) || 0;
    const transport = Number(formData.transport_fee) || 0;
    const other = Number(formData.other_charges) || 0;

    const total = subtotal + totalTax + transport + other - discount;

    return { subtotal, totalTax, total };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { subtotal, totalTax, total } = calculateTotals();

      // Generate invoice number
      const invoiceNumber = invoice?.invoice_number || `INV-${Date.now()}`;

      const invoiceData = {
        user_id: user.id,
        customer_id: formData.customer_id,
        invoice_number: invoiceNumber,
        invoice_type: formData.invoice_type,
        invoice_date: formData.invoice_date,
        due_date: formData.due_date,
        currency: formData.currency,
        subtotal,
        tax_amount: totalTax,
        discount: Number(formData.discount) || 0,
        transport_fee: Number(formData.transport_fee) || 0,
        other_charges: Number(formData.other_charges) || 0,
        total,
        balance: total,
        notes: formData.notes,
        terms: formData.terms,
        status: "draft",
      };

      let invoiceId: string;

      if (invoice) {
        const { error } = await supabase
          .from("invoices")
          .update(invoiceData)
          .eq("id", invoice.id);
        if (error) throw error;
        invoiceId = invoice.id;

        await supabase.from("invoice_items").delete().eq("invoice_id", invoiceId);
      } else {
        const { data, error } = await supabase
          .from("invoices")
          .insert(invoiceData)
          .select()
          .single();
        if (error) throw error;
        invoiceId = data.id;
      }

      // Insert line items
      const itemsToInsert = lineItems.map(item => {
        const itemTotal = (item.quantity || 0) * (item.unit_price || 0);
        const taxAmount = item.tax_enabled ? itemTotal * ((item.tax_rate || 0) / 100) : 0;
        
        return {
          invoice_id: invoiceId,
          item_id: item.item_id || null,
          description: item.description,
          quantity: item.quantity || 1,
          unit_price: item.unit_price || 0,
          tax_enabled: item.tax_enabled,
          tax_rate: item.tax_rate || 0,
          tax_amount: taxAmount,
          total: itemTotal + taxAmount,
        };
      });

      const { error: itemsError } = await supabase
        .from("invoice_items")
        .insert(itemsToInsert);
      if (itemsError) throw itemsError;

      toast({
        title: "Success",
        description: `Invoice ${invoice ? "updated" : "created"} successfully`,
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

  const { subtotal, totalTax, total } = calculateTotals();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <Label>Customer *</Label>
          <Select value={formData.customer_id} onValueChange={(value) => setFormData({ ...formData, customer_id: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select customer" />
            </SelectTrigger>
            <SelectContent>
              {customers.map((customer) => (
                <SelectItem key={customer.id} value={customer.id}>
                  {customer.name} ({customer.currency})
                </SelectItem>
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
          <Label>Invoice Date</Label>
          <Input
            type="date"
            value={formData.invoice_date}
            onChange={(e) => setFormData({ ...formData, invoice_date: e.target.value })}
          />
        </div>
        <div>
          <Label>Due Date</Label>
          <Input
            type="date"
            value={formData.due_date}
            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Line Items</Label>
          <Button type="button" size="sm" onClick={addLineItem}>
            <Plus className="h-4 w-4 mr-1" />
            Add Item
          </Button>
        </div>
        <div className="space-y-2">
          {lineItems.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-end p-2 border rounded">
              <div className="col-span-4">
                <Select
                  value={item.item_id}
                  onValueChange={(value) => updateLineItem(index, "item_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select item" />
                  </SelectTrigger>
                  <SelectContent>
                    {items.map((i) => (
                      <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => updateLineItem(index, "quantity", Number(e.target.value))}
                />
              </div>
              <div className="col-span-2">
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={item.unit_price}
                  onChange={(e) => updateLineItem(index, "unit_price", Number(e.target.value))}
                />
              </div>
              <div className="col-span-2">
                <Input
                  type="number"
                  placeholder="Tax %"
                  value={item.tax_rate}
                  onChange={(e) => updateLineItem(index, "tax_rate", Number(e.target.value))}
                  disabled={!item.tax_enabled}
                />
              </div>
              <div className="col-span-1">
                <Switch
                  checked={item.tax_enabled}
                  onCheckedChange={(checked) => updateLineItem(index, "tax_enabled", checked)}
                />
              </div>
              <div className="col-span-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeLineItem(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Discount</Label>
          <Input
            type="number"
            step="0.01"
            value={formData.discount}
            onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
          />
        </div>
        <div>
          <Label>Transport Fee</Label>
          <Input
            type="number"
            step="0.01"
            value={formData.transport_fee}
            onChange={(e) => setFormData({ ...formData, transport_fee: Number(e.target.value) })}
          />
        </div>
        <div>
          <Label>Other Charges</Label>
          <Input
            type="number"
            step="0.01"
            value={formData.other_charges}
            onChange={(e) => setFormData({ ...formData, other_charges: Number(e.target.value) })}
          />
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-end space-y-1 text-sm">
          <div className="w-64">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formData.currency} {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>{formData.currency} {totalTax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount:</span>
              <span>-{formData.currency} {(formData.discount || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-1 mt-1">
              <span>Total:</span>
              <span>{formData.currency} {total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Notes</Label>
          <Textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Additional notes"
          />
        </div>
        <div>
          <Label>Terms & Conditions</Label>
          <Textarea
            value={formData.terms}
            onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
            placeholder="Payment terms and conditions"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : invoice ? "Update Invoice" : "Create Invoice"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
