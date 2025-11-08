import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Upload, Palette, Building2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BusinessSetupFormProps {
  onComplete: () => void;
}

export const BusinessSetupForm = ({ onComplete }: BusinessSetupFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [businessInfo, setBusinessInfo] = useState({
    name: "",
    description: "",
    industry: "",
    size: "",
    brandColors: {
      primary: "#6366f1",
      secondary: "#8b5cf6",
      accent: "#0ea5e9"
    }
  });
  const [nameSuggestions, setNameSuggestions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const steps = ["Basic Info", "Branding", "Complete"];

  const generateBusinessName = async () => {
    if (!businessInfo.description || !businessInfo.industry) {
      toast({
        title: "Missing Information",
        description: "Please provide a business description and industry first.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-business-name', {
        body: {
          description: businessInfo.description,
          industry: businessInfo.industry
        }
      });

      if (error) throw error;

      if (data?.suggestions) {
        setNameSuggestions(data.suggestions);
        toast({
          title: "Names Generated!",
          description: "Check out the AI-powered name suggestions below."
        });
      }
    } catch (error) {
      console.error("Error generating names:", error);
      toast({
        title: "Generation Failed",
        description: "Could not generate business names. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveBusiness = async () => {
    if (!businessInfo.name) {
      toast({
        title: "Name Required",
        description: "Please provide a business name.",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      // Save business info to user metadata or a separate table
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // You could save this to a businesses table or user metadata
        toast({
          title: "Business Created!",
          description: `${businessInfo.name} has been set up successfully.`
        });
        onComplete();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Building2 className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Set Up Your Business</h1>
        </div>
        <p className="text-muted-foreground">
          Let's get your organization configured
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            <div className={`flex items-center gap-2 ${index <= currentStep ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                index < currentStep ? 'bg-primary border-primary text-primary-foreground' :
                index === currentStep ? 'border-primary' : 'border-muted'
              }`}>
                {index < currentStep ? <CheckCircle className="w-5 h-5" /> : index + 1}
              </div>
              <span className="text-sm font-medium hidden sm:inline">{step}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-12 h-0.5 mx-2 ${index < currentStep ? 'bg-primary' : 'bg-muted'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {currentStep === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>Tell us about your organization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                placeholder="e.g., Technology, Healthcare, Retail"
                value={businessInfo.industry}
                onChange={(e) => setBusinessInfo({ ...businessInfo, industry: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Company Size</Label>
              <Input
                id="size"
                placeholder="e.g., 1-10, 11-50, 51-200, 200+"
                value={businessInfo.size}
                onChange={(e) => setBusinessInfo({ ...businessInfo, size: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Business Description</Label>
              <Textarea
                id="description"
                placeholder="What does your business do? What makes it unique?"
                rows={4}
                value={businessInfo.description}
                onChange={(e) => setBusinessInfo({ ...businessInfo, description: e.target.value })}
              />
            </div>

            <Button
              onClick={generateBusinessName}
              disabled={isGenerating}
              className="w-full"
              variant="outline"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {isGenerating ? "Generating..." : "Generate Name Ideas with AI"}
            </Button>

            {nameSuggestions.length > 0 && (
              <div className="space-y-3">
                <Label>AI Suggestions (click to select)</Label>
                <div className="grid gap-2">
                  {nameSuggestions.map((name, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="justify-start h-auto py-3 px-4"
                      onClick={() => setBusinessInfo({ ...businessInfo, name })}
                    >
                      {name}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                placeholder="Enter or select a name"
                value={businessInfo.name}
                onChange={(e) => setBusinessInfo({ ...businessInfo, name: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Brand Colors</CardTitle>
            <CardDescription>Choose colors that represent your brand</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="primary-color">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primary-color"
                    type="color"
                    value={businessInfo.brandColors.primary}
                    onChange={(e) => setBusinessInfo({
                      ...businessInfo,
                      brandColors: { ...businessInfo.brandColors, primary: e.target.value }
                    })}
                    className="h-10 w-20"
                  />
                  <Input
                    value={businessInfo.brandColors.primary}
                    onChange={(e) => setBusinessInfo({
                      ...businessInfo,
                      brandColors: { ...businessInfo.brandColors, primary: e.target.value }
                    })}
                    placeholder="#6366f1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondary-color">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondary-color"
                    type="color"
                    value={businessInfo.brandColors.secondary}
                    onChange={(e) => setBusinessInfo({
                      ...businessInfo,
                      brandColors: { ...businessInfo.brandColors, secondary: e.target.value }
                    })}
                    className="h-10 w-20"
                  />
                  <Input
                    value={businessInfo.brandColors.secondary}
                    onChange={(e) => setBusinessInfo({
                      ...businessInfo,
                      brandColors: { ...businessInfo.brandColors, secondary: e.target.value }
                    })}
                    placeholder="#8b5cf6"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accent-color">Accent Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="accent-color"
                    type="color"
                    value={businessInfo.brandColors.accent}
                    onChange={(e) => setBusinessInfo({
                      ...businessInfo,
                      brandColors: { ...businessInfo.brandColors, accent: e.target.value }
                    })}
                    className="h-10 w-20"
                  />
                  <Input
                    value={businessInfo.brandColors.accent}
                    onChange={(e) => setBusinessInfo({
                      ...businessInfo,
                      brandColors: { ...businessInfo.brandColors, accent: e.target.value }
                    })}
                    placeholder="#0ea5e9"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 border rounded-lg">
              <h4 className="font-semibold mb-3">Color Preview</h4>
              <div className="flex gap-2">
                <div
                  className="h-20 flex-1 rounded"
                  style={{ backgroundColor: businessInfo.brandColors.primary }}
                />
                <div
                  className="h-20 flex-1 rounded"
                  style={{ backgroundColor: businessInfo.brandColors.secondary }}
                />
                <div
                  className="h-20 flex-1 rounded"
                  style={{ backgroundColor: businessInfo.brandColors.accent }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Review & Complete</CardTitle>
            <CardDescription>Confirm your business information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label className="text-muted-foreground">Business Name</Label>
                <p className="text-lg font-semibold">{businessInfo.name || "Not set"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Industry</Label>
                <p>{businessInfo.industry || "Not set"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Company Size</Label>
                <p>{businessInfo.size || "Not set"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Description</Label>
                <p className="text-sm">{businessInfo.description || "Not set"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Brand Colors</Label>
                <div className="flex gap-2 mt-2">
                  <div
                    className="h-12 w-12 rounded border"
                    style={{ backgroundColor: businessInfo.brandColors.primary }}
                  />
                  <div
                    className="h-12 w-12 rounded border"
                    style={{ backgroundColor: businessInfo.brandColors.secondary }}
                  />
                  <div
                    className="h-12 w-12 rounded border"
                    style={{ backgroundColor: businessInfo.brandColors.accent }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        {currentStep > 0 && (
          <Button
            onClick={() => setCurrentStep(currentStep - 1)}
            variant="outline"
          >
            Previous
          </Button>
        )}
        {currentStep < steps.length - 1 ? (
          <Button
            onClick={() => setCurrentStep(currentStep + 1)}
            className="ml-auto bg-gradient-primary"
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={saveBusiness}
            disabled={saving}
            className="ml-auto bg-gradient-primary"
          >
            {saving ? "Saving..." : "Complete Setup"}
          </Button>
        )}
        <Button
          onClick={onComplete}
          variant="ghost"
        >
          Skip for Now
        </Button>
      </div>
    </div>
  );
};
