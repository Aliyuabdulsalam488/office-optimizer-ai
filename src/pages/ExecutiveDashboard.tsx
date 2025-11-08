import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Briefcase, Calendar, FileText, Plane, Receipt, CheckSquare, Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { AnimatedCard } from "@/components/ui/animated-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const ExecutiveDashboard = () => {
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

      const hasExecutiveRole = userRoles?.some(r => r.role.toString() === "executive");

      if (!hasExecutiveRole) {
        toast({
          title: "Access denied",
          description: "This dashboard is for Executives only",
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
      title="Executive Assistant Dashboard"
      subtitle={`Welcome back, ${profile?.full_name || user?.email}`}
      icon={<Briefcase className="w-8 h-8 text-primary" />}
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Today's Meetings"
          value={8}
          icon={Calendar}
          trend={{ value: "3 upcoming", isPositive: true }}
          colorScheme="primary"
        />
        <StatCard
          title="Pending Tasks"
          value={24}
          icon={CheckSquare}
          trend={{ value: "12 urgent", isPositive: false }}
          colorScheme="warning"
        />
        <StatCard
          title="Expenses to Review"
          value="$2,450"
          icon={Receipt}
          trend={{ value: "5 items", isPositive: false }}
          colorScheme="info"
        />
        <StatCard
          title="Upcoming Trips"
          value={3}
          icon={Plane}
          trend={{ value: "Next 30 days", isPositive: true }}
          colorScheme="success"
        />
      </div>

      {/* Today's Schedule */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Today's Schedule</h2>
        <AnimatedCard className="p-6">
          <div className="space-y-4">
            {[
              { time: "9:00 AM", title: "Executive Team Meeting", attendees: "5 attendees", status: "upcoming" },
              { time: "11:30 AM", title: "Client Presentation Prep", attendees: "3 attendees", status: "upcoming" },
              { time: "2:00 PM", title: "Budget Review", attendees: "2 attendees", status: "upcoming" },
              { time: "4:00 PM", title: "Q4 Planning Session", attendees: "8 attendees", status: "upcoming" },
            ].map((meeting, index) => (
              <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="w-20 text-center">
                  <p className="text-sm font-semibold text-primary">{meeting.time}</p>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{meeting.title}</p>
                  <p className="text-sm text-muted-foreground">{meeting.attendees}</p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">
                  {meeting.status}
                </span>
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
            title="Schedule Meeting"
            description="Book time on executive's calendar"
            icon={Calendar}
            onClick={() => toast({ title: "Coming soon" })}
            colorScheme="primary"
            delay={0}
          />
          <QuickActionCard
            title="Plan Travel"
            description="Arrange flights and accommodations"
            icon={Plane}
            onClick={() => toast({ title: "Coming soon" })}
            colorScheme="secondary"
            delay={100}
          />
          <QuickActionCard
            title="Manage Expenses"
            description="Review and submit expense reports"
            icon={Receipt}
            onClick={() => toast({ title: "Coming soon" })}
            colorScheme="warning"
            delay={200}
          />
          <QuickActionCard
            title="Task Management"
            description="Track and prioritize daily tasks"
            icon={CheckSquare}
            onClick={() => toast({ title: "Coming soon" })}
            colorScheme="success"
            delay={300}
          />
          <QuickActionCard
            title="Email Management"
            description="Organize and respond to emails"
            icon={Mail}
            onClick={() => toast({ title: "Coming soon" })}
            colorScheme="primary"
            delay={400}
          />
          <QuickActionCard
            title="Call Log"
            description="Manage incoming and outgoing calls"
            icon={Phone}
            onClick={() => toast({ title: "Coming soon" })}
            colorScheme="secondary"
            delay={500}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ExecutiveDashboard;