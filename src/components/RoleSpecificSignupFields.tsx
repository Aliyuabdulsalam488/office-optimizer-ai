import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface RoleSpecificSignupFieldsProps {
  role: string;
  data: any;
  onChange: (field: string, value: string) => void;
  errors?: Record<string, string>;
}

export const RoleSpecificSignupFields = ({ role, data, onChange, errors }: RoleSpecificSignupFieldsProps) => {
  const renderFields = () => {
    switch (role) {
      case "hr_manager":
        return (
          <>
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                maxLength={100}
                placeholder="e.g., Human Resources"
                value={data.department || ""}
                onChange={(e) => onChange("department", e.target.value.trim())}
              />
              {errors?.department && <p className="text-sm text-destructive mt-1">{errors.department}</p>}
            </div>
            <div>
              <Label htmlFor="teamSize">Team Size</Label>
              <Input
                id="teamSize"
                type="number"
                min="1"
                max="10000"
                placeholder="Number of employees you manage"
                value={data.teamSize || ""}
                onChange={(e) => onChange("teamSize", e.target.value)}
              />
              {errors?.teamSize && <p className="text-sm text-destructive mt-1">{errors.teamSize}</p>}
            </div>
          </>
        );
      
      case "finance_manager":
        return (
          <>
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                maxLength={100}
                placeholder="e.g., Finance & Accounting"
                value={data.department || ""}
                onChange={(e) => onChange("department", e.target.value.trim())}
              />
            </div>
            <div>
              <Label htmlFor="budgetRange">Annual Budget Range</Label>
              <Select value={data.budgetRange || ""} onValueChange={(v) => onChange("budgetRange", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under_1m">Under $1M</SelectItem>
                  <SelectItem value="1m_5m">$1M - $5M</SelectItem>
                  <SelectItem value="5m_20m">$5M - $20M</SelectItem>
                  <SelectItem value="over_20m">Over $20M</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      
      case "sales_manager":
        return (
          <>
            <div>
              <Label htmlFor="territory">Territory/Region</Label>
              <Input
                id="territory"
                maxLength={100}
                placeholder="e.g., North America, EMEA"
                value={data.territory || ""}
                onChange={(e) => onChange("territory", e.target.value.trim())}
              />
            </div>
            <div>
              <Label htmlFor="targetRevenue">Annual Revenue Target</Label>
              <Input
                id="targetRevenue"
                type="number"
                min="0"
                max="1000000000"
                placeholder="e.g., $2M"
                value={data.targetRevenue || ""}
                onChange={(e) => onChange("targetRevenue", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="teamSize">Sales Team Size</Label>
              <Input
                id="teamSize"
                type="number"
                min="1"
                max="10000"
                placeholder="Number of sales reps"
                value={data.teamSize || ""}
                onChange={(e) => onChange("teamSize", e.target.value)}
              />
            </div>
          </>
        );
      
      case "architect":
      case "home_builder":
        return (
          <>
            <div>
              <Label htmlFor="projectCount">Active Projects</Label>
              <Input
                id="projectCount"
                type="number"
                min="0"
                max="1000"
                placeholder="Number of active projects"
                value={data.projectCount || ""}
                onChange={(e) => onChange("projectCount", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="buildingType">Primary Building Type</Label>
              <Select value={data.buildingType || ""} onValueChange={(v) => onChange("buildingType", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                  <SelectItem value="mixed">Mixed Use</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="specialty">Specialty/Focus Area</Label>
              <Input
                id="specialty"
                maxLength={100}
                placeholder="e.g., Sustainable design, Modern architecture"
                value={data.specialty || ""}
                onChange={(e) => onChange("specialty", e.target.value.trim())}
              />
            </div>
          </>
        );

      case "executive_assistant":
        return (
          <>
            <div>
              <Label htmlFor="executiveTitle">Executive You Support</Label>
              <Input
                id="executiveTitle"
                maxLength={100}
                placeholder="e.g., CEO, CFO"
                value={data.executiveTitle || ""}
                onChange={(e) => onChange("executiveTitle", e.target.value.trim())}
              />
            </div>
            <div>
              <Label htmlFor="responsibilities">Key Responsibilities</Label>
              <Textarea
                id="responsibilities"
                maxLength={500}
                placeholder="e.g., Calendar management, travel planning"
                value={data.responsibilities || ""}
                onChange={(e) => onChange("responsibilities", e.target.value.trim())}
                rows={3}
              />
            </div>
          </>
        );
      
      case "executive":
        return (
          <>
            <div>
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                maxLength={100}
                placeholder="e.g., CEO, CFO, COO"
                value={data.title || ""}
                onChange={(e) => onChange("title", e.target.value.trim())}
              />
            </div>
            <div>
              <Label htmlFor="companySize">Company Size</Label>
              <Select value={data.companySize || ""} onValueChange={(v) => onChange("companySize", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10 employees</SelectItem>
                  <SelectItem value="11-50">11-50 employees</SelectItem>
                  <SelectItem value="51-200">51-200 employees</SelectItem>
                  <SelectItem value="201-500">201-500 employees</SelectItem>
                  <SelectItem value="500+">500+ employees</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      
      case "procurement_manager":
        return (
          <>
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                maxLength={100}
                placeholder="e.g., Procurement & Supply Chain"
                value={data.department || ""}
                onChange={(e) => onChange("department", e.target.value.trim())}
              />
            </div>
            <div>
              <Label htmlFor="vendorCount">Active Vendors</Label>
              <Input
                id="vendorCount"
                type="number"
                min="0"
                max="10000"
                placeholder="Number of active vendors"
                value={data.vendorCount || ""}
                onChange={(e) => onChange("vendorCount", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="spendVolume">Annual Spend Volume</Label>
              <Select value={data.spendVolume || ""} onValueChange={(v) => onChange("spendVolume", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under_500k">Under $500K</SelectItem>
                  <SelectItem value="500k_2m">$500K - $2M</SelectItem>
                  <SelectItem value="2m_10m">$2M - $10M</SelectItem>
                  <SelectItem value="over_10m">Over $10M</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      
      case "employee":
        return (
          <div>
            <Label htmlFor="position">Position/Role (Optional)</Label>
            <Input
              id="position"
              maxLength={100}
              placeholder="e.g., Software Engineer, Marketing Specialist"
              value={data.position || ""}
              onChange={(e) => onChange("position", e.target.value.trim())}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 mt-4 p-4 border border-border rounded-lg bg-muted/20">
      <p className="text-sm font-medium text-foreground">Role-Specific Information</p>
      {renderFields()}
    </div>
  );
};
