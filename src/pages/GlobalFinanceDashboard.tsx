import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Users, FileText, Package, CreditCard, BarChart3, Settings } from "lucide-react";
import { CustomerManagement } from "@/components/finance/CustomerManagement";
import { InvoiceManagement } from "@/components/finance/InvoiceManagement";

const GlobalFinanceDashboard = () => {
  return (
    <DashboardLayout
      title="Techstora X-AI - Global Finance System"
      subtitle="Complete finance management with multi-currency support"
      icon={<DollarSign className="w-8 h-8 text-primary" />}
    >
      <Tabs defaultValue="customers" className="space-y-6">
        <TabsList className="grid grid-cols-7 w-full">
          <TabsTrigger value="customers">
            <Users className="h-4 w-4 mr-2" />
            Customers
          </TabsTrigger>
          <TabsTrigger value="invoices">
            <FileText className="h-4 w-4 mr-2" />
            Invoices
          </TabsTrigger>
          <TabsTrigger value="items">
            <Package className="h-4 w-4 mr-2" />
            Items
          </TabsTrigger>
          <TabsTrigger value="payments">
            <CreditCard className="h-4 w-4 mr-2" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="accounting">
            <BarChart3 className="h-4 w-4 mr-2" />
            Accounting
          </TabsTrigger>
          <TabsTrigger value="reports">
            <BarChart3 className="h-4 w-4 mr-2" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="customers">
          <CustomerManagement />
        </TabsContent>

        <TabsContent value="invoices">
          <InvoiceManagement />
        </TabsContent>

        <TabsContent value="items">
          <div className="text-center py-12 text-muted-foreground">
            Items/Inventory module - Coming in next update
          </div>
        </TabsContent>

        <TabsContent value="payments">
          <div className="text-center py-12 text-muted-foreground">
            Payments module - Coming in next update
          </div>
        </TabsContent>

        <TabsContent value="accounting">
          <div className="text-center py-12 text-muted-foreground">
            Accounting & Ledger module - Coming in next update
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <div className="text-center py-12 text-muted-foreground">
            Financial Reports & Analytics - Coming in next update
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="text-center py-12 text-muted-foreground">
            Organization Settings - Coming in next update
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default GlobalFinanceDashboard;
