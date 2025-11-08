import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Rect, Circle, Line, FabricText } from "fabric";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Square, Circle as CircleIcon, Minus, Type, MousePointer } from "lucide-react";

interface FloorPlanCanvasProps {
  planId: string;
  onCanvasReady: (canvas: FabricCanvas) => void;
}

const FloorPlanCanvas = ({ planId, onCanvasReady }: FloorPlanCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeTool, setActiveTool] = useState<"select" | "rect" | "circle" | "line" | "text">("select");

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 1200,
      height: 800,
      backgroundColor: "#ffffff",
    });

    // Add grid
    drawGrid(canvas);

    setFabricCanvas(canvas);
    onCanvasReady(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = false;
    
    if (activeTool === "select") {
      fabricCanvas.selection = true;
    } else {
      fabricCanvas.selection = false;
    }
  }, [activeTool, fabricCanvas]);

  const drawGrid = (canvas: FabricCanvas) => {
    const gridSize = 50;
    const width = canvas.width || 1200;
    const height = canvas.height || 800;

    for (let i = 0; i < width / gridSize; i++) {
      const line = new Line([i * gridSize, 0, i * gridSize, height], {
        stroke: "#e5e7eb",
        strokeWidth: 1,
        selectable: false,
        evented: false,
      });
      canvas.add(line);
    }

    for (let i = 0; i < height / gridSize; i++) {
      const line = new Line([0, i * gridSize, width, i * gridSize], {
        stroke: "#e5e7eb",
        strokeWidth: 1,
        selectable: false,
        evented: false,
      });
      canvas.add(line);
    }
  };

  const addShape = (type: "rect" | "circle" | "line" | "text") => {
    if (!fabricCanvas) return;

    const centerX = (fabricCanvas.width || 1200) / 2;
    const centerY = (fabricCanvas.height || 800) / 2;

    switch (type) {
      case "rect":
        const rect = new Rect({
          left: centerX - 50,
          top: centerY - 50,
          fill: "rgba(59, 130, 246, 0.3)",
          stroke: "#3b82f6",
          strokeWidth: 2,
          width: 100,
          height: 100,
        });
        fabricCanvas.add(rect);
        break;

      case "circle":
        const circle = new Circle({
          left: centerX - 50,
          top: centerY - 50,
          fill: "rgba(34, 197, 94, 0.3)",
          stroke: "#22c55e",
          strokeWidth: 2,
          radius: 50,
        });
        fabricCanvas.add(circle);
        break;

      case "line":
        const line = new Line([centerX - 50, centerY, centerX + 50, centerY], {
          stroke: "#1f2937",
          strokeWidth: 3,
        });
        fabricCanvas.add(line);
        break;

      case "text":
        const text = new FabricText("Room Label", {
          left: centerX - 50,
          top: centerY - 10,
          fontSize: 16,
          fill: "#1f2937",
        });
        fabricCanvas.add(text);
        break;
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex gap-2">
          <Button
            variant={activeTool === "select" ? "default" : "outline"}
            onClick={() => setActiveTool("select")}
            size="sm"
          >
            <MousePointer className="w-4 h-4 mr-2" />
            Select
          </Button>
          <Button
            variant={activeTool === "rect" ? "default" : "outline"}
            onClick={() => {
              setActiveTool("rect");
              addShape("rect");
            }}
            size="sm"
          >
            <Square className="w-4 h-4 mr-2" />
            Room
          </Button>
          <Button
            variant={activeTool === "circle" ? "default" : "outline"}
            onClick={() => {
              setActiveTool("circle");
              addShape("circle");
            }}
            size="sm"
          >
            <CircleIcon className="w-4 h-4 mr-2" />
            Circle
          </Button>
          <Button
            variant={activeTool === "line" ? "default" : "outline"}
            onClick={() => {
              setActiveTool("line");
              addShape("line");
            }}
            size="sm"
          >
            <Minus className="w-4 h-4 mr-2" />
            Wall
          </Button>
          <Button
            variant={activeTool === "text" ? "default" : "outline"}
            onClick={() => {
              setActiveTool("text");
              addShape("text");
            }}
            size="sm"
          >
            <Type className="w-4 h-4 mr-2" />
            Label
          </Button>
        </div>
      </Card>

      <Card className="p-4">
        <canvas ref={canvasRef} className="border border-border rounded-lg" />
      </Card>

      <div className="text-sm text-muted-foreground">
        <p>💡 Tip: Use the tools above to add rooms, walls, and labels to your floor plan</p>
      </div>
    </div>
  );
};

export default FloorPlanCanvas;
