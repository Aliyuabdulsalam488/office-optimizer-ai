import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Ruler, FileText, Users, Settings, LogOut, PenTool } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

      // Check if user has architect role
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <PenTool className="w-6 h-6 text-primary" />
              Architect Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {profile?.full_name || user?.email}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/profile-settings")} variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button onClick={handleLogout} variant="ghost">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Ruler className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Projects</p>
                <h3 className="text-2xl font-bold">--</h3>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Floor Plans</p>
                <h3 className="text-2xl font-bold">--</h3>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Clients</p>
                <h3 className="text-2xl font-bold">--</h3>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button 
                onClick={() => navigate("/floor-planner")} 
                className="w-full justify-start" 
                variant="outline"
              >
                <Ruler className="w-4 h-4 mr-2" />
                Floor Plan Editor
              </Button>
              <Button 
                onClick={() => navigate("/floor-planner")} 
                className="w-full justify-start" 
                variant="outline"
              >
                <FileText className="w-4 h-4 mr-2" />
                Create New Project
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => toast({
                  title: "Work in Progress",
                  description: "Client management feature coming soon!",
                })}
              >
                <Users className="w-4 h-4 mr-2" />
                Client Management
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Projects</h3>
            <p className="text-sm text-muted-foreground">
              No recent projects to display
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ArchitectDashboard;
