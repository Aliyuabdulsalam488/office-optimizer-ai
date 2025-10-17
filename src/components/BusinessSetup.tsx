import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Upload, Palette, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const BusinessSetup = () => {
  const [businessInfo, setBusinessInfo] = useState({
    name: "",
    description: "",
    industry: "",
    logo: null as File | null,
    brandColors: {
      primary: "#000000",
      secondary: "#ffffff",
      accent: "#0066cc"
    }
  });
  const [nameSuggestions, setNameSuggestions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

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

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBusinessInfo({ ...businessInfo, logo: file });
      toast({
        title: "Logo Uploaded",
        description: `${file.name} has been selected.`
      });
    }
  };

  const saveBusiness = () => {
    if (!businessInfo.name) {
      toast({
        title: "Name Required",
        description: "Please provide a business name.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Business Created!",
      description: `${businessInfo.name} has been set up successfully.`
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Create Your Business</h1>
          <p className="text-muted-foreground">
            Let AI help you name and brand your business
          </p>
        </div>

        <Tabs defaultValue="name" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="name">Name</TabsTrigger>
            <TabsTrigger value="logo">Logo</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
          </TabsList>

          <TabsContent value="name">
            <Card>
              <CardHeader>
                <CardTitle>Business Name</CardTitle>
                <CardDescription>
                  Describe your business and get AI-powered name suggestions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
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
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {isGenerating ? "Generating..." : "Generate Name Ideas"}
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
                  <Label htmlFor="businessName">Your Business Name</Label>
                  <Input
                    id="businessName"
                    placeholder="Enter or select a name"
                    value={businessInfo.name}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, name: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logo">
            <Card>
              <CardHeader>
                <CardTitle>Business Logo</CardTitle>
                <CardDescription>Upload your logo or create one with AI</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <Label htmlFor="logo-upload" className="cursor-pointer">
                    <span className="text-primary hover:underline">
                      Click to upload
                    </span>
                    {" or drag and drop"}
                  </Label>
                  <Input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    PNG, JPG, SVG up to 10MB
                  </p>
                  {businessInfo.logo && (
                    <p className="text-sm font-medium mt-4">
                      Selected: {businessInfo.logo.name}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branding">
            <Card>
              <CardHeader>
                <CardTitle>Brand Colors</CardTitle>
                <CardDescription>Define your brand's color palette</CardDescription>
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
                        placeholder="#000000"
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
                        placeholder="#ffffff"
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
                        placeholder="#0066cc"
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
          </TabsContent>

          <TabsContent value="guidelines">
            <Card>
              <CardHeader>
                <CardTitle>Brand Guidelines</CardTitle>
                <CardDescription>
                  AI-generated branding recommendations for {businessInfo.name || "your business"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-start gap-3">
                      <Palette className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-2">Visual Identity</h4>
                        <p className="text-sm text-muted-foreground">
                          Your brand colors should be used consistently across all materials.
                          The primary color represents your main brand identity, secondary for
                          backgrounds, and accent for calls-to-action.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-2">Typography</h4>
                        <p className="text-sm text-muted-foreground">
                          Use clean, professional fonts that reflect your industry. Sans-serif
                          fonts work well for modern tech businesses, while serif fonts add
                          elegance for traditional industries.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-2">Brand Voice</h4>
                        <p className="text-sm text-muted-foreground">
                          Maintain a consistent tone across all communications. Consider your
                          target audience and industry standards when developing your brand voice.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button onClick={saveBusiness} size="lg">
            Create Business
          </Button>
        </div>
      </div>
    </div>
  );
};
