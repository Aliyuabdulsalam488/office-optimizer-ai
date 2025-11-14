import { useState } from "react";
import { DollarSign, ShoppingCart, FileText, TrendingUp, Package, Users } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VendorManagement from "@/components/procurement/VendorManagement";
import PurchaseRequestManagement from "@/components/procurement/PurchaseRequestManagement";
import PurchaseOrderManagement from "@/components/procurement/PurchaseOrderManagement";
import SpendAnalytics from "@/components/procurement/SpendAnalytics";

const ProcurementFinanceDashboard = () => {
  return (
    <DashboardLayout
      title="Finance - Procurement Automation"
      subtitle="Complete procurement and vendor management system"
      icon={<ShoppingCart className="w-8 h-8 text-primary" />}
    >
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Active Vendors"
          value="48"
          icon={Users}
          trend={{ value: "5 new this month", isPositive: true }}
          colorScheme="primary"
        />
        <StatCard
          title="Open POs"
          value="23"
          icon={FileText}
          trend={{ value: "12 pending", isPositive: false }}
          colorScheme="warning"
        />
        <StatCard
          title="Monthly Spend"
          value="$342,500"
          icon={DollarSign}
          trend={{ value: "+8.2% vs last month", isPositive: true }}
          colorScheme="success"
        />
        <StatCard
          title="Cost Savings"
          value="$125,400"
          icon={TrendingUp}
          trend={{ value: "This quarter", isPositive: true }}
          colorScheme="info"
        />
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="vendors" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="requests">Purchase Requests</TabsTrigger>
          <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="vendors" className="space-y-6">
          <VendorManagement />
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <PurchaseRequestManagement />
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <PurchaseOrderManagement />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <SpendAnalytics />
        </TabsContent>
      </Tabs>

      {/* Quick Actions Summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
          <Package className="h-8 w-8 text-blue-600 mb-3" />
          <h3 className="font-semibold mb-2">Goods Received Notes</h3>
          <p className="text-sm text-muted-foreground">
            Record and track incoming deliveries with QA/QC inspection
          </p>
        </div>
        <div className="p-6 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
          <FileText className="h-8 w-8 text-green-600 mb-3" />
          <h3 className="font-semibold mb-2">Supplier Invoices</h3>
          <p className="text-sm text-muted-foreground">
            Upload, validate and match invoices to purchase orders
          </p>
        </div>
        <div className="p-6 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
          <DollarSign className="h-8 w-8 text-purple-600 mb-3" />
          <h3 className="font-semibold mb-2">Payments & Reconciliation</h3>
          <p className="text-sm text-muted-foreground">
            Process vendor payments and track outstanding balances
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProcurementFinanceDashboard;