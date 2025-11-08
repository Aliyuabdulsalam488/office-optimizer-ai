import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FloorPlanList from "@/components/floorplanner/FloorPlanList";
import CreateFloorPlan from "@/components/floorplanner/CreateFloorPlan";
import FloorPlanEditor from "@/components/floorplanner/FloorPlanEditor";
import ReviewDashboard from "@/components/floorplanner/ReviewDashboard";

const FloorPlanner = () => {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    // Check user role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (roleData) {
      setUserRole(roleData.role);
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logged out successfully" });
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <div className="text-center max-w-md p-8">
          <h2 className="text-2xl font-bold mb-4">Access Required</h2>
          <p className="text-muted-foreground mb-6">
            You need to be assigned a role (Architect or Reviewer) to access the Floor Planner module.
            Please contact your administrator.
          </p>
          <Button onClick={handleLogout} variant="outline">
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  if (selectedPlanId) {
    return (
      <FloorPlanEditor
        planId={selectedPlanId}
        onBack={() => setSelectedPlanId(null)}
      />
    );
  }

  if (showCreate) {
    return (
      <CreateFloorPlan
        onBack={() => setShowCreate(false)}
        onCreated={(planId) => {
          setShowCreate(false);
          setSelectedPlanId(planId);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Floor Planner</h1>
            <p className="text-sm text-muted-foreground">
              {userRole === 'architect' ? 'Design & Edit Floor Plans' : 'Review Floor Plans'}
            </p>
          </div>
          <div className="flex gap-2">
            {userRole === 'architect' && (
              <Button onClick={() => setShowCreate(true)} className="bg-gradient-primary">
                <Plus className="w-4 h-4 mr-2" />
                New Floor Plan
              </Button>
            )}
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue={userRole === 'architect' ? 'my-plans' : 'review'} className="w-full">
          <TabsList className="mb-6">
            {userRole === 'architect' && (
              <TabsTrigger value="my-plans">My Floor Plans</TabsTrigger>
            )}
            {userRole === 'reviewer' && (
              <TabsTrigger value="review">Review Queue</TabsTrigger>
            )}
          </TabsList>

          {userRole === 'architect' && (
            <TabsContent value="my-plans">
              <FloorPlanList onSelectPlan={setSelectedPlanId} />
            </TabsContent>
          )}

          {userRole === 'reviewer' && (
            <TabsContent value="review">
              <ReviewDashboard onSelectPlan={setSelectedPlanId} />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
};

export default FloorPlanner;
