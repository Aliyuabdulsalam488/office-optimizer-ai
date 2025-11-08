import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Users, Calendar, TrendingUp, UserPlus, Clock, Award, FileText, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { AnimatedCard } from "@/components/ui/animated-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { HRMetricsChart } from "@/components/dashboard/HRMetricsChart";
import FeatureModulesPanel from "@/components/FeatureModulesPanel";

const hrModules = [
  { name: "advanced_recruitment", displayName: "Advanced Recruitment", description: "AI-powered candidate screening and matching", category: "Recruitment" },
  { name: "performance_analytics", displayName: "Performance Analytics", description: "Detailed performance tracking and insights", category: "Performance" },
  { name: "payroll_integration", displayName: "Payroll Integration", description: "Seamless payroll processing integration", category: "Payroll" },
  { name: "learning_management", displayName: "Learning Management", description: "Employee training and development tracking", category: "Development" },
  { name: "ai_voice_interviews", displayName: "AI Voice Interviews", description: "Automated voice-based candidate interviews", category: "Recruitment" },
];

const HRDashboard = () => {
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

      const hasHRRole = userRoles?.some(r => r.role.toString() === "hr_manager");

      if (!hasHRRole) {
        toast({
          title: "Access denied",
          description: "This dashboard is for HR Managers only",
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
      title="HR Manager Dashboard"
      subtitle={`Welcome back, ${profile?.full_name || user?.email}`}
      icon={<Users className="w-8 h-8 text-primary" />}
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Employees"
          value={245}
          icon={Users}
          trend={{ value: "12% from last month", isPositive: true }}
          colorScheme="primary"
        />
        <StatCard
          title="New Hires This Month"
          value={18}
          icon={UserPlus}
          trend={{ value: "8% from last month", isPositive: true }}
          colorScheme="success"
        />
        <StatCard
          title="Pending Leave Requests"
          value={7}
          icon={Clock}
          trend={{ value: "3 urgent", isPositive: false }}
          colorScheme="warning"
        />
        <StatCard
          title="Performance Reviews Due"
          value={32}
          icon={Award}
          trend={{ value: "Due this week", isPositive: false }}
          colorScheme="info"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickActionCard
            title="Recruitment Tracking"
            description="Manage job postings and candidate pipeline"
            icon={Target}
            onClick={() => navigate("/recruitment")}
            colorScheme="primary"
            delay={0}
          />
          <QuickActionCard
            title="Employee Management"
            description="View and manage employee records"
            icon={Users}
            onClick={() => toast({ title: "Coming soon" })}
            colorScheme="secondary"
            delay={100}
          />
          <QuickActionCard
            title="Leave Management"
            description="Review and approve leave requests"
            icon={Calendar}
            onClick={() => toast({ title: "Coming soon" })}
            colorScheme="success"
            delay={200}
          />
          <QuickActionCard
            title="Performance Reviews"
            description="Conduct and track performance evaluations"
            icon={Award}
            onClick={() => toast({ title: "Coming soon" })}
            colorScheme="warning"
            delay={300}
          />
          <QuickActionCard
            title="Onboarding Workflows"
            description="Set up new hire onboarding processes"
            icon={UserPlus}
            onClick={() => toast({ title: "Coming soon" })}
            colorScheme="primary"
            delay={400}
          />
          <QuickActionCard
            title="Reports & Analytics"
            description="View HR metrics and insights"
            icon={FileText}
            onClick={() => toast({ title: "Coming soon" })}
            colorScheme="secondary"
            delay={500}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
        <AnimatedCard className="p-6">
          <div className="space-y-4">
            {[
              { name: "John Smith", action: "submitted leave request", time: "2 hours ago", icon: Clock },
              { name: "Sarah Johnson", action: "completed onboarding", time: "5 hours ago", icon: UserPlus },
              { name: "Mike Davis", action: "performance review scheduled", time: "1 day ago", icon: Award },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="p-2 rounded-lg bg-primary/10">
                  <activity.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    <span className="font-semibold">{activity.name}</span> {activity.action}
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedCard>
      </div>

      {/* HR Analytics */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">HR Analytics</h2>
        <HRMetricsChart />
      </div>

      {/* Feature Modules */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Enable Additional Features</h2>
        <FeatureModulesPanel roleModules={hrModules} />
      </div>
    </DashboardLayout>
  );
};

export default HRDashboard;
