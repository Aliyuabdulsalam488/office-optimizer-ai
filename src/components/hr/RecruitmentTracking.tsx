import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Briefcase, Users, Calendar, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { z } from "zod";
import AIRecruitmentPanel from "./AIRecruitmentPanel";

const jobSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  description: z.string().trim().min(1, "Description is required").max(5000, "Description must be less than 5000 characters"),
  department: z.string().trim().max(100, "Department must be less than 100 characters"),
  location: z.string().trim().max(200, "Location must be less than 200 characters"),
  employment_type: z.enum(['full-time', 'part-time', 'contract', 'internship']),
  salary_range: z.string().trim().max(100, "Salary range must be less than 100 characters"),
  requirements: z.string().trim().max(2000, "Requirements must be less than 2000 characters"),
  status: z.enum(['open', 'closed', 'draft'])
});

const applicationSchema = z.object({
  job_id: z.string().uuid("Invalid job ID"),
  candidate_name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  candidate_email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  candidate_phone: z.string().trim().min(1, "Phone is required").max(20, "Phone must be less than 20 characters"),
  cover_letter: z.string().trim().max(2000, "Cover letter must be less than 2000 characters"),
  status: z.enum(['pending', 'reviewing', 'shortlisted', 'rejected', 'accepted'])
});

const interviewSchema = z.object({
  application_id: z.string().uuid("Invalid application ID"),
  interview_date: z.string().min(1, "Interview date is required"),
  interview_type: z.enum(['video', 'phone', 'in-person']),
  interviewer_name: z.string().trim().min(1, "Interviewer name is required").max(100, "Interviewer name must be less than 100 characters"),
  location: z.string().trim().max(200, "Location must be less than 200 characters"),
  notes: z.string().trim().max(1000, "Notes must be less than 1000 characters"),
  status: z.enum(['scheduled', 'completed', 'cancelled', 'rescheduled'])
});

interface Job {
  id: string;
  title: string;
  description: string;
  department: string;
  location: string;
  employment_type: string;
  salary_range: string;
  requirements: string;
  status: string;
  created_at: string;
}

interface Application {
  id: string;
  job_id: string;
  candidate_name: string;
  candidate_email: string;
  candidate_phone: string;
  cv_url: string;
  cover_letter: string;
  status: string;
  created_at: string;
  ai_match_score?: number;
  ai_analysis?: string;
  ai_analysis_date?: string;
  jobs?: { title: string };
}

interface Interview {
  id: string;
  application_id: string;
  interview_date: string;
  interview_type: string;
  interviewer_name: string;
  location: string;
  notes: string;
  status: string;
  created_at: string;
  ai_transcript?: string;
  ai_evaluation?: string;
  ai_recommendation?: string;
  ai_score?: number;
  meeting_link?: string;
  applications?: {
    candidate_name: string;
    candidate_email: string;
    jobs?: { title: string };
  };
}

interface RecruitmentTrackingProps {
  view?: 'jobs' | 'applications' | 'interviews';
}

