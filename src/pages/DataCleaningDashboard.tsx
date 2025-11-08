import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Database, AlertTriangle, CheckCircle, TrendingUp, FileText, Filter, Layers, GitMerge } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { AnimatedCard } from "@/components/ui/animated-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const DataCleaningDashboard = () => {
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

      const hasDataRole = userRoles?.some(r => r.role.toString() === "data_analyst");

      if (!hasDataRole) {
        toast({
          title: "Access denied",
          description: "This dashboard is for Data Analysts only",
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

  const dataQualityMetrics = [
    { label: "Completeness", score: 87, issues: 234, color: "bg-success" },
    { label: "Accuracy", score: 92, issues: 156, color: "bg-primary" },
    { label: "Consistency", score: 78, issues: 412, color: "bg-warning" },
    { label: "Validity", score: 95, issues: 89, color: "bg-info" },
  ];

  return (
    <DashboardLayout
      title="Data Cleaning Dashboard"
      subtitle={`Welcome back, ${profile?.full_name || user?.email}`}
      icon={<Database className="w-8 h-8 text-primary" />}
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Overall Data Quality"
          value="88%"
          icon={TrendingUp}
          trend={{ value: "5% improvement", isPositive: true }}
          colorScheme="success"
        />
        <StatCard
          title="Total Records"
          value="1.2M"
          icon={Database}
          trend={{ value: "125K this month", isPositive: true }}
          colorScheme="primary"
        />
        <StatCard
          title="Issues Detected"
          value={891}
          icon={AlertTriangle}
          trend={{ value: "234 resolved", isPositive: true }}
          colorScheme="warning"
        />
        <StatCard
          title="Duplicates Found"
          value={156}
          icon={GitMerge}
          trend={{ value: "89 merged", isPositive: true }}
          colorScheme="info"
        />
      </div>

      {/* Data Quality Breakdown */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Data Quality Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatedCard className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Quality Dimensions
            </h3>
            <div className="space-y-4">
              {dataQualityMetrics.map((metric, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">{metric.label}</span>
                    <span className="text-muted-foreground">{metric.score}% • {metric.issues} issues</span>
                  </div>
                  <Progress value={metric.score} className="h-2" />
                </div>
              ))}
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6" delay={100}>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Critical Issues
            </h3>
            <div className="space-y-3">
              {[
                { type: "Missing Values", count: 234, severity: "high", table: "customers" },
                { type: "Invalid Format", count: 156, severity: "medium", table: "transactions" },
                { type: "Duplicate Records", count: 89, severity: "high", table: "products" },
                { type: "Outliers", count: 67, severity: "low", table: "sales" },
              ].map((issue, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="text-sm font-medium">{issue.type}</p>
                    <p className="text-xs text-muted-foreground">{issue.table} table • {issue.count} records</p>
                  </div>
                  <Badge variant={issue.severity === "high" ? "destructive" : issue.severity === "medium" ? "default" : "secondary"}>
                    {issue.severity}
                  </Badge>
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
            title="Data Profiling"
            description="Analyze data structure and quality"
            icon={FileText}
            onClick={() => toast({ title: "Coming soon" })}
            colorScheme="primary"
            delay={0}
          />
          <QuickActionCard
            title="Duplicate Detection"
            description="Find and merge duplicate records"
            icon={GitMerge}
            onClick={() => toast({ title: "Coming soon" })}
            colorScheme="secondary"
            delay={100}
          />
          <QuickActionCard
            title="Validation Rules"
            description="Define data quality rules"
            icon={CheckCircle}
            onClick={() => toast({ title: "Coming soon" })}
            colorScheme="success"
            delay={200}
          />
          <QuickActionCard
            title="Data Transformation"
            description="Clean and standardize data"
            icon={Layers}
            onClick={() => toast({ title: "Coming soon" })}
            colorScheme="warning"
            delay={300}
          />
          <QuickActionCard
            title="Filter & Sort"
            description="Apply advanced data filters"
            icon={Filter}
            onClick={() => toast({ title: "Coming soon" })}
            colorScheme="primary"
            delay={400}
          />
          <QuickActionCard
            title="Quality Assessment"
            description="Run comprehensive quality checks"
            icon={TrendingUp}
            onClick={() => toast({ title: "Coming soon" })}
            colorScheme="secondary"
            delay={500}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DataCleaningDashboard;
