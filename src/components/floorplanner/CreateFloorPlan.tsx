import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, PenTool } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DocumentUpload from "@/components/DocumentUpload";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  project_type: z.string().optional(),
  area_sqm: z.string().optional(),
});

interface CreateFloorPlanProps {
  onBack: () => void;
  onCreated: (planId: string) => void;
}

const CreateFloorPlan = ({ onBack, onCreated }: CreateFloorPlanProps) => {
  const [mode, setMode] = useState<"select" | "upload" | "create">("select");
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      project_type: "",
      area_sqm: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("floor_plans")
        .insert({
          user_id: user.id,
          title: values.title,
          description: values.description,
          project_type: values.project_type,
          area_sqm: values.area_sqm ? parseFloat(values.area_sqm) : null,
          status: "draft",
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Floor plan created",
        description: "Your floor plan has been created successfully",
      });

      onCreated(data.id);
    } catch (error: any) {
      toast({
        title: "Error creating floor plan",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;

    try {
      setUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // First create the floor plan
      const title = form.getValues("title") || `Floor Plan ${new Date().toLocaleDateString()}`;
      const { data: planData, error: planError } = await supabase
        .from("floor_plans")
        .insert({
          user_id: user.id,
          title,
          description: form.getValues("description"),
          project_type: form.getValues("project_type"),
          area_sqm: form.getValues("area_sqm") ? parseFloat(form.getValues("area_sqm")) : null,
          status: "draft",
        })
        .select()
        .single();

      if (planError) throw planError;

      // Upload the file to storage
      const file = files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${planData.id}/original.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("floor-plans")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("floor-plans")
        .getPublicUrl(filePath);

      // Create first version
      await supabase
        .from("floor_plan_versions")
        .insert({
          floor_plan_id: planData.id,
          version_number: 1,
          file_url: publicUrl,
        });

      toast({
        title: "Floor plan uploaded",
        description: "Your floor plan has been uploaded successfully",
      });

      onCreated(planData.id);
    } catch (error: any) {
      toast({
        title: "Error uploading floor plan",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  if (mode === "select") {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <div className="container mx-auto px-4 py-8">
          <Button onClick={onBack} variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-2">Create Floor Plan</h2>
            <p className="text-muted-foreground mb-8">
              Choose how you want to start your floor plan
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <Card
                className="p-8 cursor-pointer hover:shadow-lg transition-all hover:border-primary"
                onClick={() => setMode("upload")}
              >
                <Upload className="w-12 h-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Upload Existing Plan</h3>
                <p className="text-muted-foreground">
                  Upload an existing floor plan image or PDF to digitize and edit
                </p>
              </Card>

              <Card
                className="p-8 cursor-pointer hover:shadow-lg transition-all hover:border-primary"
                onClick={() => setMode("create")}
              >
                <PenTool className="w-12 h-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Start from Scratch</h3>
                <p className="text-muted-foreground">
                  Create a new floor plan from scratch using our drawing tools
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        <Button onClick={() => setMode("select")} variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-2">
            {mode === "upload" ? "Upload Floor Plan" : "Create New Floor Plan"}
          </h2>
          <p className="text-muted-foreground mb-8">
            Fill in the details for your floor plan
          </p>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                placeholder="e.g., 3-Bedroom Family Home"
                {...form.register("title")}
              />
              {form.formState.errors.title && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your floor plan project..."
                {...form.register("description")}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="project_type">Project Type</Label>
                <Input
                  id="project_type"
                  placeholder="e.g., Residential, Commercial"
                  {...form.register("project_type")}
                />
              </div>

              <div>
                <Label htmlFor="area_sqm">Area (m²)</Label>
                <Input
                  id="area_sqm"
                  type="number"
                  placeholder="e.g., 150"
                  {...form.register("area_sqm")}
                />
              </div>
            </div>

            {mode === "upload" && (
              <DocumentUpload
                serviceType="floor plan"
                onUploadComplete={handleFileUpload}
              />
            )}

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={uploading}
                className="bg-gradient-primary"
              >
                {uploading ? "Creating..." : mode === "upload" ? "Upload & Continue" : "Create Floor Plan"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setMode("select")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateFloorPlan;
