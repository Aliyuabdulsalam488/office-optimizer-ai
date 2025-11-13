-- Create job_applications table for freelance applications
CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id TEXT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT,
  cover_letter TEXT,
  resume_url TEXT,
  portfolio_url TEXT,
  linkedin_url TEXT,
  years_experience INTEGER,
  expected_salary TEXT,
  status TEXT DEFAULT 'submitted',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert applications (for testing without login)
CREATE POLICY "Anyone can submit job applications"
ON public.job_applications
FOR INSERT
WITH CHECK (true);

-- Allow anyone to view applications (for testing)
CREATE POLICY "Anyone can view job applications"
ON public.job_applications
FOR SELECT
USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_job_applications_email ON public.job_applications(email);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON public.job_applications(status);
CREATE INDEX IF NOT EXISTS idx_job_applications_created_at ON public.job_applications(created_at DESC);