import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, FileText, Briefcase, BookOpen, Award, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { AnimatedCard } from "@/components/ui/animated-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Progress } from "@/components/ui/progress";
import { triggerSuccessConfetti } from "@/utils/confetti";
import FeatureModulesPanel from "@/components/FeatureModulesPanel";

const employeeModules = [
  { name: "personal_development", displayName: "Personal Development", description: "Track your learning and career growth", category: "Development" },
  { name: "wellness_programs", displayName: "Wellness Programs", description: "Access health and wellness resources", category: "Wellness" },
  { name: "time_tracking", displayName: "Time Tracking", description: "Log work hours and attendance", category: "Productivity" },
  { name: "collaboration_tools", displayName: "Collaboration Tools", description: "Enhanced team communication features", category: "Collaboration" },
  { name: "recognition_rewards", displayName: "Recognition & Rewards", description: "Earn badges and rewards for achievements", category: "Engagement" },
];

const EmployeeDashboard = () => {
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

  const handleTaskComplete = () => {
    triggerSuccessConfetti();
    toast({
      title: "Great job! 🎉",
      description: "Task completed successfully",
    });
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
      title="Employee Dashboard"
      subtitle={`Welcome, ${profile?.full_name || user?.email}`}
      icon={<Briefcase className="w-8 h-8 text-primary" />}
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Leave Balance"
          value="12 days"
          icon={Calendar}
          trend={{ value: "Remaining this year", isPositive: true }}
          colorScheme="primary"
        />
        <StatCard
          title="Tasks Assigned"
          value={8}
          icon={CheckCircle}
          trend={{ value: "3 due today", isPositive: false }}
          colorScheme="warning"
        />
        <StatCard
          title="Trainings"
          value={2}
          icon={BookOpen}
          trend={{ value: "1 upcoming", isPositive: true }}
          colorScheme="info"
        />
        <StatCard
          title="Achievements"
          value={15}
          icon={Award}
          trend={{ value: "This quarter", isPositive: true }}
          colorScheme="success"
        />
      </div>

      {/* Current Tasks */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Current Tasks</h2>
        <AnimatedCard className="p-6">
          <div className="space-y-4">
            {[
              { task: "Complete Q4 Report", progress: 75, due: "Today", priority: "high" },
              { task: "Team Meeting Preparation", progress: 50, due: "Tomorrow", priority: "medium" },
              { task: "Code Review - Feature X", progress: 90, due: "This Week", priority: "low" },
              { task: "Update Documentation", progress: 30, due: "Next Week", priority: "medium" },
            ].map((item, index) => (
              <div key={index} className="group">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleTaskComplete}
                      className="w-5 h-5 rounded border-2 border-primary hover:bg-primary transition-colors"
                    />
                    <span className="font-medium">{item.task}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.priority === "high" ? "bg-destructive/10 text-destructive" :
                      item.priority === "medium" ? "bg-warning/10 text-warning" :
                      "bg-success/10 text-success"
                    }`}>
                      {item.priority}
                    </span>
                    <span className="text-sm text-muted-foreground">{item.due}</span>
                  </div>
                </div>
                <Progress value={item.progress} className="h-2" />
              </div>
            ))}
          </div>
        </AnimatedCard>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickActionCard
            title="Request Leave"
            description="Submit time-off requests"
            icon={Calendar}
            onClick={() => toast({ title: "Coming soon" })}
            colorScheme="primary"
            delay={0}
          />
          <QuickActionCard
            title="View Payslips"
            description="Access payment history"
            icon={FileText}
            onClick={() => toast({ title: "Coming soon" })}
            colorScheme="secondary"
            delay={100}
          />
          <QuickActionCard
            title="Training Programs"
            description="Browse available courses"
            icon={BookOpen}
            onClick={() => toast({ title: "Coming soon" })}
            colorScheme="success"
            delay={200}
          />
          <QuickActionCard
            title="Team Directory"
            description="Connect with colleagues"
            icon={Briefcase}
            onClick={() => toast({ title: "Coming soon" })}
            colorScheme="warning"
            delay={300}
          />
          <QuickActionCard
            title="Performance Reviews"
            description="View feedback and goals"
            icon={Award}
            onClick={() => toast({ title: "Coming soon" })}
            colorScheme="primary"
            delay={400}
          />
          <QuickActionCard
            title="Benefits Info"
            description="Explore employee benefits"
            icon={CheckCircle}
            onClick={() => toast({ title: "Coming soon" })}
            colorScheme="secondary"
            delay={500}
          />
        </div>
      </div>

      {/* Feature Modules */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Enable Additional Features</h2>
        <FeatureModulesPanel roleModules={employeeModules} />
      </div>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
