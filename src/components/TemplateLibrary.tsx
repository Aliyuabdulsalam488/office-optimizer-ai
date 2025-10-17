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
  // Finance Templates
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
  // Procurement Templates
  {
    name: "Purchase Order Template",
    description: "Standardized PO format for supplier orders",
    icon: FileText,
    category: ["Manufacturing Procurement", "Retail Procurement", "General Procurement"],
  },
  {
    name: "Supplier Evaluation Matrix",
    description: "Assess and compare vendor performance",
    icon: FileSpreadsheet,
    category: ["Strategic Sourcing", "General Procurement"],
  },
  {
    name: "RFQ Template",
    description: "Request for Quotation standardized format",
    icon: FileText,
    category: ["Manufacturing Procurement", "Strategic Sourcing"],
  },
  {
    name: "Vendor Contract Template",
    description: "Standard supplier agreement framework",
    icon: FileText,
    category: ["Strategic Sourcing", "General Procurement"],
  },
  {
    name: "Procurement Dashboard",
    description: "Track spending, orders, and supplier metrics",
    icon: FileSpreadsheet,
    category: ["Retail Procurement", "Manufacturing Procurement", "General Procurement"],
  },
  {
    name: "Inventory Reorder Calculator",
    description: "Optimize reorder points and quantities",
    icon: Calculator,
    category: ["Manufacturing Procurement", "Retail Procurement"],
  },
  {
    name: "Supplier Onboarding Checklist",
    description: "Complete vendor setup and compliance checklist",
    icon: FileText,
    category: ["Strategic Sourcing", "General Procurement"],
  },
  {
    name: "Cost Comparison Tool",
    description: "Compare quotes and total cost of ownership",
    icon: FileSpreadsheet,
    category: ["Strategic Sourcing", "Indirect Procurement"],
  },
  {
    name: "Logistics Tracking Sheet",
    description: "Track shipments and delivery performance",
    icon: FileSpreadsheet,
    category: ["Logistics & Distribution"],
  },
  // HR Templates
  {
    name: "Employee Onboarding Checklist",
    description: "Complete new hire onboarding workflow",
    icon: FileText,
    category: ["Employee Management", "General HR"],
  },
  {
    name: "Performance Review Template",
    description: "Structured employee performance evaluation",
    icon: FileSpreadsheet,
    category: ["Performance Management", "General HR"],
  },
  {
    name: "Job Description Template",
    description: "Standardized role and responsibility format",
    icon: FileText,
    category: ["Recruitment & Talent", "General HR"],
  },
  {
    name: "Leave Request Form",
    description: "Time-off and absence request template",
    icon: FileText,
    category: ["Leave & Attendance", "General HR"],
  },
  {
    name: "Training Plan Template",
    description: "Employee development and training schedule",
    icon: FileSpreadsheet,
    category: ["Learning & Development"],
  },
  {
    name: "Exit Interview Form",
    description: "Structured employee departure feedback",
    icon: FileText,
    category: ["Employee Management", "General HR"],
  },
  {
    name: "Salary Review Template",
    description: "Compensation analysis and adjustment framework",
    icon: FileSpreadsheet,
    category: ["Performance Management", "General HR"],
  },
  {
    name: "Attendance Tracker",
    description: "Daily attendance and punctuality monitoring",
    icon: FileSpreadsheet,
    category: ["Leave & Attendance"],
  },
  {
    name: "Employee Handbook",
    description: "Company policies and procedures guide",
    icon: FileText,
    category: ["General HR"],
  },
  // Data Cleaning Templates
  {
    name: "Data Quality Report",
    description: "Comprehensive data quality assessment template",
    icon: FileSpreadsheet,
    category: ["Data Quality Assessment", "General Data Cleaning"],
  },
  {
    name: "Duplicate Detection Log",
    description: "Track and document duplicate record findings",
    icon: FileText,
    category: ["Duplicate Detection", "General Data Cleaning"],
  },
  {
    name: "Data Transformation Rules",
    description: "Document standardization and transformation logic",
    icon: FileSpreadsheet,
    category: ["Data Transformation", "General Data Cleaning"],
  },
  {
    name: "Validation Rules Matrix",
    description: "Define and track data validation constraints",
    icon: FileSpreadsheet,
    category: ["Validation Rules", "General Data Cleaning"],
  },
  {
    name: "Data Profiling Summary",
    description: "Statistical analysis and field profiling template",
    icon: FileSpreadsheet,
    category: ["Data Profiling", "General Data Cleaning"],
  },
  {
    name: "Data Cleaning Checklist",
    description: "Step-by-step data cleaning workflow guide",
    icon: FileText,
    category: ["General Data Cleaning"],
  },
  {
    name: "Missing Value Analysis",
    description: "Track and handle missing data patterns",
    icon: FileSpreadsheet,
    category: ["Data Quality Assessment", "General Data Cleaning"],
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
