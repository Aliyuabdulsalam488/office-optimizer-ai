import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Sparkles, Home, Users, Bed, Utensils } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface RoomLayoutOptimizerProps {
  planId: string;
  canvas: any;
}

export const RoomLayoutOptimizer = ({ planId, canvas }: RoomLayoutOptimizerProps) => {
  const [roomType, setRoomType] = useState<string>("");
  const [roomSize, setRoomSize] = useState("");
  const [occupants, setOccupants] = useState("");
  const [optimizing, setOptimizing] = useState(false);
  const [suggestions, setSuggestions] = useState("");
  const { toast } = useToast();

  const roomTypes = [
    { value: "living_room", label: "Living Room", icon: Home },
    { value: "bedroom", label: "Bedroom", icon: Bed },
    { value: "kitchen", label: "Kitchen", icon: Utensils },
    { value: "office", label: "Office", icon: Users },
    { value: "bathroom", label: "Bathroom", icon: Home },
    { value: "dining_room", label: "Dining Room", icon: Utensils },
  ];

  const optimizeLayout = async () => {
    if (!roomType || !roomSize) {
      toast({
        title: "Missing Information",
        description: "Please select room type and enter dimensions",
        variant: "destructive",
      });
      return;
    }

    try {
      setOptimizing(true);
      setSuggestions("");

      const systemPrompt = `You are an expert interior designer and space planner. Your role is to provide optimal furniture placement, traffic flow analysis, and design recommendations based on room specifications and industry best practices.`;

      const userPrompt = `Optimize the layout for the following room:

**Room Type:** ${roomTypes.find(r => r.value === roomType)?.label}
**Dimensions:** ${roomSize} square feet
**Number of Occupants:** ${occupants || "Not specified"}

Provide detailed recommendations including:

## Furniture Placement
* Specific furniture pieces with dimensions
* Optimal placement considering traffic flow
* Clearance requirements and accessibility

## Traffic Flow Analysis
* Primary circulation paths
* Door swing considerations
* Movement patterns and accessibility zones

## Design Recommendations
* Color schemes and lighting
* Storage solutions
* Ergonomic considerations
* Space-saving tips

## Layout Sketches
* Describe 2-3 alternative layout options
* Pros and cons of each layout
* Best practices for this room type

Format your response in clear markdown with actionable recommendations.`;

      const { data, error } = await supabase.functions.invoke('floor-plan-ai', {
        body: {
          planId,
          action: 'optimize-layout',
          systemPrompt,
          userPrompt,
        }
      });

      if (error) throw error;

      setSuggestions(data.report || '');
      toast({
        title: "Layout Optimized!",
        description: "AI-powered suggestions are ready",
      });

    } catch (error: any) {
      console.error('Error optimizing layout:', error);
      toast({
        title: "Optimization Failed",
        description: error.message || "Failed to generate layout suggestions",
        variant: "destructive",
      });
    } finally {
      setOptimizing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">AI Room Layout Optimizer</h3>
            <p className="text-sm text-muted-foreground">
              Get intelligent furniture placement, traffic flow analysis, and design recommendations powered by AI
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Room Type</Label>
            <Select value={roomType} onValueChange={setRoomType}>
              <SelectTrigger>
                <SelectValue placeholder="Select room type" />
              </SelectTrigger>
              <SelectContent>
                {roomTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Room Size (sq ft)</Label>
              <Input
                type="number"
                placeholder="e.g., 200"
                value={roomSize}
                onChange={(e) => setRoomSize(e.target.value)}
              />
            </div>
            <div>
              <Label>Number of Occupants (optional)</Label>
              <Input
                type="number"
                placeholder="e.g., 2"
                value={occupants}
                onChange={(e) => setOccupants(e.target.value)}
              />
            </div>
          </div>

          <Button
            onClick={optimizeLayout}
            disabled={optimizing || !roomType || !roomSize}
            className="w-full"
          >
            {optimizing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Optimizing Layout...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Layout Suggestions
              </>
            )}
          </Button>
        </div>
      </Card>

      {suggestions && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Layout Recommendations</h3>
            <Badge variant="outline">AI Generated</Badge>
          </div>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown>{suggestions}</ReactMarkdown>
          </div>
        </Card>
      )}
    </div>
  );
};
