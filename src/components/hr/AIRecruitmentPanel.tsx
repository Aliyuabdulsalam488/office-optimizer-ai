import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Brain, Calendar, Mail, Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface AIRecruitmentPanelProps {
  jobId?: string;
  applications?: any[];
  onRefresh?: () => void;
}

const AIRecruitmentPanel = ({ jobId, applications = [], onRefresh }: AIRecruitmentPanelProps) => {
  const { toast } = useToast();
  const [analyzing, setAnalyzing] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const [topCandidates, setTopCandidates] = useState(5);
  const [deadline, setDeadline] = useState('');
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [emailType, setEmailType] = useState<'reminder' | 'accepted' | 'rejected' | 'custom'>('reminder');
  const [customMessage, setCustomMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleAnalyzeCVs = async () => {
    if (!jobId) {
      toast({
        title: "Error",
        description: "Please select a job first",
        variant: "destructive"
      });
      return;
    }

    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-cv-analyzer', {
        body: { jobId, topCandidates }
      });

      if (error) throw error;

      toast({
        title: "Analysis Complete! 🎉",
        description: `Analyzed ${data.totalAnalyzed} applications. Top ${data.topCandidates.length} candidates identified.`,
      });

      if (onRefresh) onRefresh();
    } catch (error: any) {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze CVs",
        variant: "destructive"
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleScheduleInterviews = async () => {
    if (!applications || applications.length === 0) {
      toast({
        title: "Error",
        description: "No applications to schedule",
        variant: "destructive"
      });
      return;
    }

    if (!deadline) {
      toast({
        title: "Error",
        description: "Please set an interview deadline",
        variant: "destructive"
      });
      return;
    }

    // Get top-scored pending applications
    const topApps = applications
      .filter(app => app.ai_match_score && app.status === 'pending')
      .sort((a, b) => (b.ai_match_score || 0) - (a.ai_match_score || 0))
      .slice(0, topCandidates)
      .map(app => app.id);

    if (topApps.length === 0) {
      toast({
        title: "No Candidates",
        description: "No analyzed applications found. Run AI analysis first.",
        variant: "destructive"
      });
      return;
    }

    setScheduling(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-interview-scheduler', {
        body: { 
          applicationIds: topApps,
          interviewDeadline: new Date(deadline).toISOString()
        }
      });

      if (error) throw error;

      toast({
        title: "Interviews Scheduled! 📅",
        description: `${data.scheduledCount} AI interviews scheduled and invitations sent.`,
      });

      if (onRefresh) onRefresh();
    } catch (error: any) {
      toast({
        title: "Scheduling Failed",
        description: error.message || "Failed to schedule interviews",
        variant: "destructive"
      });
    } finally {
      setScheduling(false);
    }
  };

  const handleSendEmail = async () => {
    if (!selectedApp) return;

    setSending(true);
    try {
      const { error } = await supabase.functions.invoke('send-followup-email', {
        body: { 
          applicationId: selectedApp,
          emailType,
          customMessage: customMessage || undefined
        }
      });

      if (error) throw error;

      toast({
        title: "Email Sent! ✉️",
        description: "Follow-up email sent successfully",
      });

      setEmailDialogOpen(false);
      setCustomMessage('');
    } catch (error: any) {
      toast({
        title: "Email Failed",
        description: error.message || "Failed to send email",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* AI CV Analysis Section */}
      {jobId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI-Powered CV Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Let AI scan all applications and identify the best candidates based on job requirements.
            </p>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label>Number of Top Candidates</Label>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={topCandidates}
                  onChange={(e) => setTopCandidates(parseInt(e.target.value) || 5)}
                  placeholder="5"
                />
              </div>
              <Button 
                onClick={handleAnalyzeCVs} 
                disabled={analyzing}
                className="gap-2"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4" />
                    Analyze Applications
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Schedule AI Interviews Section */}
      {applications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Schedule AI Interviews
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Automatically schedule AI-powered interviews with top candidates and send invitations.
            </p>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label>Interview Deadline</Label>
                <Input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleScheduleInterviews} 
                disabled={scheduling}
                className="gap-2"
              >
                {scheduling ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  <>
                    <Calendar className="h-4 w-4" />
                    Schedule Interviews
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Application Analysis Results */}
      {applications.length > 0 && applications.some(app => app.ai_match_score) && (
        <Card>
          <CardHeader>
            <CardTitle>AI Analysis Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {applications
              .filter(app => app.ai_match_score)
              .sort((a, b) => (b.ai_match_score || 0) - (a.ai_match_score || 0))
              .slice(0, 10)
              .map((app) => (
                <div key={app.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{app.candidate_name}</p>
                      <p className="text-sm text-muted-foreground">{app.candidate_email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={
                          app.ai_match_score >= 80 ? "default" :
                          app.ai_match_score >= 60 ? "secondary" : "outline"
                        }
                      >
                        {app.ai_match_score >= 80 && <CheckCircle className="h-3 w-3 mr-1" />}
                        {app.ai_match_score >= 60 && app.ai_match_score < 80 && <AlertCircle className="h-3 w-3 mr-1" />}
                        Score: {app.ai_match_score}/100
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedApp(app.id);
                          setEmailDialogOpen(true);
                        }}
                      >
                        <Mail className="h-3 w-3 mr-1" />
                        Email
                      </Button>
                    </div>
                  </div>
                  {app.ai_analysis && (
                    <div className="text-sm bg-muted p-3 rounded-md whitespace-pre-wrap">
                      {app.ai_analysis.substring(0, 300)}
                      {app.ai_analysis.length > 300 && '...'}
                    </div>
                  )}
                </div>
              ))}
          </CardContent>
        </Card>
      )}

      {/* Email Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Follow-up Email</DialogTitle>
            <DialogDescription>
              Choose an email type and optionally add a custom message.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Email Type</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant={emailType === 'reminder' ? 'default' : 'outline'}
                  onClick={() => setEmailType('reminder')}
                  className="w-full"
                >
                  Reminder
                </Button>
                <Button
                  variant={emailType === 'accepted' ? 'default' : 'outline'}
                  onClick={() => setEmailType('accepted')}
                  className="w-full"
                >
                  Accepted
                </Button>
                <Button
                  variant={emailType === 'rejected' ? 'default' : 'outline'}
                  onClick={() => setEmailType('rejected')}
                  className="w-full"
                >
                  Rejected
                </Button>
                <Button
                  variant={emailType === 'custom' ? 'default' : 'outline'}
                  onClick={() => setEmailType('custom')}
                  className="w-full"
                >
                  Custom
                </Button>
              </div>
            </div>
            <div>
              <Label>Custom Message (Optional)</Label>
              <Textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Add a personal note..."
                rows={4}
              />
            </div>
            <Button onClick={handleSendEmail} disabled={sending} className="w-full">
              {sending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AIRecruitmentPanel;
