import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, FileImage, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Canvas as FabricCanvas } from "fabric";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { supabase } from "@/integrations/supabase/client";

interface ExportPanelProps {
  planId: string;
  planTitle: string;
  canvas: FabricCanvas | null;
}

const ExportPanel = ({ planId, planTitle, canvas }: ExportPanelProps) => {
  const [exporting, setExporting] = useState(false);
  const { toast } = useToast();

  const exportAsPNG = async () => {
    if (!canvas) return;

    try {
      setExporting(true);
      const dataURL = canvas.toDataURL({
        format: "png",
        quality: 1,
        multiplier: 2,
      });

      const link = document.createElement("a");
      link.download = `${planTitle.replace(/\s+/g, "_")}_floor_plan.png`;
      link.href = dataURL;
      link.click();

      await logExport("png");

      toast({
        title: "Export successful",
        description: "Floor plan exported as PNG",
      });
    } catch (error: any) {
      toast({
        title: "Export failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  const exportAsJPG = async () => {
    if (!canvas) return;

    try {
      setExporting(true);
      const dataURL = canvas.toDataURL({
        format: "jpeg",
        quality: 0.9,
        multiplier: 2,
      });

      const link = document.createElement("a");
      link.download = `${planTitle.replace(/\s+/g, "_")}_floor_plan.jpg`;
      link.href = dataURL;
      link.click();

      await logExport("jpg");

      toast({
        title: "Export successful",
        description: "Floor plan exported as JPG",
      });
    } catch (error: any) {
      toast({
        title: "Export failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  const exportAsPDF = async () => {
    if (!canvas) return;

    try {
      setExporting(true);
      
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width || 1200, canvas.height || 800],
      });

      const dataURL = canvas.toDataURL({
        format: "png",
        quality: 1,
        multiplier: 2,
      });

      pdf.addImage(
        dataURL,
        "PNG",
        0,
        0,
        canvas.width || 1200,
        canvas.height || 800
      );

      pdf.text(planTitle, 20, 30);
      pdf.setFontSize(12);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 50);

      pdf.save(`${planTitle.replace(/\s+/g, "_")}_floor_plan.pdf`);

      await logExport("pdf");

      toast({
        title: "Export successful",
        description: "Floor plan exported as PDF with dimensions",
      });
    } catch (error: any) {
      toast({
        title: "Export failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  const exportAsDXF = async () => {
    if (!canvas) return;

    try {
      setExporting(true);

      // Basic DXF header
      let dxf = "0\nSECTION\n2\nHEADER\n0\nENDSEC\n";
      dxf += "0\nSECTION\n2\nENTITIES\n";

      // Convert canvas objects to DXF entities
      const objects = canvas.getObjects();
      objects.forEach((obj) => {
        if (obj.type === "rect") {
          const x = obj.left || 0;
          const y = obj.top || 0;
          const w = (obj.width || 0) * (obj.scaleX || 1);
          const h = (obj.height || 0) * (obj.scaleY || 1);

          // Draw rectangle as polyline
          dxf += "0\nLWPOLYLINE\n8\n0\n90\n5\n70\n1\n";
          dxf += `10\n${x}\n20\n${y}\n`;
          dxf += `10\n${x + w}\n20\n${y}\n`;
          dxf += `10\n${x + w}\n20\n${y + h}\n`;
          dxf += `10\n${x}\n20\n${y + h}\n`;
          dxf += `10\n${x}\n20\n${y}\n`;
        } else if (obj.type === "line") {
          const lineObj = obj as any;
          dxf += "0\nLINE\n8\n0\n";
          dxf += `10\n${lineObj.x1 || 0}\n20\n${lineObj.y1 || 0}\n`;
          dxf += `11\n${lineObj.x2 || 0}\n21\n${lineObj.y2 || 0}\n`;
        }
      });

      dxf += "0\nENDSEC\n0\nEOF";

      const blob = new Blob([dxf], { type: "application/dxf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `${planTitle.replace(/\s+/g, "_")}_floor_plan.dxf`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);

      await logExport("dxf");

      toast({
        title: "Export successful",
        description: "Floor plan exported as DXF for CAD software",
      });
    } catch (error: any) {
      toast({
        title: "Export failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  const logExport = async (exportType: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from("floor_plan_exports").insert({
        floor_plan_id: planId,
        user_id: user.id,
        export_type: exportType,
      });
    } catch (error) {
      console.error("Error logging export:", error);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Download className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Export Floor Plan</h3>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        Export your floor plan in various formats for printing, sharing, or CAD software
      </p>

      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={exportAsPNG}
          disabled={exporting || !canvas}
          variant="outline"
          className="flex flex-col h-auto py-4"
        >
          <FileImage className="w-8 h-8 mb-2" />
          <span className="font-semibold">PNG Image</span>
          <span className="text-xs text-muted-foreground">High quality raster</span>
        </Button>

        <Button
          onClick={exportAsJPG}
          disabled={exporting || !canvas}
          variant="outline"
          className="flex flex-col h-auto py-4"
        >
          <FileImage className="w-8 h-8 mb-2" />
          <span className="font-semibold">JPG Image</span>
          <span className="text-xs text-muted-foreground">Compressed format</span>
        </Button>

        <Button
          onClick={exportAsPDF}
          disabled={exporting || !canvas}
          variant="outline"
          className="flex flex-col h-auto py-4"
        >
          <FileText className="w-8 h-8 mb-2" />
          <span className="font-semibold">PDF Document</span>
          <span className="text-xs text-muted-foreground">Print ready</span>
        </Button>

        <Button
          onClick={exportAsDXF}
          disabled={exporting || !canvas}
          variant="outline"
          className="flex flex-col h-auto py-4"
        >
          <FileText className="w-8 h-8 mb-2" />
          <span className="font-semibold">DXF Format</span>
          <span className="text-xs text-muted-foreground">CAD compatible</span>
        </Button>
      </div>

      {exporting && (
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Generating export...
        </div>
      )}
    </Card>
  );
};

export default ExportPanel;
