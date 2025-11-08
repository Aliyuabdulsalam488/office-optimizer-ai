import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Camera, Shield, Bell, Check, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const optionalSteps = [
  {
    id: "profile_photo",
    title: "Add Profile Photo",
    description: "Upload a photo to personalize your account",
    icon: Camera,
  },
  {
    id: "two_factor",
    title: "Enable Two-Factor Authentication",
    description: "Secure your account with an extra layer of protection",
    icon: Shield,
  },
  {
    id: "notifications",
    title: "Set Notification Preferences",
    description: "Choose how you want to be notified",
    icon: Bell,
  },
];

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
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

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setUser(user);
    setProfile(profileData);
  };

  const handleSkipStep = async () => {
    const step = optionalSteps[currentStep];
    
    await supabase.from("onboarding_steps").upsert({
      user_id: user.id,
      step_name: step.id,
      skipped: true,
    });

    if (currentStep < optionalSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleCompleteStep = async () => {
    const step = optionalSteps[currentStep];
    
    await supabase.from("onboarding_steps").upsert({
      user_id: user.id,
      step_name: step.id,
      completed: true,
      completed_at: new Date().toISOString(),
    });

    setCompletedSteps([...completedSteps, step.id]);

    toast({
      title: "Step completed",
      description: `${step.title} has been set up successfully`,
    });

    if (currentStep < optionalSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const completeOnboarding = async () => {
    await supabase
      .from("profiles")
      .update({ onboarding_completed: true })
      .eq("id", user.id);

    toast({
      title: "Welcome to TechStora!",
      description: "Your account setup is complete",
    });

    // Get user role to determine redirect
    const { data: userRoles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);

    const role = userRoles?.[0]?.role?.toString();
    
    // Role-based routing map
    const roleRoutes: Record<string, string> = {
      hr_manager: "/hr-dashboard",
      finance_manager: "/finance-dashboard",
      architect: "/architect-dashboard",
      home_builder: "/home-builder-dashboard",
      executive: "/executive-dashboard",
      executive_assistant: "/ea-dashboard",
      sales_manager: "/sales-dashboard",
      procurement_manager: "/procurement-dashboard",
      employee: "/employee-dashboard",
      admin: "/dashboard",
    };
    
    navigate(roleRoutes[role] || "/employee-dashboard");
  };

  const progress = ((currentStep + 1) / optionalSteps.length) * 100;
  const currentStepData = optionalSteps[currentStep];
  const StepIcon = currentStepData.icon;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
          <p className="text-muted-foreground mb-4">
            These optional features will enhance your TechStora experience
          </p>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            Step {currentStep + 1} of {optionalSteps.length}
          </p>
        </div>

        <div className="bg-gradient-card p-8 rounded-lg mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <StepIcon className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{currentStepData.title}</h2>
              <p className="text-muted-foreground">{currentStepData.description}</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-background/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              {currentStepData.id === "profile_photo" && (
                "A profile photo helps your colleagues recognize you and makes your profile more personal."
              )}
              {currentStepData.id === "two_factor" && (
                "Two-factor authentication adds an extra layer of security by requiring a verification code in addition to your password."
              )}
              {currentStepData.id === "notifications" && (
                "Choose how and when you want to receive notifications about important updates and activities."
              )}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={handleCompleteStep}
            className="flex-1 bg-gradient-primary"
          >
            <Check className="w-4 h-4 mr-2" />
            Set Up Now
          </Button>
          <Button
            onClick={handleSkipStep}
            variant="outline"
            className="flex-1"
          >
            Skip for Now
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="mt-6 text-center">
          <Button
            onClick={completeOnboarding}
            variant="ghost"
            size="sm"
          >
            Skip All & Go to Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Onboarding;
