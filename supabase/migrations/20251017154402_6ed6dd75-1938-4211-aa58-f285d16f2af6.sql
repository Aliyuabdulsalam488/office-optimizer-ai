-- Create jobs table
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  department TEXT,
  location TEXT,
  employment_type TEXT,
  salary_range TEXT,
  requirements TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'draft')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create applications table
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  candidate_name TEXT NOT NULL,
  candidate_email TEXT NOT NULL,
  candidate_phone TEXT,
  cv_url TEXT,
  cover_letter TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'shortlisted', 'rejected', 'accepted')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create interviews table
CREATE TABLE public.interviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  interview_date TIMESTAMP WITH TIME ZONE NOT NULL,
  interview_type TEXT CHECK (interview_type IN ('phone', 'video', 'in-person', 'technical')),
  interviewer_name TEXT,
  location TEXT,
  notes TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for jobs
CREATE POLICY "Users can view their own jobs"
ON public.jobs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own jobs"
ON public.jobs FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own jobs"
ON public.jobs FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own jobs"
ON public.jobs FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for applications
CREATE POLICY "Users can view applications for their jobs"
ON public.applications FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.jobs
    WHERE jobs.id = applications.job_id
    AND jobs.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create applications for their jobs"
ON public.applications FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.jobs
    WHERE jobs.id = applications.job_id
    AND jobs.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update applications for their jobs"
ON public.applications FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.jobs
    WHERE jobs.id = applications.job_id
    AND jobs.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete applications for their jobs"
ON public.applications FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.jobs
    WHERE jobs.id = applications.job_id
    AND jobs.user_id = auth.uid()
  )
);

-- RLS Policies for interviews
CREATE POLICY "Users can view interviews for their applications"
ON public.interviews FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.applications
    JOIN public.jobs ON jobs.id = applications.job_id
    WHERE applications.id = interviews.application_id
    AND jobs.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create interviews for their applications"
ON public.interviews FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.applications
    JOIN public.jobs ON jobs.id = applications.job_id
    WHERE applications.id = interviews.application_id
    AND jobs.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update interviews for their applications"
ON public.interviews FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.applications
    JOIN public.jobs ON jobs.id = applications.job_id
    WHERE applications.id = interviews.application_id
    AND jobs.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete interviews for their applications"
ON public.interviews FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.applications
    JOIN public.jobs ON jobs.id = applications.job_id
    WHERE applications.id = interviews.application_id
    AND jobs.user_id = auth.uid()
  )
);

-- Create storage bucket for CVs
INSERT INTO storage.buckets (id, name, public)
VALUES ('cvs', 'cvs', false);

-- Storage policies for CVs
CREATE POLICY "Users can view CVs for their job applications"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'cvs' AND
  EXISTS (
    SELECT 1 FROM public.applications
    JOIN public.jobs ON jobs.id = applications.job_id
    WHERE jobs.user_id = auth.uid()
  )
);

CREATE POLICY "Users can upload CVs for their jobs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'cvs' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update CVs for their jobs"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'cvs' AND
  EXISTS (
    SELECT 1 FROM public.applications
    JOIN public.jobs ON jobs.id = applications.job_id
    WHERE jobs.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete CVs for their jobs"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'cvs' AND
  EXISTS (
    SELECT 1 FROM public.applications
    JOIN public.jobs ON jobs.id = applications.job_id
    WHERE jobs.user_id = auth.uid()
  )
);

-- Trigger for updating timestamps
CREATE TRIGGER update_jobs_updated_at
BEFORE UPDATE ON public.jobs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
BEFORE UPDATE ON public.applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_interviews_updated_at
BEFORE UPDATE ON public.interviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();