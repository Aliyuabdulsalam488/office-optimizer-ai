import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, LogOut, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FeatureModulesPanel from "@/components/FeatureModulesPanel";

const FeatureSettings = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
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

      const { data: rolesData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      setUser(user);
      setProfile(profileData);
      setUserRoles(rolesData?.map(r => r.role.toString()) || []);
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

  const getModulesForRole = (role: string) => {
    const modulesByRole: Record<string, any[]> = {
      hr_manager: [
        { name: "employee_management", label: "Employee Management", description: "Manage employee records and profiles" },
        { name: "leave_management", label: "Leave Management", description: "Handle leave requests and approvals" },
        { name: "performance_reviews", label: "Performance Reviews", description: "Conduct and track performance reviews" },
        { name: "onboarding_workflow", label: "Onboarding Workflow", description: "Streamline new employee onboarding" },
      ],
      finance_manager: [
        { name: "invoice_automation", label: "Invoice Automation", description: "Automate invoice processing and approvals" },
        { name: "expense_tracking", label: "Expense Tracking", description: "Track and categorize business expenses" },
        { name: "financial_forecasting", label: "Financial Forecasting", description: "AI-powered financial predictions" },
        { name: "budget_management", label: "Budget Management", description: "Create and monitor departmental budgets" },
      ],
      sales_manager: [
        { name: "crm_integration", label: "CRM Integration", description: "Connect with Salesforce, HubSpot, or Pipedrive" },
        { name: "lead_scoring", label: "AI Lead Scoring", description: "Automatically score and prioritize leads" },
        { name: "sales_forecasting", label: "Sales Forecasting", description: "Predict future revenue with AI" },
        { name: "territory_management", label: "Territory Management", description: "Manage and optimize sales territories" },
      ],
      executive: [
        { name: "calendar_management", label: "Calendar Management", description: "AI-powered meeting scheduling and coordination" },
        { name: "travel_planning", label: "Travel Planning", description: "Book flights, hotels, and manage itineraries" },
        { name: "expense_tracking", label: "Expense Tracking", description: "Track and submit business expenses" },
        { name: "task_management", label: "Task Management", description: "Manage daily tasks and priorities" },
      ],
      procurement_manager: [
        { name: "supplier_management", label: "Supplier Management", description: "Manage vendor relationships and contracts" },
        { name: "purchase_orders", label: "Purchase Orders", description: "Create and track purchase orders" },
        { name: "spend_analytics", label: "Spend Analytics", description: "Analyze spending patterns and savings" },
        { name: "rfq_management", label: "RFQ Management", description: "Manage request for quotations" },
      ],
      architect: [
        { name: "floor_plan_designer", label: "Floor Plan Designer", description: "AI-powered floor plan creation" },
        { name: "3d_visualization", label: "3D Visualization", description: "View and present designs in 3D" },
        { name: "cost_estimation", label: "Cost Estimation", description: "Estimate project costs automatically" },
        { name: "collaboration_tools", label: "Collaboration Tools", description: "Share and collaborate on designs" },
      ],
      home_builder: [
        { name: "project_management", label: "Project Management", description: "Track construction projects and timelines" },
        { name: "material_ordering", label: "Material Ordering", description: "Order and track building materials" },
        { name: "subcontractor_management", label: "Subcontractor Management", description: "Manage subcontractor relationships" },
        { name: "quality_control", label: "Quality Control", description: "Ensure quality standards are met" },
      ],
    };

    return modulesByRole[role] || [];
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
              <Settings className="w-6 h-6 text-primary" />
              Feature Settings
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your optional feature modules
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate(-1)} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={handleLogout} variant="ghost">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Roles</CardTitle>
            <CardDescription>
              Enable additional features for each of your roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {userRoles.map((role) => (
                <span
                  key={role}
                  className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                >
                  {role.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </span>
              ))}
              {userRoles.length === 0 && (
                <p className="text-sm text-muted-foreground">No roles assigned yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {userRoles.map((role) => {
            const modules = getModulesForRole(role);
            if (modules.length === 0) return null;

            return (
              <Card key={role}>
                <CardHeader>
                  <CardTitle>
                    {role.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} Modules
                  </CardTitle>
                  <CardDescription>
                    Optional features for your {role.replace(/_/g, ' ')} role
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FeatureModulesPanel
                    roleModules={modules.map(m => ({
                      name: m.name,
                      displayName: m.label,
                      description: m.description,
                      category: role.replace(/_/g, ' ')
                    }))}
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {userRoles.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                No feature modules available yet. Contact your administrator to assign roles.
              </p>
              <Button onClick={() => navigate("/dashboard")}>
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default FeatureSettings;