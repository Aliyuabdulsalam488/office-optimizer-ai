import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload, Send, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface JobApplicationFormProps {
  jobId?: string;
  jobTitle?: string;
  onClose?: () => void;
}

export const JobApplicationForm = ({ jobId, jobTitle, onClose }: JobApplicationFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    coverLetter: "",
    resumeUrl: "",
    portfolio: "",
    linkedIn: "",
    yearsExperience: "",
    expectedSalary: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("job_applications").insert({
        job_id: jobId || "general",
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        cover_letter: formData.coverLetter,
        resume_url: formData.resumeUrl,
        portfolio_url: formData.portfolio,
        linkedin_url: formData.linkedIn,
        years_experience: formData.yearsExperience ? parseInt(formData.yearsExperience) : null,
        expected_salary: formData.expectedSalary,
        status: "submitted",
      });

      if (error) throw error;

      toast({
        title: "Application Submitted!",
        description: "We'll review your application and get back to you soon.",
      });

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        location: "",
        coverLetter: "",
        resumeUrl: "",
        portfolio: "",
        linkedIn: "",
        yearsExperience: "",
        expectedSalary: "",
      });

      if (onClose) onClose();
    } catch (error: any) {
      console.error("Application error:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary" />
          {jobTitle ? `Apply for ${jobTitle}` : "Freelance Application"}
        </h2>
        <p className="text-muted-foreground mt-2">
          Fill out the form below to submit your application
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@example.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
              required
            />
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="City, State/Country"
            />
          </div>

          <div>
            <Label htmlFor="experience">Years of Experience</Label>
            <Input
              id="experience"
              type="number"
              min="0"
              value={formData.yearsExperience}
              onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
              placeholder="5"
            />
          </div>

          <div>
            <Label htmlFor="salary">Expected Salary (Optional)</Label>
            <Input
              id="salary"
              value={formData.expectedSalary}
              onChange={(e) => setFormData({ ...formData, expectedSalary: e.target.value })}
              placeholder="$80,000 - $100,000"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="resumeUrl">Resume URL or Drive Link *</Label>
          <div className="flex gap-2">
            <Input
              id="resumeUrl"
              value={formData.resumeUrl}
              onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
              placeholder="https://drive.google.com/... or https://resume.com/..."
              required
            />
            <Button type="button" variant="outline" size="icon">
              <Upload className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Upload your resume to Google Drive or Dropbox and paste the shareable link
          </p>
        </div>

        <div>
          <Label htmlFor="portfolio">Portfolio URL (Optional)</Label>
          <Input
            id="portfolio"
            value={formData.portfolio}
            onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
            placeholder="https://myportfolio.com"
          />
        </div>

        <div>
          <Label htmlFor="linkedin">LinkedIn Profile (Optional)</Label>
          <Input
            id="linkedin"
            value={formData.linkedIn}
            onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
            placeholder="https://linkedin.com/in/johndoe"
          />
        </div>

        <div>
          <Label htmlFor="coverLetter">Cover Letter</Label>
          <Textarea
            id="coverLetter"
            value={formData.coverLetter}
            onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
            placeholder="Tell us why you're a great fit for this position..."
            rows={6}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? (
              "Submitting..."
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Application
              </>
            )}
          </Button>
          {onClose && (
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};
