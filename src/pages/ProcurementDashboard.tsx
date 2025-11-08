import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingCart, Users, FileText, Package, TrendingDown, BarChart3, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const ProcurementDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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

      const hasProcurementRole = userRoles?.some(r => r.role.toString() === "procurement_manager");

      if (!hasProcurementRole) {
        toast({
          title: "Access denied",
          description: "This dashboard is for Procurement Managers only",
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
      title="Procurement Manager Dashboard"
      subtitle={`Welcome back, ${profile?.full_name || user?.email}`}
      icon={<ShoppingCart className="w-8 h-8 text-primary" />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Active Vendors" value={48} icon={Users} trend={{ value: "5 new this month", isPositive: true }} colorScheme="primary" />
        <StatCard title="Open POs" value={23} icon={FileText} trend={{ value: "12 pending", isPositive: false }} colorScheme="warning" />
        <StatCard title="Cost Savings" value="$125,400" icon={TrendingDown} trend={{ value: "This quarter", isPositive: true }} colorScheme="success" />
        <StatCard title="Pending Deliveries" value={15} icon={Package} trend={{ value: "3 urgent", isPositive: false }} colorScheme="info" />
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickActionCard title="Create Purchase Order" description="Generate new PO documents" icon={FileText} onClick={() => toast({ title: "Coming soon" })} colorScheme="primary" delay={0} />
          <QuickActionCard title="Manage Vendors" description="View and update supplier info" icon={Users} onClick={() => toast({ title: "Coming soon" })} colorScheme="secondary" delay={100} />
          <QuickActionCard title="Spend Analytics" description="Analyze spending patterns" icon={BarChart3} onClick={() => toast({ title: "Coming soon" })} colorScheme="success" delay={200} />
          <QuickActionCard title="Track Deliveries" description="Monitor shipment status" icon={Package} onClick={() => toast({ title: "Coming soon" })} colorScheme="warning" delay={300} />
          <QuickActionCard title="Contract Management" description="Manage vendor contracts" icon={CheckCircle} onClick={() => toast({ title: "Coming soon" })} colorScheme="primary" delay={400} />
          <QuickActionCard title="RFQ Management" description="Request for quotations" icon={Clock} onClick={() => toast({ title: "Coming soon" })} colorScheme="secondary" delay={500} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProcurementDashboard;
