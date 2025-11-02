import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";

interface OnboardingStep {
  title: string;
  description: string;
  image?: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    title: "Welcome to Techstora!",
    description: "Your AI-powered business automation platform. Let's take a quick tour to help you get started.",
  },
  {
    title: "Access Your Dashboard",
    description: "Your dashboard is the central hub where you can access all services, chat with AI assistants, and manage your workflows.",
  },
  {
    title: "Meet Your AI Assistants",
    description: "Each department has a dedicated AI assistant ready to help: Hilda (HR), Penny (Finance), Sally (Procurement), Freddy (Sales), Eva (Executive), and Clara (Data).",
  },
  {
    title: "Explore Services",
    description: "Navigate through HR, Finance, Sales, Procurement, Executive, and Data Cleaning services. Each module contains powerful tools tailored to your needs.",
  },
  {
    title: "Need Help?",
    description: "Visit the Help & Documentation page anytime for detailed guides, troubleshooting tips, and feature updates. Click 'Get Started' to begin!",
  },
];

interface OnboardingTourProps {
  onComplete: () => void;
}

export const OnboardingTour = ({ onComplete }: OnboardingTourProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem("techstora_onboarding_completed");
    if (!hasCompletedOnboarding) {
      setIsOpen(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem("techstora_onboarding_completed", "true");
    setIsOpen(false);
    onComplete();
  };

  const handleSkip = () => {
    localStorage.setItem("techstora_onboarding_completed", "true");
    setIsOpen(false);
    onComplete();
  };

  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;
  const currentStepData = onboardingSteps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{currentStepData.title}</DialogTitle>
          <DialogDescription className="text-base pt-2">
            {currentStepData.description}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Step {currentStep + 1} of {onboardingSteps.length}
          </p>
        </div>

        {currentStep === onboardingSteps.length - 1 && (
          <div className="flex justify-center py-4">
            <CheckCircle className="h-16 w-16 text-primary" />
          </div>
        )}

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="ghost" onClick={handleSkip} className="w-full sm:w-auto">
            Skip Tour
          </Button>
          
          <div className="flex gap-2 flex-1">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePrevious} className="flex-1">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
            )}
            
            <Button onClick={handleNext} className="flex-1">
              {currentStep === onboardingSteps.length - 1 ? "Get Started" : "Next"}
              {currentStep < onboardingSteps.length - 1 && (
                <ArrowRight className="h-4 w-4 ml-2" />
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
