import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Download, Send, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RFQItem {
  id: string;
  description: string;
  quantity: number;
  specifications: string;
}

const RFQGenerator = () => {
  const [items, setItems] = useState<RFQItem[]>([
    { id: "1", description: "", quantity: 0, specifications: "" }
  ]);
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const { toast } = useToast();

  const suppliers = [
    "ABC Manufacturing Co.",
    "Global Supplies Inc.",
    "Premium Parts Ltd.",
    "TechComponents Pro",
    "Industrial Solutions LLC",
  ];

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), description: "", quantity: 0, specifications: "" }
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof RFQItem, value: any) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const toggleSupplier = (supplier: string) => {
    setSelectedSuppliers(prev =>
      prev.includes(supplier)
        ? prev.filter(s => s !== supplier)
        : [...prev, supplier]
    );
  };

  const handleGenerate = () => {
    if (selectedSuppliers.length === 0) {
      toast({
        title: "No suppliers selected",
        description: "Please select at least one supplier",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "RFQ Generated",
      description: `RFQ sent to ${selectedSuppliers.length} suppliers`,
    });
  };

  return (
    <Card className="p-6 bg-gradient-card border-border">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="w-5 h-5" />
        <h3 className="text-xl font-bold">RFQ Generator</h3>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="rfq-title">RFQ Title</Label>
          <Input
            id="rfq-title"
            placeholder="e.g., Q1 2025 Raw Materials Procurement"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="deadline">Submission Deadline</Label>
            <Input id="deadline" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="delivery-date">Required Delivery Date</Label>
            <Input id="delivery-date" type="date" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="requirements">General Requirements</Label>
          <Textarea
            id="requirements"
            placeholder="Specify quality standards, certifications, delivery terms, payment terms, etc."
            rows={3}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Items to Quote</Label>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2 space-y-2">
                    <Label className="text-xs">Description</Label>
                    <Input
                      placeholder="Item description"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Quantity</Label>
                    <Input
                      type="number"
                      min="0"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Technical Specifications</Label>
                  <Textarea
                    placeholder="Detailed specifications, dimensions, materials, etc."
                    rows={2}
                    value={item.specifications}
                    onChange={(e) => updateItem(item.id, "specifications", e.target.value)}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="space-y-3">
          <Label>Select Suppliers to Send RFQ</Label>
          <Card className="p-4 bg-background/50">
            <div className="space-y-3">
              {suppliers.map((supplier) => (
                <div key={supplier} className="flex items-center space-x-2">
                  <Checkbox
                    id={supplier}
                    checked={selectedSuppliers.includes(supplier)}
                    onCheckedChange={() => toggleSupplier(supplier)}
                  />
                  <label
                    htmlFor={supplier}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {supplier}
                  </label>
                </div>
              ))}
            </div>
          </Card>
          <p className="text-xs text-muted-foreground">
            {selectedSuppliers.length} supplier(s) selected
          </p>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleGenerate} className="flex-1 bg-gradient-primary">
            <Send className="w-4 h-4 mr-2" />
            Send RFQ to Suppliers
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default RFQGenerator;
