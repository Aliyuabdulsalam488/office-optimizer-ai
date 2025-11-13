import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RecruitmentTracking from "@/components/hr/RecruitmentTracking";
import { JobApplicationForm } from "@/components/hr/JobApplicationForm";
import { LogOut, Home, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Recruitment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Allow direct access without authentication
    setLoading(false);

    // Listen for auth changes (optional)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Just log the event, don't redirect
      console.log('Auth state changed:', event);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div className="text-center space-y-2 flex-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Recruitment Management
            </h1>
            <p className="text-muted-foreground">
              Manage job postings, applications, and interviews
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        <Card className="border-none shadow-lg">
          <Tabs defaultValue="jobs" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="jobs">Job Postings</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="interviews">Interviews</TabsTrigger>
              <TabsTrigger value="freelance">
                <Briefcase className="w-4 h-4 mr-2" />
                Apply as Freelancer
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="jobs" className="p-6">
              <RecruitmentTracking view="jobs" />
            </TabsContent>
            
            <TabsContent value="applications" className="p-6">
              <RecruitmentTracking view="applications" />
            </TabsContent>
            
            <TabsContent value="interviews" className="p-6">
              <RecruitmentTracking view="interviews" />
            </TabsContent>

            <TabsContent value="freelance" className="p-6">
              <JobApplicationForm />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Recruitment;