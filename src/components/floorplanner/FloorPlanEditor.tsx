import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Sparkles, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Canvas as FabricCanvas, Rect, Circle, Line } from "fabric";
import FloorPlanCanvas from "./FloorPlanCanvas";
import AISuggestions from "./AISuggestions";
import FloorChecker from "./FloorChecker";

interface FloorPlanEditorProps {
  planId: string;
  onBack: () => void;
}

const FloorPlanEditor = ({ planId, onBack }: FloorPlanEditorProps) => {
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPlan();
  }, [planId]);

  const fetchPlan = async () => {
    try {
      const { data, error } = await supabase
        .from("floor_plans")
        .select("*")
        .eq("id", planId)
        .single();

      if (error) throw error;
      setPlan(data);
    } catch (error: any) {
      toast({
        title: "Error loading floor plan",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!canvas) return;

    try {
      setSaving(true);
      const canvasData = canvas.toJSON();

      // Get latest version number
      const { data: versions } = await supabase
        .from("floor_plan_versions")
        .select("version_number")
        .eq("floor_plan_id", planId)
        .order("version_number", { ascending: false })
        .limit(1);

      const nextVersion = versions && versions.length > 0 ? versions[0].version_number + 1 : 1;

      // Save new version
      await supabase
        .from("floor_plan_versions")
        .insert({
          floor_plan_id: planId,
          version_number: nextVersion,
          canvas_data: canvasData,
        });

      // Update floor plan timestamp
      await supabase
        .from("floor_plans")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", planId);

      toast({
        title: "Floor plan saved",
        description: `Version ${nextVersion} saved successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error saving floor plan",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button onClick={onBack} variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold">{plan?.title}</h1>
                <p className="text-sm text-muted-foreground">{plan?.description}</p>
              </div>
            </div>
            <Button onClick={handleSave} disabled={saving} className="bg-gradient-primary">
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="editor">Floor Editor</TabsTrigger>
            <TabsTrigger value="ai-suggestions">
              <Sparkles className="w-4 h-4 mr-2" />
              AI Suggestions
            </TabsTrigger>
            <TabsTrigger value="checker">
              <CheckCircle className="w-4 h-4 mr-2" />
              Floor Checker
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor">
            <FloorPlanCanvas
              planId={planId}
              onCanvasReady={setCanvas}
            />
          </TabsContent>

          <TabsContent value="ai-suggestions">
            <AISuggestions planId={planId} planData={plan} />
          </TabsContent>

          <TabsContent value="checker">
            <FloorChecker planId={planId} canvas={canvas} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FloorPlanEditor;
