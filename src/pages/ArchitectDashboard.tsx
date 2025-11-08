import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PenTool, Ruler, Home, Layers, Box, DollarSign, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { AnimatedCard } from "@/components/ui/animated-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import FeatureModulesPanel from "@/components/FeatureModulesPanel";

const architectModules = [
  { name: "ai_floor_planner", displayName: "AI Floor Planning", description: "AI-assisted floor plan design and optimization", category: "Design" },
  { name: "code_compliance", displayName: "Code Compliance Checker", description: "Automated building code validation", category: "Compliance" },
  { name: "cost_estimator", displayName: "Cost Estimator", description: "Detailed project cost calculations", category: "Finance" },
  { name: "3d_visualization", displayName: "3D Visualization", description: "Advanced 3D rendering and walkthroughs", category: "Visualization" },
  { name: "collaboration_tools", displayName: "Collaboration Tools", description: "Real-time team collaboration features", category: "Collaboration" },
];

const ArchitectDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [floorPlans, setFloorPlans] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    fetchFloorPlans();
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

  const fetchFloorPlans = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("floor_plans")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      setFloorPlans(data || []);
    } catch (error: any) {
      console.error("Error fetching floor plans:", error);
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
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Active Projects"
          value={floorPlans.length}
          icon={Home}
          trend={{ value: "Total designs", isPositive: true }}
          colorScheme="primary"
        />
        <StatCard
          title="In Review"
          value={floorPlans.filter(fp => fp.status === "review").length}
          icon={CheckCircle}
          trend={{ value: "Pending approval", isPositive: false }}
          colorScheme="warning"
        />
        <StatCard
          title="Completed"
          value={floorPlans.filter(fp => fp.status === "approved").length}
          icon={Layers}
          trend={{ value: "This month", isPositive: true }}
          colorScheme="success"
        />
        <StatCard
          title="Draft Plans"
          value={floorPlans.filter(fp => fp.status === "draft").length}
          icon={Ruler}
          trend={{ value: "In progress", isPositive: true }}
          colorScheme="info"
        />
      </div>

      {/* Quick Actions - Architect Specific */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatedCard
            onClick={() => navigate("/floor-planner")}
            className="p-6 border-2 border-primary/20 hover:border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10"
            delay={0}
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-4 rounded-full bg-gradient-primary">
                <Ruler className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg">New Floor Plan</h3>
              <p className="text-sm text-muted-foreground">Start designing a new project</p>
            </div>
          </AnimatedCard>

          <AnimatedCard
            onClick={() => navigate("/floor-planner")}
            className="p-6 border-2 border-secondary/20 hover:border-secondary/50 bg-gradient-to-br from-secondary/5 to-secondary/10"
            delay={100}
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-4 rounded-full bg-gradient-secondary">
                <Box className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h3 className="font-semibold text-lg">3D Visualization</h3>
              <p className="text-sm text-muted-foreground">View plans in 3D</p>
            </div>
          </AnimatedCard>

          <AnimatedCard
            onClick={() => toast({ title: "Coming soon" })}
            className="p-6 border-2 border-success/20 hover:border-success/50 bg-gradient-to-br from-success/5 to-success/10"
            delay={200}
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-4 rounded-full bg-gradient-success">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg">Cost Estimator</h3>
              <p className="text-sm text-muted-foreground">Calculate project costs</p>
            </div>
          </AnimatedCard>

          <AnimatedCard
            onClick={() => toast({ title: "Coming soon" })}
            className="p-6 border-2 border-warning/20 hover:border-warning/50 bg-gradient-to-br from-warning/5 to-warning/10"
            delay={300}
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-4 rounded-full bg-gradient-warning">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg">Code Compliance</h3>
              <p className="text-sm text-muted-foreground">Check building codes</p>
            </div>
          </AnimatedCard>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Recent Projects</h2>
          <Button onClick={() => navigate("/floor-planner")} variant="outline">
            View All
          </Button>
        </div>

        {floorPlans.length === 0 ? (
          <AnimatedCard className="p-12 text-center">
            <PenTool className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-6">Start your first floor plan design</p>
            <Button onClick={() => navigate("/floor-planner")} variant="gradient">
              Create First Project
            </Button>
          </AnimatedCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {floorPlans.map((plan, index) => (
              <AnimatedCard
                key={plan.id}
                onClick={() => navigate("/floor-planner")}
                delay={index * 100}
                className="p-6 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Home className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        {plan.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {plan.project_type || "Residential"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      plan.status === "approved"
                        ? "bg-success/10 text-success"
                        : plan.status === "review"
                        ? "bg-warning/10 text-warning"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {plan.status}
                  </span>
                </div>

                {plan.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {plan.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3 h-3" />
                    {plan.area_sqm ? `${plan.area_sqm} sqm` : "N/A"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(plan.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </AnimatedCard>
            ))}
          </div>
        )}
      </div>

      {/* Project Progress */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Project Progress</h2>
        <AnimatedCard className="p-6">
          <div className="space-y-6">
            {[
              { phase: "Design Phase", progress: 75, color: "bg-primary" },
              { phase: "Review & Approval", progress: 45, color: "bg-warning" },
              { phase: "Final Documentation", progress: 30, color: "bg-success" },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">{item.phase}</span>
                  <span className="text-muted-foreground">{item.progress}%</span>
                </div>
                <Progress value={item.progress} className="h-2" />
              </div>
            ))}
          </div>
        </AnimatedCard>
      </div>

      {/* Feature Modules */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Enable Additional Features</h2>
        <FeatureModulesPanel roleModules={architectModules} />
      </div>
    </DashboardLayout>
  );
};

export default ArchitectDashboard;
