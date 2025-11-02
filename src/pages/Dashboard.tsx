import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Users, TrendingUp, ShoppingCart, Briefcase, Database, DollarSign, BarChart3, FileText, Calendar, ClipboardCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        navigate("/auth");
      } else {
        setUser(user);
        setLoading(false);
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

  const modules = [
    {
      title: "Recruitment",
      description: "Manage job postings, applications, and interviews",
      icon: Users,
      stats: { total: "24", active: "12", pending: "8" },
      path: "/recruitment",
      gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
      title: "Sales Pipeline",
      description: "Track deals, forecasts, and customer relationships",
      icon: TrendingUp,
      stats: { pipeline: "$2.4M", deals: "45", conversion: "32%" },
      path: "/sales",
      gradient: "from-green-500/20 to-emerald-500/20"
    },
    {
      title: "Finance",
      description: "Financial automation and invoice processing",
      icon: DollarSign,
      stats: { revenue: "$1.2M", invoices: "89", pending: "12" },
      path: "/finance",
      gradient: "from-yellow-500/20 to-orange-500/20"
    },
    {
      title: "Procurement",
      description: "Supplier management and purchase orders",
      icon: ShoppingCart,
      stats: { orders: "156", suppliers: "34", spend: "$890K" },
      path: "/procurement",
      gradient: "from-purple-500/20 to-pink-500/20"
    },
    {
      title: "Executive Assistant",
      description: "Calendar, tasks, expenses, and travel planning",
      icon: Briefcase,
      stats: { meetings: "18", tasks: "42", expenses: "$5.2K" },
      path: "/executive",
      gradient: "from-red-500/20 to-rose-500/20"
    },
    {
      title: "Data Cleaning",
      description: "Data profiling, quality checks, and transformations",
      icon: Database,
      stats: { datasets: "23", quality: "94%", issues: "8" },
      path: "/data-cleaning",
      gradient: "from-indigo-500/20 to-violet-500/20"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Techstora Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Welcome back, {user?.email}
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
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2.4M</div>
              <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Deals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground mt-1">8 closing this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Open Positions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground mt-1">24 applications pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tasks Due Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground mt-1">3 high priority</p>
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
                  className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-none overflow-hidden"
                  onClick={() => navigate(module.path)}
                >
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
                    <div className="space-y-2">
                      {Object.entries(module.stats).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-muted-foreground capitalize">{key}:</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                    <Button 
                      className="w-full mt-4" 
                      variant="default"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(module.path);
                      }}
                    >
                      View Details
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
              <div className="space-y-4">
                {[
                  { icon: FileText, text: "New application received for Senior Developer", time: "2 hours ago" },
                  { icon: BarChart3, text: "Deal 'Enterprise Package' moved to negotiation", time: "4 hours ago" },
                  { icon: Calendar, text: "Meeting scheduled with ABC Corp", time: "5 hours ago" },
                  { icon: ClipboardCheck, text: "Invoice #1234 approved", time: "1 day ago" },
                ].map((activity, index) => {
                  const ActivityIcon = activity.icon;
                  return (
                    <div key={index} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                      <div className="p-2 rounded-lg bg-muted">
                        <ActivityIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.text}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
