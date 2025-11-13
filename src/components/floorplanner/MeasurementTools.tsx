import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ruler, Square, Circle, Calculator } from "lucide-react";

export const MeasurementTools = () => {
  const [rectangleWidth, setRectangleWidth] = useState("");
  const [rectangleLength, setRectangleLength] = useState("");
  const [circleRadius, setCircleRadius] = useState("");
  const [triangleBase, setTriangleBase] = useState("");
  const [triangleHeight, setTriangleHeight] = useState("");

  const calculateRectangleArea = () => {
    const w = parseFloat(rectangleWidth);
    const l = parseFloat(rectangleLength);
    if (!w || !l) return null;
    return (w * l).toFixed(2);
  };

  const calculateRectanglePerimeter = () => {
    const w = parseFloat(rectangleWidth);
    const l = parseFloat(rectangleLength);
    if (!w || !l) return null;
    return (2 * (w + l)).toFixed(2);
  };

  const calculateCircleArea = () => {
    const r = parseFloat(circleRadius);
    if (!r) return null;
    return (Math.PI * r * r).toFixed(2);
  };

  const calculateCircleCircumference = () => {
    const r = parseFloat(circleRadius);
    if (!r) return null;
    return (2 * Math.PI * r).toFixed(2);
  };

  const calculateTriangleArea = () => {
    const b = parseFloat(triangleBase);
    const h = parseFloat(triangleHeight);
    if (!b || !h) return null;
    return (0.5 * b * h).toFixed(2);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Calculator className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Advanced Measurement Tools</h3>
            <p className="text-sm text-muted-foreground">
              Calculate areas, perimeters, and dimensions for your floor plan elements
            </p>
          </div>
        </div>

        <Tabs defaultValue="rectangle" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="rectangle">
              <Square className="w-4 h-4 mr-2" />
              Rectangle
            </TabsTrigger>
            <TabsTrigger value="circle">
              <Circle className="w-4 h-4 mr-2" />
              Circle
            </TabsTrigger>
            <TabsTrigger value="triangle">
              <Ruler className="w-4 h-4 mr-2" />
              Triangle
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rectangle" className="space-y-4 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Width (ft)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={rectangleWidth}
                  onChange={(e) => setRectangleWidth(e.target.value)}
                />
              </div>
              <div>
                <Label>Length (ft)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={rectangleLength}
                  onChange={(e) => setRectangleLength(e.target.value)}
                />
              </div>
            </div>

            {rectangleWidth && rectangleLength && (
              <Card className="p-4 bg-muted/50">
                <h4 className="font-semibold mb-3">Calculations</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Area:</span>
                    <Badge variant="outline" className="text-base">
                      {calculateRectangleArea()} sq ft
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Perimeter:</span>
                    <Badge variant="outline" className="text-base">
                      {calculateRectanglePerimeter()} ft
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Diagonal:</span>
                    <Badge variant="outline" className="text-base">
                      {Math.sqrt(parseFloat(rectangleWidth) ** 2 + parseFloat(rectangleLength) ** 2).toFixed(2)} ft
                    </Badge>
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="circle" className="space-y-4 mt-6">
            <div>
              <Label>Radius (ft)</Label>
              <Input
                type="number"
                placeholder="0"
                value={circleRadius}
                onChange={(e) => setCircleRadius(e.target.value)}
              />
            </div>

            {circleRadius && (
              <Card className="p-4 bg-muted/50">
                <h4 className="font-semibold mb-3">Calculations</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Area:</span>
                    <Badge variant="outline" className="text-base">
                      {calculateCircleArea()} sq ft
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Circumference:</span>
                    <Badge variant="outline" className="text-base">
                      {calculateCircleCircumference()} ft
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Diameter:</span>
                    <Badge variant="outline" className="text-base">
                      {(parseFloat(circleRadius) * 2).toFixed(2)} ft
                    </Badge>
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="triangle" className="space-y-4 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Base (ft)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={triangleBase}
                  onChange={(e) => setTriangleBase(e.target.value)}
                />
              </div>
              <div>
                <Label>Height (ft)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={triangleHeight}
                  onChange={(e) => setTriangleHeight(e.target.value)}
                />
              </div>
            </div>

            {triangleBase && triangleHeight && (
              <Card className="p-4 bg-muted/50">
                <h4 className="font-semibold mb-3">Calculations</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Area:</span>
                    <Badge variant="outline" className="text-base">
                      {calculateTriangleArea()} sq ft
                    </Badge>
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </Card>

      <Card className="p-6">
        <h4 className="font-semibold mb-4">Unit Conversions</h4>
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 bg-muted/30">
            <p className="text-sm text-muted-foreground mb-2">Square Feet to Square Meters</p>
            <p className="text-xs">Multiply by 0.0929</p>
          </Card>
          <Card className="p-4 bg-muted/30">
            <p className="text-sm text-muted-foreground mb-2">Feet to Meters</p>
            <p className="text-xs">Multiply by 0.3048</p>
          </Card>
          <Card className="p-4 bg-muted/30">
            <p className="text-sm text-muted-foreground mb-2">Inches to Centimeters</p>
            <p className="text-xs">Multiply by 2.54</p>
          </Card>
          <Card className="p-4 bg-muted/30">
            <p className="text-sm text-muted-foreground mb-2">Square Meters to Square Feet</p>
            <p className="text-xs">Multiply by 10.764</p>
          </Card>
        </div>
      </Card>
    </div>
  );
};
