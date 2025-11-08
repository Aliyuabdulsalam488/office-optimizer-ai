import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, Search, LogIn, LogOut, Shield, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface UserActivity {
  id: string;
  user_id: string;
  activity_type: string;
  device_info: any;
  created_at: string;
  profiles?: {
    email: string;
    full_name: string;
  };
}

interface UserStats {
  total_users: number;
  active_today: number;
  active_this_week: number;
  recent_signups: number;
}

export const UserActivityTracker = () => {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadActivity();
    loadStats();
  }, []);

  const loadActivity = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_activity")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;

      // Enrich with user profile data
      const enrichedActivities = await Promise.all(
        (data || []).map(async (activity) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("email, full_name")
            .eq("id", activity.user_id)
            .single();

          return {
            ...activity,
            profiles: profile || undefined,
          };
        })
      );

      setActivities(enrichedActivities);
    } catch (error: any) {
      toast({
        title: "Error loading activity",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const now = new Date();
      const todayStart = new Date(now.setHours(0, 0, 0, 0)).toISOString();
      const weekStart = new Date(
        now.setDate(now.getDate() - 7)
      ).toISOString();

      const { count: totalUsers } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      const { count: activeToday } = await supabase
        .from("user_activity")
        .select("user_id", { count: "exact", head: true })
        .eq("activity_type", "login")
        .gte("created_at", todayStart);

      const { count: activeThisWeek } = await supabase
        .from("user_activity")
        .select("user_id", { count: "exact", head: true })
        .eq("activity_type", "login")
        .gte("created_at", weekStart);

      const { count: recentSignups } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", weekStart);

      setStats({
        total_users: totalUsers || 0,
        active_today: activeToday || 0,
        active_this_week: activeThisWeek || 0,
        recent_signups: recentSignups || 0,
      });
    } catch (error: any) {
      console.error("Error loading stats:", error);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "login":
        return <LogIn className="w-4 h-4 text-green-500" />;
      case "logout":
        return <LogOut className="w-4 h-4 text-gray-500" />;
      case "password_reset":
        return <Shield className="w-4 h-4 text-yellow-500" />;
      case "email_verified":
        return <Mail className="w-4 h-4 text-blue-500" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityBadge = (type: string) => {
    const colors: Record<string, string> = {
      login: "bg-green-500/10 text-green-500",
      logout: "bg-gray-500/10 text-gray-500",
      password_reset: "bg-yellow-500/10 text-yellow-500",
      email_verified: "bg-blue-500/10 text-blue-500",
    };

    return (
      <Badge variant="outline" className={colors[type] || "bg-gray-500/10"}>
        {getActivityIcon(type)}
        <span className="ml-1">{type.replace(/_/g, " ")}</span>
      </Badge>
    );
  };

  const filteredActivities = activities.filter((activity) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      activity.activity_type.toLowerCase().includes(query) ||
      activity.profiles?.email?.toLowerCase().includes(query) ||
      activity.profiles?.full_name?.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <Card className="p-6">
        <LoadingSpinner size="sm" text="Loading activity..." />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Users</div>
            <div className="text-2xl font-bold">{stats.total_users}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Active Today</div>
            <div className="text-2xl font-bold">{stats.active_today}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">
              Active This Week
            </div>
            <div className="text-2xl font-bold">{stats.active_this_week}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">
              New This Week
            </div>
            <div className="text-2xl font-bold">{stats.recent_signups}</div>
          </Card>
        </div>
      )}

      {/* Activity Log */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Activity className="w-6 h-6 text-primary" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold">User Activity</h3>
            <p className="text-sm text-muted-foreground">
              Recent user logins and actions
            </p>
          </div>
        </div>

        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search activity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <ScrollArea className="h-[500px]">
          <div className="space-y-3">
            {filteredActivities.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No activity found
              </p>
            ) : (
              filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getActivityBadge(activity.activity_type)}
                      <div>
                        <p className="text-sm font-medium">
                          {activity.profiles?.full_name || "Unknown User"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.profiles?.email || "N/A"}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(activity.created_at).toLocaleString()}
                    </span>
                  </div>
                  {activity.device_info && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      {activity.device_info.browser &&
                        `Browser: ${activity.device_info.browser}`}
                      {activity.device_info.os &&
                        ` • OS: ${activity.device_info.os}`}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};
