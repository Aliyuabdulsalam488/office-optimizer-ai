import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PenTool, Ruler, FileText, Users, Home, Layers } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const ArchitectDashboard = () => {
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
        .single();

      const { data: userRoles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      const hasArchitectRole = userRoles?.some(r => r.role.toString() === "architect");

      if (!hasArchitectRole) {
        toast({
          title: "Access denied",
          description: "This dashboard is for Architects only",
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
      title="Architect Dashboard"
      subtitle={`Welcome back, ${profile?.full_name || user?.email}`}
      icon={<PenTool className="w-8 h-8 text-primary" />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Active Projects" value={12} icon={Home} trend={{ value: "3 new this month", isPositive: true }} colorScheme="primary" />
        <StatCard title="Floor Plans" value={28} icon={FileText} trend={{ value: "8 in progress", isPositive: true }} colorScheme="success" />
        <StatCard title="Clients" value={15} icon={Users} trend={{ value: "All active", isPositive: true }} colorScheme="info" />
        <StatCard title="Reviews Pending" value={5} icon={Layers} trend={{ value: "This week", isPositive: false }} colorScheme="warning" />
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickActionCard title="Floor Plan Editor" description="Create and edit floor plans" icon={Ruler} onClick={() => navigate("/floor-planner")} colorScheme="primary" delay={0} />
          <QuickActionCard title="Create Project" description="Start a new architectural project" icon={FileText} onClick={() => navigate("/floor-planner")} colorScheme="secondary" delay={100} />
          <QuickActionCard title="Client Management" description="Manage client relationships" icon={Users} onClick={() => toast({ title: "Coming soon" })} colorScheme="success" delay={200} />
          <QuickActionCard title="3D Visualization" description="View projects in 3D" icon={Layers} onClick={() => toast({ title: "Coming soon" })} colorScheme="warning" delay={300} />
          <QuickActionCard title="Cost Estimation" description="Estimate project costs" icon={PenTool} onClick={() => toast({ title: "Coming soon" })} colorScheme="primary" delay={400} />
          <QuickActionCard title="Project Reviews" description="Review and approve designs" icon={Home} onClick={() => toast({ title: "Coming soon" })} colorScheme="secondary" delay={500} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ArchitectDashboard;
