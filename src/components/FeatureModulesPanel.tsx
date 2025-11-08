import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface Module {
  name: string;
  label: string;
  description: string;
}

interface FeatureModulesPanelProps {
  availableModules: Module[];
  userId?: string;
}

export const FeatureModulesPanel = ({ availableModules, userId }: FeatureModulesPanelProps) => {
  const [enabledModules, setEnabledModules] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      loadEnabledModules();
    }
  }, [userId]);

  const loadEnabledModules = async () => {
    try {
      const { data, error } = await supabase
        .from("user_feature_modules")
        .select("module_name, enabled")
        .eq("user_id", userId)
        .eq("enabled", true);

      if (error) throw error;

      const enabled = new Set(data?.map(m => m.module_name) || []);
      setEnabledModules(enabled);
    } catch (error: any) {
      console.error("Error loading modules:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = async (moduleName: string, enabled: boolean) => {
    try {
      if (enabled) {
        const { error } = await supabase
          .from("user_feature_modules")
          .upsert({
            user_id: userId,
            module_name: moduleName,
            enabled: true,
          }, {
            onConflict: 'user_id,module_name'
          });

        if (error) throw error;

        setEnabledModules(prev => new Set([...prev, moduleName]));
        toast({
          title: "Module enabled",
          description: `${availableModules.find(m => m.name === moduleName)?.label} has been enabled`,
        });
      } else {
        const { error } = await supabase
          .from("user_feature_modules")
          .update({ enabled: false })
          .eq("user_id", userId)
          .eq("module_name", moduleName);

        if (error) throw error;

        setEnabledModules(prev => {
          const newSet = new Set(prev);
          newSet.delete(moduleName);
          return newSet;
        });
        toast({
          title: "Module disabled",
          description: `${availableModules.find(m => m.name === moduleName)?.label} has been disabled`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Modules</CardTitle>
        <p className="text-sm text-muted-foreground">Enable additional features</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {availableModules.map((module) => (
          <div key={module.name} className="flex items-start justify-between gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
            <div className="flex-1">
              <Label htmlFor={module.name} className="cursor-pointer">
                {module.label}
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                {module.description}
              </p>
            </div>
            <Switch
              id={module.name}
              checked={enabledModules.has(module.name)}
              onCheckedChange={(checked) => toggleModule(module.name, checked)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};