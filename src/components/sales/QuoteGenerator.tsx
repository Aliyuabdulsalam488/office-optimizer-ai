import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Plus, X, Download, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuoteItem {
  id: string;
  product: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

const QuoteGenerator = () => {
  const [items, setItems] = useState<QuoteItem[]>([
    { id: "1", product: "", description: "", quantity: 1, unitPrice: 0, discount: 0, total: 0 }
  ]);
  const { toast } = useToast();

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), product: "", description: "", quantity: 1, unitPrice: 0, discount: 0, total: 0 }
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof QuoteItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === "quantity" || field === "unitPrice" || field === "discount") {
          const subtotal = updated.quantity * updated.unitPrice;
          updated.total = subtotal - (subtotal * updated.discount / 100);
        }
        return updated;
      }
      return item;
    }));
  };

  const getSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const getTotalDiscount = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * item.discount / 100), 0);
  };

  const getTotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const handleGenerate = () => {
    toast({
      title: "Quote Generated",
      description: "Your quote has been generated successfully",
    });
  };

  return (
    <Card className="p-6 bg-gradient-card border-border">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="w-5 h-5" />
        <h3 className="text-xl font-bold">Quote Generator</h3>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="customer-name">Customer Name</Label>
            <Input id="customer-name" placeholder="Company or contact name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customer-email">Customer Email</Label>
            <Input id="customer-email" type="email" placeholder="customer@company.com" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="quote-number">Quote Number</Label>
            <Input id="quote-number" placeholder="Q-2025-001" defaultValue="Q-2025-017" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="valid-until">Valid Until</Label>
            <Input id="valid-until" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="payment-terms">Payment Terms</Label>
            <Select>
              <SelectTrigger id="payment-terms">
                <SelectValue placeholder="Select terms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="net-30">Net 30</SelectItem>
                <SelectItem value="net-60">Net 60</SelectItem>
                <SelectItem value="due-on-receipt">Due on Receipt</SelectItem>
                <SelectItem value="50-50">50% Upfront / 50% on Delivery</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes / Terms & Conditions</Label>
          <Textarea
            id="notes"
            placeholder="Additional notes, terms, or special conditions..."
            rows={3}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Line Items</Label>
            <Button type="button" size="sm" variant="outline" onClick={addItem}>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>

          {items.map((item, index) => (
            <Card key={item.id} className="p-4 bg-background/50">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Item {index + 1}</Label>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => removeItem(item.id)}
                    disabled={items.length === 1}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  <div className="md:col-span-3 space-y-2">
                    <Label className="text-xs">Product/Service</Label>
                    <Input
                      placeholder="Product name"
                      value={item.product}
                      onChange={(e) => updateItem(item.id, "product", e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-4 space-y-2">
                    <Label className="text-xs">Description</Label>
                    <Input
                      placeholder="Item description"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-1 space-y-2">
                    <Label className="text-xs">Qty</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label className="text-xs">Unit Price</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="md:col-span-1 space-y-2">
                    <Label className="text-xs">Disc %</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={item.discount}
                      onChange={(e) => updateItem(item.id, "discount", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="md:col-span-1 space-y-2">
                    <Label className="text-xs">Total</Label>
                    <Input
                      value={`$${item.total.toFixed(2)}`}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-4 bg-background/50">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-semibold">${getSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Discount:</span>
              <span className="font-semibold text-green-500">-${getTotalDiscount().toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t flex items-center justify-between">
              <span className="font-semibold">Total Amount:</span>
              <span className="text-2xl font-bold">${getTotal().toFixed(2)}</span>
            </div>
          </div>
        </Card>

        <div className="flex gap-3">
          <Button onClick={handleGenerate} className="flex-1 bg-gradient-primary">
            <FileText className="w-4 h-4 mr-2" />
            Generate Quote
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline">
            <Send className="w-4 h-4 mr-2" />
            Send to Customer
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default QuoteGenerator;
