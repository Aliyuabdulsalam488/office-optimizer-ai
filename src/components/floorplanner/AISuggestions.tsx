import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AISuggestionsProps {
  planId: string;
  planData: any;
}

const AISuggestions = ({ planId, planData }: AISuggestionsProps) => {
  const [prompt, setPrompt] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateSuggestions = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Enter requirements",
        description: "Please describe your requirements for AI suggestions",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke("floor-plan-ai", {
        body: {
          planId,
          planData,
          prompt,
          action: "suggest",
        },
      });

      if (error) throw error;

      setSuggestions(data.suggestions || []);
      toast({
        title: "Suggestions generated",
        description: "AI has generated layout suggestions for your floor plan",
      });
    } catch (error: any) {
      toast({
        title: "Error generating suggestions",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">AI Floor Plan Assistant</h3>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Describe your requirements and constraints, and AI will suggest optimized layouts
        </p>

        <Textarea
          placeholder="E.g., 3 bedroom 2 bathroom house on 150 m², open-plan living and kitchen, good natural lighting..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          className="mb-4"
        />

        <Button
          onClick={generateSuggestions}
          disabled={loading}
          className="bg-gradient-primary"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {loading ? "Generating..." : "Generate Suggestions"}
        </Button>
      </Card>

      {suggestions.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            AI Suggestions
          </h4>
          {suggestions.map((suggestion, index) => (
            <Card key={index} className="p-4">
              <p className="text-sm">{suggestion}</p>
            </Card>
          ))}
        </div>
      )}

      {suggestions.length === 0 && (
        <Card className="p-12 text-center">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            No suggestions yet. Describe your requirements above to get AI-powered layout suggestions.
          </p>
        </Card>
      )}
    </div>
  );
};

export default AISuggestions;
