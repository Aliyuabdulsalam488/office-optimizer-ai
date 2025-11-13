import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { FileText, Download, Plus, Trash2 } from "lucide-react";
import jsPDF from "jspdf";

interface LineItem {
  description: string;
  quantity: number;
  rate: number;
}

export const InvoiceGenerator = () => {
  const { toast } = useToast();
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Date.now()}`);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: "", quantity: 1, rate: 0 }
  ]);
  const [notes, setNotes] = useState("");

  const addLineItem = () => {
    setLineItems([...lineItems, { description: "", quantity: 1, rate: 0 }]);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: string | number) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    setLineItems(updated);
  };

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1; // 10% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const generateInvoicePDF = () => {
    if (!clientName || lineItems.some(item => !item.description)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;

    // Header
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", pageWidth / 2, yPos, { align: "center" });
    
    yPos += 15;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice #: ${invoiceNumber}`, 20, yPos);
    doc.text(`Date: ${invoiceDate}`, pageWidth - 20, yPos, { align: "right" });
    
    yPos += 6;
    doc.text(`Due Date: ${dueDate || "Upon Receipt"}`, pageWidth - 20, yPos, { align: "right" });

    // Client Info
    yPos += 15;
    doc.setFont("helvetica", "bold");
    doc.text("Bill To:", 20, yPos);
    
    yPos += 6;
    doc.setFont("helvetica", "normal");
    doc.text(clientName, 20, yPos);
    
    if (clientEmail) {
      yPos += 5;
      doc.text(clientEmail, 20, yPos);
    }
    
    if (clientAddress) {
      yPos += 5;
      const addressLines = doc.splitTextToSize(clientAddress, 80);
      doc.text(addressLines, 20, yPos);
      yPos += addressLines.length * 5;
    }

    // Line Items Table
    yPos += 15;
    doc.setFont("helvetica", "bold");
    doc.text("Description", 20, yPos);
    doc.text("Qty", 120, yPos);
    doc.text("Rate", 145, yPos);
    doc.text("Amount", pageWidth - 20, yPos, { align: "right" });
    
    yPos += 2;
    doc.line(20, yPos, pageWidth - 20, yPos);
    yPos += 6;

    doc.setFont("helvetica", "normal");
    lineItems.forEach((item) => {
      const amount = item.quantity * item.rate;
      doc.text(item.description, 20, yPos);
      doc.text(item.quantity.toString(), 120, yPos);
      doc.text(`$${item.rate.toFixed(2)}`, 145, yPos);
      doc.text(`$${amount.toFixed(2)}`, pageWidth - 20, yPos, { align: "right" });
      yPos += 6;
    });

    // Totals
    yPos += 5;
    doc.line(20, yPos, pageWidth - 20, yPos);
    yPos += 8;

    const subtotal = calculateSubtotal();
    const tax = calculateTax();
    const total = calculateTotal();

    doc.text("Subtotal:", 145, yPos);
    doc.text(`$${subtotal.toFixed(2)}`, pageWidth - 20, yPos, { align: "right" });
    
    yPos += 6;
    doc.text("Tax (10%):", 145, yPos);
    doc.text(`$${tax.toFixed(2)}`, pageWidth - 20, yPos, { align: "right" });
    
    yPos += 8;
    doc.setFont("helvetica", "bold");
    doc.text("Total:", 145, yPos);
    doc.text(`$${total.toFixed(2)}`, pageWidth - 20, yPos, { align: "right" });

    // Notes
    if (notes) {
      yPos += 15;
      doc.setFont("helvetica", "bold");
      doc.text("Notes:", 20, yPos);
      yPos += 6;
      doc.setFont("helvetica", "normal");
      const noteLines = doc.splitTextToSize(notes, pageWidth - 40);
      doc.text(noteLines, 20, yPos);
    }

    doc.save(`${invoiceNumber}.pdf`);
    toast({
      title: "Invoice Generated",
      description: "Your invoice has been downloaded as PDF",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Invoice Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <Label>Invoice Number</Label>
            <Input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
          </div>
          <div>
            <Label>Invoice Date</Label>
            <Input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
          </div>
          <div>
            <Label>Due Date</Label>
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
        </div>

        <h4 className="font-semibold mb-3">Client Information</h4>
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div>
            <Label>Client Name *</Label>
            <Input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="John Doe" />
          </div>
          <div>
            <Label>Client Email</Label>
            <Input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="john@example.com" />
          </div>
          <div>
            <Label>Client Address</Label>
            <Textarea value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} placeholder="123 Main St, City, State, ZIP" rows={2} />
          </div>
        </div>

        <h4 className="font-semibold mb-3">Line Items</h4>
        <div className="space-y-3 mb-4">
          {lineItems.map((item, index) => (
            <div key={index} className="flex gap-2 items-end">
              <div className="flex-1">
                <Label>Description *</Label>
                <Input
                  value={item.description}
                  onChange={(e) => updateLineItem(index, "description", e.target.value)}
                  placeholder="Service or product description"
                />
              </div>
              <div className="w-20">
                <Label>Qty</Label>
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateLineItem(index, "quantity", parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="w-28">
                <Label>Rate ($)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.rate}
                  onChange={(e) => updateLineItem(index, "rate", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="w-28">
                <Label>Amount</Label>
                <Input value={`$${(item.quantity * item.rate).toFixed(2)}`} disabled />
              </div>
              {lineItems.length > 1 && (
                <Button variant="destructive" size="icon" onClick={() => removeLineItem(index)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button variant="outline" onClick={addLineItem} className="mb-6">
          <Plus className="w-4 h-4 mr-2" />
          Add Line Item
        </Button>

        <div className="mb-6">
          <Label>Notes (Optional)</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Payment terms, thank you note, etc."
            rows={3}
          />
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span className="font-semibold">${calculateSubtotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax (10%):</span>
            <span className="font-semibold">${calculateTax().toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-2">
            <span>Total:</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
        </div>

        <Button onClick={generateInvoicePDF} className="w-full mt-6" size="lg">
          <Download className="w-4 h-4 mr-2" />
          Generate & Download Invoice
        </Button>
      </Card>
    </div>
  );
};
