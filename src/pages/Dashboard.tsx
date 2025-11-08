import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Users, TrendingUp, ShoppingCart, Briefcase, Database, DollarSign, BarChart3, FileText, Calendar, ClipboardCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { OnboardingTour } from "@/components/OnboardingTour";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        navigate("/auth");
      } else {
        setUser(user);
        // Fetch user profile with proper error handling
        supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle()
          .then(({ data, error }) => {
            if (error) {
              console.error('Error fetching profile:', error);
            }
            setProfile(data);
            setLoading(false);
          });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out"
    });
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const handleModuleClick = (path: string) => {
    toast({
      title: "Work in Progress",
      description: "This feature is currently under development. Stay tuned!",
      variant: "default",
    });
  };

  const modules = [
    {
      title: "Recruitment",
      description: "Manage job postings, applications, and interviews",
      icon: Users,
      path: "/recruitment",
      gradient: "from-blue-500/20 to-cyan-500/20",
      available: true
    },
    {
      title: "Sales Pipeline",
      description: "Track deals, forecasts, and customer relationships",
      icon: TrendingUp,
      path: "/sales",
      gradient: "from-green-500/20 to-emerald-500/20",
      available: false
    },
    {
      title: "Finance",
      description: "Financial automation and invoice processing",
      icon: DollarSign,
      path: "/finance",
      gradient: "from-yellow-500/20 to-orange-500/20",
      available: false
    },
    {
      title: "Procurement",
      description: "Supplier management and purchase orders",
      icon: ShoppingCart,
      path: "/procurement",
      gradient: "from-purple-500/20 to-pink-500/20",
      available: false
    },
    {
      title: "Executive Assistant",
      description: "Calendar, tasks, expenses, and travel planning",
      icon: Briefcase,
      path: "/executive",
      gradient: "from-red-500/20 to-rose-500/20",
      available: false
    },
    {
      title: "Data Cleaning",
      description: "Data profiling, quality checks, and transformations",
      icon: Database,
      path: "/data-cleaning",
      gradient: "from-indigo-500/20 to-violet-500/20",
      available: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <OnboardingTour onComplete={() => {}} />
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Techstora Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Welcome back, {profile?.full_name || user?.email}
              {profile?.account_type && (
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {profile.account_type === 'business' ? '🏢 Business' : '👤 Personal'}
                </span>
              )}
              {profile?.department && profile.department !== 'general' && (
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-secondary/10 text-secondary">
                  {profile.department.charAt(0).toUpperCase() + profile.department.slice(1).replace('_', ' ')}
                </span>
              )}
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout} size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Message */}
        {profile && (
          <div className="mb-8 p-6 rounded-lg bg-gradient-card border border-border">
            <h2 className="text-2xl font-bold mb-2">
              Welcome to Techstora! 🎉
            </h2>
            <p className="text-muted-foreground">
              {profile.account_type === 'business' 
                ? "Let's automate your business operations and boost productivity."
                : "Discover how AI can simplify your daily tasks and workflows."}
              {profile.department && profile.department !== 'general' && (
                <span className="block mt-2">
                  We've tailored your experience for <strong>{profile.department.replace('_', ' ')}</strong> needs.
                </span>
              )}
            </p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground mt-1">Connect data source</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Deals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground mt-1">No active deals</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Open Positions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground mt-1">No open positions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tasks Due Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground mt-1">No tasks scheduled</p>
            </CardContent>
          </Card>
        </div>

        {/* Module Cards */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Business Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <Card 
                  key={module.path}
                  className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-none overflow-hidden relative"
                  onClick={() => module.available ? navigate(module.path) : handleModuleClick(module.path)}
                >
                  {!module.available && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 font-medium">
                        Coming Soon
                      </span>
                    </div>
                  )}
                  <div className={`absolute inset-0 bg-gradient-to-br ${module.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  <CardHeader className="relative">
                    <div className="flex items-start justify-between">
                      <div className="p-2 rounded-lg bg-primary/10 mb-2">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    <Button 
                      className="w-full" 
                      variant={module.available ? "default" : "outline"}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        module.available ? navigate(module.path) : handleModuleClick(module.path);
                      }}
                    >
                      {module.available ? "View Details" : "Coming Soon"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground text-center py-8">
                No recent activity. Start by exploring the available modules above.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
