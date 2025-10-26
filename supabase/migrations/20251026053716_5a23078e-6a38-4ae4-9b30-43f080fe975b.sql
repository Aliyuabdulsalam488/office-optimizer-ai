-- Fix RLS policies for job board functionality

-- 1. Allow public to view open jobs
CREATE POLICY "Public can view open jobs"
ON jobs FOR SELECT
TO anon, authenticated
USING (status = 'open');

-- 2. Allow candidates to submit applications to open jobs
CREATE POLICY "Candidates can submit applications"
ON applications FOR INSERT
TO anon, authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM jobs 
    WHERE id = job_id AND status = 'open'
  )
);

-- 3. Allow candidates to view their own applications by email
CREATE POLICY "Candidates can view their own applications"
ON applications FOR SELECT
TO anon, authenticated
USING (
  candidate_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  OR EXISTS (
    SELECT 1 FROM jobs 
    WHERE id = job_id AND user_id = auth.uid()
  )
);

-- 4. Allow candidates to update their own applications
CREATE POLICY "Candidates can update their own applications"
ON applications FOR UPDATE
TO authenticated
USING (
  candidate_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  OR EXISTS (
    SELECT 1 FROM jobs 
    WHERE id = job_id AND user_id = auth.uid()
  )
);