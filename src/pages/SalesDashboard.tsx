import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, Target, Users, DollarSign, Calendar, Mail, Phone, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { AnimatedCard } from "@/components/ui/animated-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Progress } from "@/components/ui/progress";
import { SalesPipelineChart } from "@/components/dashboard/SalesPipelineChart";
import FeatureModulesPanel from "@/components/FeatureModulesPanel";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SallyChat from "@/components/SallyChat";
import LeadManagement from "@/components/sales/LeadManagement";
import PipelineTracking from "@/components/sales/PipelineTracking";
import QuoteGenerator from "@/components/sales/QuoteGenerator";
import SalesForecasting from "@/components/sales/SalesForecasting";

const salesModules = [
  { name: "lead_scoring", displayName: "AI Lead Scoring", description: "Automatically score and prioritize leads", category: "Leads" },
  { name: "email_automation", displayName: "Email Automation", description: "Automated email campaigns and follow-ups", category: "Automation" },
  { name: "sales_analytics", displayName: "Sales Analytics", description: "Advanced sales performance analytics", category: "Analytics" },
  { name: "crm_integration", displayName: "CRM Integration", description: "Connect with popular CRM systems", category: "Integration" },
  { name: "territory_management", displayName: "Territory Management", description: "Manage sales territories and assignments", category: "Management" },
];

const SalesDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSallyChat, setShowSallyChat] = useState(false);
  const [sallyServiceType, setSallyServiceType] = useState("");
  const [showLeadManagement, setShowLeadManagement] = useState(false);
  const [showPipelineTracking, setShowPipelineTracking] = useState(false);
  const [showQuoteGenerator, setShowQuoteGenerator] = useState(false);
  const [showSalesForecasting, setShowSalesForecasting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      const { data: userRoles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      const hasSalesRole = userRoles?.some(r => r.role.toString() === "sales_manager");

      if (!hasSalesRole) {
        toast({
          title: "Access denied",
          description: "This dashboard is for Sales Managers only",
          variant: "destructive",
        });
        navigate("/employee-dashboard");
        return;
      }

      setUser(user);
      setProfile(profileData);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <DashboardLayout
      title="Sales Manager Dashboard"
      subtitle={`Welcome back, ${profile?.full_name || user?.email}`}
      icon={<TrendingUp className="w-8 h-8 text-primary" />}
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Monthly Revenue"
          value="$542,890"
          icon={DollarSign}
          trend={{ value: "23% from last month", isPositive: true }}
          colorScheme="success"
        />
        <StatCard
          title="Active Leads"
          value={156}
          icon={Users}
          trend={{ value: "34 new this week", isPositive: true }}
          colorScheme="primary"
        />
        <StatCard
          title="Conversion Rate"
          value="24.5%"
          icon={Target}
          trend={{ value: "3.2% increase", isPositive: true }}
          colorScheme="info"
        />
        <StatCard
          title="Deals Closed"
          value={42}
          icon={Award}
          trend={{ value: "This month", isPositive: true }}
          colorScheme="warning"
        />
      </div>

      {/* Sales Pipeline */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Sales Pipeline</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatedCard className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Pipeline Progress
            </h3>
            <div className="space-y-4">
              {[
                { stage: "Prospecting", count: 45, value: "$230,000", progress: 30 },
                { stage: "Qualification", count: 32, value: "$180,000", progress: 50 },
                { stage: "Proposal", count: 18, value: "$120,000", progress: 70 },
                { stage: "Negotiation", count: 12, value: "$85,000", progress: 85 },
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">{item.stage}</span>
                    <span className="text-muted-foreground">{item.count} deals • {item.value}</span>
                  </div>
                  <Progress value={item.progress} className="h-2" />
                </div>
              ))}
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6" delay={100}>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Upcoming Meetings
            </h3>
            <div className="space-y-3">
              {[
                { client: "Acme Corporation", time: "Today, 2:00 PM", type: "Demo" },
                { client: "Tech Innovations Inc", time: "Tomorrow, 10:30 AM", type: "Proposal" },
                { client: "Global Solutions", time: "Nov 10, 3:00 PM", type: "Follow-up" },
                { client: "Future Systems", time: "Nov 12, 11:00 AM", type: "Negotiation" },
              ].map((meeting, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="text-sm font-medium">{meeting.client}</p>
                    <p className="text-xs text-muted-foreground">{meeting.time}</p>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {meeting.type}
                  </span>
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
            title="Lead Management"
            description="Track and nurture sales leads"
            icon={Users}
            onClick={() => setShowLeadManagement(true)}
            colorScheme="primary"
            delay={0}
          />
          <QuickActionCard
            title="Pipeline Tracking"
            description="Monitor deals through sales stages"
            icon={TrendingUp}
            onClick={() => setShowPipelineTracking(true)}
            colorScheme="secondary"
            delay={100}
          />
          <QuickActionCard
            title="Quote Generator"
            description="Create professional quotes quickly"
            icon={DollarSign}
            onClick={() => setShowQuoteGenerator(true)}
            colorScheme="success"
            delay={200}
          />
          <QuickActionCard
            title="Sales Forecasting"
            description="Predict future revenue trends"
            icon={Target}
            onClick={() => setShowSalesForecasting(true)}
            colorScheme="warning"
            delay={300}
          />
          <QuickActionCard
            title="Email Campaigns"
            description="Manage sales email sequences"
            icon={Mail}
            onClick={() => { setSallyServiceType("email_campaigns"); setShowSallyChat(true); }}
            colorScheme="primary"
            delay={400}
          />
          <QuickActionCard
            title="Call Scheduler"
            description="Schedule and track sales calls"
            icon={Phone}
            onClick={() => { setSallyServiceType("call_scheduler"); setShowSallyChat(true); }}
            colorScheme="secondary"
            delay={500}
          />
        </div>
      </div>

      {/* Sales Analytics */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Sales Analytics</h2>
        <SalesPipelineChart />
      </div>

      {/* Feature Modules */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Enable Additional Features</h2>
        <FeatureModulesPanel roleModules={salesModules} />
      </div>

      {/* Feature Dialogs */}
      <Dialog open={showLeadManagement} onOpenChange={setShowLeadManagement}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Lead Management</DialogTitle>
          </DialogHeader>
          <LeadManagement />
        </DialogContent>
      </Dialog>

      <Dialog open={showPipelineTracking} onOpenChange={setShowPipelineTracking}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Pipeline Tracking</DialogTitle>
          </DialogHeader>
          <PipelineTracking />
        </DialogContent>
      </Dialog>

      <Dialog open={showQuoteGenerator} onOpenChange={setShowQuoteGenerator}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Quote Generator</DialogTitle>
          </DialogHeader>
          <QuoteGenerator />
        </DialogContent>
      </Dialog>

      <Dialog open={showSalesForecasting} onOpenChange={setShowSalesForecasting}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sales Forecasting</DialogTitle>
          </DialogHeader>
          <SalesForecasting />
        </DialogContent>
      </Dialog>

      {showSallyChat && (
        <SallyChat 
          onClose={() => setShowSallyChat(false)}
          serviceType={sallyServiceType}
        />
      )}
    </DashboardLayout>
  );
};

export default SalesDashboard;