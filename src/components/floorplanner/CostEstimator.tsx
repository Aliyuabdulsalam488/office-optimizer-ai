import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Canvas as FabricCanvas } from "fabric";

interface CostEstimatorProps {
  planId: string;
  canvas: FabricCanvas | null;
}

const CostEstimator = ({ planId, canvas }: CostEstimatorProps) => {
  const [calculating, setCalculating] = useState(false);
  const [rates, setRates] = useState({
    concretePerSqm: 150,
    bricksPerSqm: 80,
    laborPerSqm: 200,
    finishingPerSqm: 120,
  });
  const [estimate, setEstimate] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchLatestEstimate();
  }, [planId]);

  const fetchLatestEstimate = async () => {
    try {
      const { data, error } = await supabase
        .from("floor_plan_cost_estimates")
        .select("*")
        .eq("floor_plan_id", planId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) setEstimate(data);
    } catch (error) {
      console.error("Error fetching estimate:", error);
    }
  };

  const calculateCost = async () => {
    if (!canvas) return;

    try {
      setCalculating(true);

      // Calculate total area from canvas objects
      let totalArea = 0;
      const objects = canvas.getObjects();
      
      objects.forEach((obj) => {
        if (obj.type === "rect") {
          const width = (obj.width || 0) * (obj.scaleX || 1);
          const height = (obj.height || 0) * (obj.scaleY || 1);
          // Convert pixels to square meters (assuming 50px = 1m)
          totalArea += (width * height) / (50 * 50);
        }
      });

      // Calculate costs
      const concreteCost = totalArea * rates.concretePerSqm;
      const bricksCost = totalArea * rates.bricksPerSqm;
      const laborCost = totalArea * rates.laborPerSqm;
      const finishingCost = totalArea * rates.finishingPerSqm;
      const materialsCost = concreteCost + bricksCost + finishingCost;
      const totalCost = materialsCost + laborCost;

      const breakdown = {
        totalArea: Math.round(totalArea * 100) / 100,
        concrete: Math.round(concreteCost),
        bricks: Math.round(bricksCost),
        finishing: Math.round(finishingCost),
        labor: Math.round(laborCost),
        rates: rates,
      };

      // Save estimate
      const { data, error } = await supabase
        .from("floor_plan_cost_estimates")
        .insert({
          floor_plan_id: planId,
          materials_cost: materialsCost,
          labor_cost: laborCost,
          total_cost: totalCost,
          cost_breakdown: breakdown,
        })
        .select()
        .single();

      if (error) throw error;

      setEstimate(data);

      toast({
        title: "Cost estimate calculated",
        description: `Total estimated cost: $${Math.round(totalCost).toLocaleString()}`,
      });
    } catch (error: any) {
      toast({
        title: "Error calculating cost",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Cost Estimation</h3>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          Calculate material and labor costs based on your floor plan dimensions
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <Label>Concrete ($/m²)</Label>
            <Input
              type="number"
              value={rates.concretePerSqm}
              onChange={(e) => setRates({ ...rates, concretePerSqm: parseFloat(e.target.value) })}
            />
          </div>
          <div>
            <Label>Bricks ($/m²)</Label>
            <Input
              type="number"
              value={rates.bricksPerSqm}
              onChange={(e) => setRates({ ...rates, bricksPerSqm: parseFloat(e.target.value) })}
            />
          </div>
          <div>
            <Label>Labor ($/m²)</Label>
            <Input
              type="number"
              value={rates.laborPerSqm}
              onChange={(e) => setRates({ ...rates, laborPerSqm: parseFloat(e.target.value) })}
            />
          </div>
          <div>
            <Label>Finishing ($/m²)</Label>
            <Input
              type="number"
              value={rates.finishingPerSqm}
              onChange={(e) => setRates({ ...rates, finishingPerSqm: parseFloat(e.target.value) })}
            />
          </div>
        </div>

        <Button
          onClick={calculateCost}
          disabled={calculating || !canvas}
          className="w-full bg-gradient-primary"
        >
          <Calculator className="w-4 h-4 mr-2" />
          {calculating ? "Calculating..." : "Calculate Cost Estimate"}
        </Button>
      </Card>

      {estimate && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold">Cost Breakdown</h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Area:</span>
              <span className="font-semibold">
                {estimate.cost_breakdown?.totalArea} m²
              </span>
            </div>

            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Concrete:</span>
                <span>${estimate.cost_breakdown?.concrete.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Bricks:</span>
                <span>${estimate.cost_breakdown?.bricks.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Finishing:</span>
                <span>${estimate.cost_breakdown?.finishing.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold">
                <span>Materials Subtotal:</span>
                <span>${Math.round(estimate.materials_cost).toLocaleString()}</span>
              </div>
            </div>

            <div className="border-t pt-3">
              <div className="flex justify-between text-sm font-semibold">
                <span>Labor Cost:</span>
                <span>${Math.round(estimate.labor_cost).toLocaleString()}</span>
              </div>
            </div>

            <div className="border-t pt-3">
              <div className="flex justify-between text-lg font-bold">
                <span>Total Estimate:</span>
                <span className="text-primary">
                  ${Math.round(estimate.total_cost).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            Last calculated: {new Date(estimate.created_at).toLocaleString()}
          </p>
        </Card>
      )}
    </div>
  );
};

export default CostEstimator;
