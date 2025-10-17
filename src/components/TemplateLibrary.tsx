import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, FileText, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Template {
  name: string;
  description: string;
  icon: any;
  category: string[];
}

const templates: Template[] = [
  {
    name: "Cash Flow Statement",
    description: "Track your cash inflows and outflows",
    icon: Calculator,
    category: ["Manufacturing Finance", "Corporate Finance", "General Finance"],
  },
  {
    name: "Budget Planner",
    description: "Monthly and annual budget planning template",
    icon: FileSpreadsheet,
    category: ["Personal Finance", "General Finance"],
  },
  {
    name: "Expense Tracker",
    description: "Detailed expense tracking and categorization",
    icon: FileText,
    category: ["Personal Finance", "Manufacturing Finance"],
  },
  {
    name: "Investment Portfolio",
    description: "Track and analyze your investment performance",
    icon: FileSpreadsheet,
    category: ["Investment Finance", "Personal Finance"],
  },
  {
    name: "Production Cost Analysis",
    description: "Calculate and analyze manufacturing costs",
    icon: Calculator,
    category: ["Manufacturing Finance"],
  },
  {
    name: "Property Investment Calculator",
    description: "ROI calculator for real estate investments",
    icon: FileSpreadsheet,
    category: ["Real Estate Finance"],
  },
  {
    name: "Financial Ratios Dashboard",
    description: "Key financial metrics and ratios tracker",
    icon: FileText,
    category: ["Corporate Finance", "Investment Finance"],
  },
  {
    name: "Inventory Management",
    description: "Track inventory levels and costs",
    icon: FileSpreadsheet,
    category: ["Manufacturing Finance", "General Finance"],
  },
];

interface TemplateLibraryProps {
  serviceType: string;
}

const TemplateLibrary = ({ serviceType }: TemplateLibraryProps) => {
  const { toast } = useToast();

  const filteredTemplates = templates.filter((template) =>
    template.category.includes(serviceType)
  );

  const handleDownload = (templateName: string) => {
    toast({
      title: "Template Downloaded",
      description: `${templateName} has been downloaded`,
    });
  };

  return (
    <Card className="p-6 bg-gradient-card border-border">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <FileSpreadsheet className="w-5 h-5" />
        Template Library
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Download pre-built templates for {serviceType}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredTemplates.map((template, index) => {
          const Icon = template.icon;
          return (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-background/50 rounded-lg border border-border hover:border-primary/50 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold mb-1">{template.name}</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  {template.description}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownload(template.name)}
                  className="h-7 text-xs"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No templates available for this service category
        </p>
      )}
    </Card>
  );
};

export default TemplateLibrary;
