-- Add AI-powered recruitment fields to applications table
ALTER TABLE public.applications 
ADD COLUMN ai_match_score INTEGER,
ADD COLUMN ai_analysis TEXT,
ADD COLUMN ai_analysis_date TIMESTAMP WITH TIME ZONE;

-- Add AI interview fields to interviews table
ALTER TABLE public.interviews 
ADD COLUMN ai_transcript TEXT,
ADD COLUMN ai_evaluation TEXT,
ADD COLUMN ai_recommendation TEXT,
ADD COLUMN ai_score INTEGER,
ADD COLUMN meeting_link TEXT;