const RecruitmentTracking = ({ view = 'jobs' }: RecruitmentTrackingProps) => {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    department: '',
    location: '',
    employment_type: 'full-time',
    salary_range: '',
    requirements: '',
    status: 'open'
  });

  const [applicationForm, setApplicationForm] = useState({
    job_id: '',
    candidate_name: '',
    candidate_email: '',
    candidate_phone: '',
    cover_letter: '',
    status: 'pending'
  });

  const [interviewForm, setInterviewForm] = useState({
    application_id: '',
    interview_date: '',
    interview_type: 'video',
    interviewer_name: '',
    location: '',
    notes: '',
    status: 'scheduled'
  });

  useEffect(() => {
    fetchData();
  }, [view]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to access recruitment features",
          variant: "destructive"
        });
        return;
      }

      if (view === 'jobs' || !view) {
        const { data: jobsData, error: jobsError } = await supabase
          .from('jobs')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (jobsError) throw jobsError;
        setJobs(jobsData || []);
      }

      if (view === 'applications') {
        const { data: appsData, error: appsError } = await supabase
          .from('applications')
          .select('*, jobs(title)')
          .order('created_at', { ascending: false });
        
        if (appsError) throw appsError;
        setApplications(appsData || []);
      }

      if (view === 'interviews') {
        const { data: interviewsData, error: interviewsError } = await supabase
          .from('interviews')
          .select('*, applications(candidate_name, candidate_email, jobs(title))')
          .order('interview_date', { ascending: true });
        
        if (interviewsError) throw interviewsError;
        setInterviews(interviewsData || []);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const validatedData = jobSchema.parse(jobForm);

      const { error } = await supabase
        .from('jobs')
        .insert([{ 
          title: validatedData.title,
          description: validatedData.description,
          department: validatedData.department,
          location: validatedData.location,
          employment_type: validatedData.employment_type,
          salary_range: validatedData.salary_range,
          requirements: validatedData.requirements,
          status: validatedData.status,
          user_id: user.id 
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Job posting created successfully"
      });
      setIsDialogOpen(false);
      setJobForm({
        title: '',
        description: '',
        department: '',
        location: '',
        employment_type: 'full-time',
        salary_range: '',
        requirements: '',
        status: 'open'
      });
      fetchData();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      }
    }
  };

  const handleCreateApplication = async () => {
    try {
      const validatedData = applicationSchema.parse(applicationForm);

      const { error } = await supabase
        .from('applications')
        .insert([{
          job_id: validatedData.job_id,
          candidate_name: validatedData.candidate_name,
          candidate_email: validatedData.candidate_email,
          candidate_phone: validatedData.candidate_phone,
          cover_letter: validatedData.cover_letter,
          status: validatedData.status
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Application submitted successfully"
      });
      setIsDialogOpen(false);
      setApplicationForm({
        job_id: '',
        candidate_name: '',
        candidate_email: '',
        candidate_phone: '',
        cover_letter: '',
        status: 'pending'
      });
      fetchData();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      }
    }
  };

  const handleCreateInterview = async () => {
    try {
      const validatedData = interviewSchema.parse(interviewForm);

      const { error } = await supabase
        .from('interviews')
        .insert([{
          application_id: validatedData.application_id,
          interview_date: validatedData.interview_date,
          interview_type: validatedData.interview_type,
          interviewer_name: validatedData.interviewer_name,
          location: validatedData.location,
          notes: validatedData.notes,
          status: validatedData.status
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Interview scheduled successfully"
      });
      setIsDialogOpen(false);
      setInterviewForm({
        application_id: '',
        interview_date: '',
        interview_type: 'video',
        interviewer_name: '',
        location: '',
        notes: '',
        status: 'scheduled'
      });
      fetchData();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      }
    }
  };

  const handleDelete = async (table: 'jobs' | 'applications' | 'interviews', id: string) => {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Item deleted successfully"
      });
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      open: "default",
      closed: "secondary",
      draft: "outline",
      pending: "outline",
      reviewing: "secondary",
      shortlisted: "default",
      rejected: "destructive",
      accepted: "default",
      scheduled: "default",
      completed: "secondary",
      cancelled: "destructive",
      rescheduled: "outline",
      interview_scheduled: "default",
      interview_passed: "default",
      under_review: "secondary"
    };
    const variant = variants[status] as "default" | "secondary" | "destructive" | "outline" | undefined;
    return <Badge variant={variant || "default"}>{status.replace(/_/g, ' ')}</Badge>;
  };

  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* AI Recruitment Panel */}
      {view === 'applications' && (
        <AIRecruitmentPanel 
          jobId={selectedJob || undefined}
          applications={applications}
          onRefresh={fetchData}
        />
      )}

      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          {view === 'jobs' && <Briefcase className="h-5 w-5" />}
          {view === 'applications' && <Users className="h-5 w-5" />}
          {view === 'interviews' && <Calendar className="h-5 w-5" />}
          <h2 className="text-2xl font-bold">
            {view === 'jobs' && 'Job Postings'}
            {view === 'applications' && 'Applications'}
            {view === 'interviews' && 'Interviews'}
          </h2>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {view === 'jobs' && 'Create Job Posting'}
                {view === 'applications' && 'Add Application'}
                {view === 'interviews' && 'Schedule Interview'}
              </DialogTitle>
            </DialogHeader>

            {view === 'jobs' && (
              <div className="space-y-4">
                <div>
                  <Label>Job Title</Label>
                  <Input
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    placeholder="e.g. Senior Software Engineer"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={jobForm.description}
                    onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                    placeholder="Job description..."
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Department</Label>
                    <Input
                      value={jobForm.department}
                      onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
                      placeholder="e.g. Engineering"
                    />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input
                      value={jobForm.location}
                      onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                      placeholder="e.g. Remote"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Employment Type</Label>
                    <Select
                      value={jobForm.employment_type}
                      onValueChange={(value) => setJobForm({ ...jobForm, employment_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full Time</SelectItem>
                        <SelectItem value="part-time">Part Time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Salary Range</Label>
                    <Input
                      value={jobForm.salary_range}
                      onChange={(e) => setJobForm({ ...jobForm, salary_range: e.target.value })}
                      placeholder="e.g. $80k - $120k"
                    />
                  </div>
                </div>
                <div>
                  <Label>Requirements</Label>
                  <Textarea
                    value={jobForm.requirements}
                    onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                    placeholder="List requirements..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select
                    value={jobForm.status}
                    onValueChange={(value) => setJobForm({ ...jobForm, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCreateJob} className="w-full">Create Job</Button>
              </div>
            )}

            {view === 'applications' && (
              <div className="space-y-4">
                <div>
                  <Label>Job Position</Label>
                  <Select
                    value={applicationForm.job_id}
                    onValueChange={(value) => setApplicationForm({ ...applicationForm, job_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a job" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobs.filter(j => j.status === 'open').map((job) => (
                        <SelectItem key={job.id} value={job.id}>{job.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Candidate Name</Label>
                  <Input
                    value={applicationForm.candidate_name}
                    onChange={(e) => setApplicationForm({ ...applicationForm, candidate_name: e.target.value })}
                    placeholder="Full name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={applicationForm.candidate_email}
                      onChange={(e) => setApplicationForm({ ...applicationForm, candidate_email: e.target.value })}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={applicationForm.candidate_phone}
                      onChange={(e) => setApplicationForm({ ...applicationForm, candidate_phone: e.target.value })}
                      placeholder="Phone number"
                    />
                  </div>
                </div>
                <div>
                  <Label>Cover Letter</Label>
                  <Textarea
                    value={applicationForm.cover_letter}
                    onChange={(e) => setApplicationForm({ ...applicationForm, cover_letter: e.target.value })}
                    placeholder="Why are you interested in this position?"
                    rows={4}
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select
                    value={applicationForm.status}
                    onValueChange={(value) => setApplicationForm({ ...applicationForm, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewing">Reviewing</SelectItem>
                      <SelectItem value="shortlisted">Shortlisted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCreateApplication} className="w-full">Submit Application</Button>
              </div>
            )}

            {view === 'interviews' && (
              <div className="space-y-4">
                <div>
                  <Label>Application</Label>
                  <Select
                    value={interviewForm.application_id}
                    onValueChange={(value) => setInterviewForm({ ...interviewForm, application_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an application" />
                    </SelectTrigger>
                    <SelectContent>
                      {applications.filter(a => a.status === 'shortlisted').map((app) => (
                        <SelectItem key={app.id} value={app.id}>
                          {app.candidate_name} - {app.jobs?.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Interview Date & Time</Label>
                  <Input
                    type="datetime-local"
                    value={interviewForm.interview_date}
                    onChange={(e) => setInterviewForm({ ...interviewForm, interview_date: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Interview Type</Label>
                    <Select
                      value={interviewForm.interview_type}
                      onValueChange={(value) => setInterviewForm({ ...interviewForm, interview_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="in-person">In Person</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Interviewer</Label>
                    <Input
                      value={interviewForm.interviewer_name}
                      onChange={(e) => setInterviewForm({ ...interviewForm, interviewer_name: e.target.value })}
                      placeholder="Interviewer name"
                    />
                  </div>
                </div>
                <div>
                  <Label>Location / Link</Label>
                  <Input
                    value={interviewForm.location}
                    onChange={(e) => setInterviewForm({ ...interviewForm, location: e.target.value })}
                    placeholder="Meeting room or video link"
                  />
                </div>
                <div>
                  <Label>Notes</Label>
                  <Textarea
                    value={interviewForm.notes}
                    onChange={(e) => setInterviewForm({ ...interviewForm, notes: e.target.value })}
                    placeholder="Additional notes..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select
                    value={interviewForm.status}
                    onValueChange={(value) => setInterviewForm({ ...interviewForm, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="rescheduled">Rescheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCreateInterview} className="w-full">Schedule Interview</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {view === 'jobs' && (
        <>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow 
                      key={job.id}
                      className={selectedJob === job.id ? 'bg-muted' : ''}
                      onClick={() => setSelectedJob(job.id)}
                    >
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>{job.department}</TableCell>
                      <TableCell>{job.location}</TableCell>
                      <TableCell>{job.employment_type}</TableCell>
                      <TableCell>{getStatusBadge(job.status)}</TableCell>
                      <TableCell>{format(new Date(job.created_at), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete('jobs', job.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          {selectedJob && (
            <AIRecruitmentPanel 
              jobId={selectedJob}
              applications={applications.filter(app => app.job_id === selectedJob)}
              onRefresh={fetchData}
            />
          )}
        </>
      )}

      {view === 'applications' && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Job</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>AI Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">{app.candidate_name}</TableCell>
                    <TableCell>{app.jobs?.title}</TableCell>
                    <TableCell>{app.candidate_email}</TableCell>
                    <TableCell>{app.candidate_phone}</TableCell>
                    <TableCell>
                      {app.ai_match_score ? (
                        <Badge variant={
                          app.ai_match_score >= 80 ? "default" :
                          app.ai_match_score >= 60 ? "secondary" : "outline"
                        }>
                          {app.ai_match_score}/100
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">Not analyzed</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(app.status)}</TableCell>
                    <TableCell>{format(new Date(app.created_at), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete('applications', app.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {view === 'interviews' && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Job</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>AI Score</TableHead>
                  <TableHead>Recommendation</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {interviews.map((interview) => (
                  <TableRow key={interview.id}>
                    <TableCell className="font-medium">
                      {interview.applications?.candidate_name}
                    </TableCell>
                    <TableCell>{interview.applications?.jobs?.title}</TableCell>
                    <TableCell>
                      {format(new Date(interview.interview_date), 'MMM dd, yyyy HH:mm')}
                    </TableCell>
                    <TableCell>{interview.interview_type}</TableCell>
                    <TableCell>
                      {interview.ai_score ? (
                        <Badge variant={
                          interview.ai_score >= 80 ? "default" :
                          interview.ai_score >= 60 ? "secondary" : "outline"
                        }>
                          {interview.ai_score}/100
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">Pending</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {interview.ai_recommendation ? (
                        <Badge variant={
                          ['STRONG_YES', 'YES'].includes(interview.ai_recommendation) ? "default" :
                          interview.ai_recommendation === 'MAYBE' ? "secondary" : "destructive"
                        }>
                          {interview.ai_recommendation}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(interview.status)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete('interviews', interview.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RecruitmentTracking;