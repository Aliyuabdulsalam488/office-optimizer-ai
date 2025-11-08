import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface FeatureModule {
  name: string;
  displayName: string;
  description: string;
  category: string;
}

interface FeatureModulesPanelProps {
  roleModules: FeatureModule[];
}

const FeatureModulesPanel = ({ roleModules }: FeatureModulesPanelProps) => {
  const [enabledModules, setEnabledModules] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadEnabledModules();
  }, []);

  const loadEnabledModules = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("user_feature_modules")
        .select("module_name")
        .eq("user_id", user.id)
        .eq("enabled", true);

      if (error) throw error;

      setEnabledModules(data?.map((m) => m.module_name) || []);
    } catch (error: any) {
      console.error("Error loading modules:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = async (moduleName: string, enabled: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (enabled) {
        const { error } = await supabase.from("user_feature_modules").upsert({
          user_id: user.id,
          module_name: moduleName,
          enabled: true,
          enabled_at: new Date().toISOString(),
        });

        if (error) throw error;

        setEnabledModules([...enabledModules, moduleName]);
        toast({
          title: "Module enabled",
          description: `${moduleName} has been activated`,
        });
      } else {
        const { error } = await supabase
          .from("user_feature_modules")
          .update({ enabled: false })
          .eq("user_id", user.id)
          .eq("module_name", moduleName);

        if (error) throw error;

        setEnabledModules(enabledModules.filter((m) => m !== moduleName));
        toast({
          title: "Module disabled",
          description: `${moduleName} has been deactivated`,
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
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold">Feature Modules</h3>
        <p className="text-sm text-muted-foreground">
          Enable additional features to expand your capabilities
        </p>
      </div>
      
      <div className="space-y-4">
        {roleModules.map((module) => (
          <div
            key={module.name}
            className="flex items-start justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
          >
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <Label htmlFor={module.name} className="text-base font-semibold cursor-pointer">
                  {module.displayName}
                </Label>
                {enabledModules.includes(module.name) && (
                  <Badge variant="default" className="text-xs">Active</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{module.description}</p>
              <Badge variant="outline" className="text-xs mt-2">
                {module.category}
              </Badge>
            </div>
            <Switch
              id={module.name}
              checked={enabledModules.includes(module.name)}
              onCheckedChange={(checked) => toggleModule(module.name, checked)}
            />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default FeatureModulesPanel;