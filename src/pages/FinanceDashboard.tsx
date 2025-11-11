import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign, TrendingUp, FileText, CreditCard, PieChart, BarChart3, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { AnimatedCard } from "@/components/ui/animated-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Progress } from "@/components/ui/progress";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import FeatureModulesPanel from "@/components/FeatureModulesPanel";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import FreddyChat from "@/components/FreddyChat";

const financeModules = [
  { name: "advanced_reporting", displayName: "Advanced Reporting", description: "Generate detailed financial reports and analytics", category: "Reporting" },
  { name: "budget_forecasting", displayName: "Budget Forecasting", description: "AI-powered budget predictions and planning", category: "Planning" },
  { name: "invoice_automation", displayName: "Invoice Automation", description: "Automated invoice generation and sending", category: "Automation" },
  { name: "expense_management", displayName: "Expense Management", description: "Track and manage business expenses", category: "Management" },
  { name: "tax_compliance", displayName: "Tax Compliance", description: "Automated tax calculations and filing assistance", category: "Compliance" },
];

const FinanceDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showFreddyChat, setShowFreddyChat] = useState(false);
  const [freddyServiceType, setFreddyServiceType] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Allow direct access without authentication
      setLoading(false);
      
      // Optionally check if user is logged in for enhanced features
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        setUser(user);
        setProfile(profileData);
      }
    } catch (error: any) {
      console.log('Auth check error:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <DashboardLayout
      title="Finance Manager Dashboard"
      subtitle={`Welcome back, ${profile?.full_name || user?.email}`}
      icon={<DollarSign className="w-8 h-8 text-primary" />}
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value="$847,392"
          icon={DollarSign}
          trend={{ value: "15.3% from last month", isPositive: true }}
          colorScheme="success"
        />
        <StatCard
          title="Accounts Receivable"
          value="$124,500"
          icon={TrendingUp}
          trend={{ value: "8% decrease", isPositive: true }}
          colorScheme="primary"
        />
        <StatCard
          title="Pending Invoices"
          value={34}
          icon={FileText}
          trend={{ value: "12 overdue", isPositive: false }}
          colorScheme="warning"
        />
        <StatCard
          title="Cash Flow"
          value="+$45,230"
          icon={CreditCard}
          trend={{ value: "Positive trend", isPositive: true }}
          colorScheme="info"
        />
      </div>

      {/* Budget Overview */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Budget Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatedCard className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" />
              Department Budgets
            </h3>
            <div className="space-y-4">
              {[
                { dept: "Operations", used: 75, budget: "$120,000", color: "bg-primary" },
                { dept: "Marketing", used: 60, budget: "$80,000", color: "bg-secondary" },
                { dept: "R&D", used: 45, budget: "$150,000", color: "bg-success" },
                { dept: "Sales", used: 85, budget: "$100,000", color: "bg-warning" },
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">{item.dept}</span>
                    <span className="text-muted-foreground">{item.used}% • {item.budget}</span>
                  </div>
                  <Progress value={item.used} className="h-2" />
                </div>
              ))}
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6" delay={100}>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Recent Transactions
            </h3>
            <div className="space-y-3">
              {[
                { desc: "Vendor Payment - ABC Corp", amount: "-$12,500", status: "completed" },
                { desc: "Client Payment Received", amount: "+$45,000", status: "completed" },
                { desc: "Utility Bills", amount: "-$3,200", status: "pending" },
                { desc: "Refund Processed", amount: "-$1,800", status: "completed" },
              ].map((tx, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    {tx.status === "completed" ? (
                      <CheckCircle className="w-4 h-4 text-success" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-warning" />
                    )}
                    <p className="text-sm font-medium">{tx.desc}</p>
                  </div>
                  <p className={`text-sm font-semibold ${tx.amount.startsWith('+') ? 'text-success' : 'text-foreground'}`}>
                    {tx.amount}
                  </p>
                </div>
              ))}
            </div>
          </AnimatedCard>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickActionCard
            title="Invoice Management"
            description="Create, track and manage invoices"
            icon={FileText}
            onClick={() => { setFreddyServiceType("invoice_management"); setShowFreddyChat(true); }}
            colorScheme="primary"
            delay={0}
          />
          <QuickActionCard
            title="Expense Tracking"
            description="Monitor and categorize expenses"
            icon={CreditCard}
            onClick={() => { setFreddyServiceType("expense_tracking"); setShowFreddyChat(true); }}
            colorScheme="secondary"
            delay={100}
          />
          <QuickActionCard
            title="Financial Reports"
            description="Generate detailed financial reports"
            icon={BarChart3}
            onClick={() => { setFreddyServiceType("financial_reports"); setShowFreddyChat(true); }}
            colorScheme="success"
            delay={200}
          />
          <QuickActionCard
            title="Budget Planning"
            description="Create and manage budgets"
            icon={PieChart}
            onClick={() => { setFreddyServiceType("budget_planning"); setShowFreddyChat(true); }}
            colorScheme="warning"
            delay={300}
          />
          <QuickActionCard
            title="Cash Flow Analysis"
            description="Analyze cash flow patterns"
            icon={TrendingUp}
            onClick={() => { setFreddyServiceType("cash_flow"); setShowFreddyChat(true); }}
            colorScheme="primary"
            delay={400}
          />
          <QuickActionCard
            title="Tax Management"
            description="Track tax obligations and filings"
            icon={DollarSign}
            onClick={() => { setFreddyServiceType("tax_management"); setShowFreddyChat(true); }}
            colorScheme="secondary"
            delay={500}
          />
        </div>
      </div>

      {/* Financial Analytics */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Financial Analytics</h2>
        <RevenueChart />
      </div>

      {/* Feature Modules */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Enable Additional Features</h2>
        <FeatureModulesPanel roleModules={financeModules} />
      </div>

      {/* Freddy Chat Dialog */}
      {showFreddyChat && (
        <FreddyChat 
          onClose={() => setShowFreddyChat(false)}
          serviceType={freddyServiceType}
        />
      )}
    </DashboardLayout>
  );
};

export default FinanceDashboard;
