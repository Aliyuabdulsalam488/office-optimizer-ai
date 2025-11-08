-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'architect', 'reviewer', 'business_user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create floor_plans table
CREATE TABLE public.floor_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'in_review', 'approved', 'rejected')),
  project_type TEXT,
  area_sqm NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.floor_plans ENABLE ROW LEVEL SECURITY;

-- RLS policies for floor_plans
CREATE POLICY "Users can view their own floor plans"
  ON public.floor_plans
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Architects can create floor plans"
  ON public.floor_plans
  FOR INSERT
  WITH CHECK (auth.uid() = user_id AND public.has_role(auth.uid(), 'architect'));

CREATE POLICY "Users can update their own draft floor plans"
  ON public.floor_plans
  FOR UPDATE
  USING (auth.uid() = user_id AND status = 'draft');

CREATE POLICY "Reviewers can view all floor plans"
  ON public.floor_plans
  FOR SELECT
  USING (public.has_role(auth.uid(), 'reviewer'));

CREATE POLICY "Reviewers can update floor plan status"
  ON public.floor_plans
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'reviewer'));

-- Create floor_plan_versions table
CREATE TABLE public.floor_plan_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  floor_plan_id UUID REFERENCES public.floor_plans(id) ON DELETE CASCADE NOT NULL,
  version_number INTEGER NOT NULL,
  file_url TEXT,
  thumbnail_url TEXT,
  canvas_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.floor_plan_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view versions of their floor plans"
  ON public.floor_plan_versions
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.floor_plans
    WHERE floor_plans.id = floor_plan_versions.floor_plan_id
    AND floor_plans.user_id = auth.uid()
  ));

CREATE POLICY "Users can create versions for their floor plans"
  ON public.floor_plan_versions
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.floor_plans
    WHERE floor_plans.id = floor_plan_versions.floor_plan_id
    AND floor_plans.user_id = auth.uid()
  ));

CREATE POLICY "Reviewers can view all versions"
  ON public.floor_plan_versions
  FOR SELECT
  USING (public.has_role(auth.uid(), 'reviewer'));

-- Create floor_plan_reviews table
CREATE TABLE public.floor_plan_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  floor_plan_id UUID REFERENCES public.floor_plans(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected', 'changes_requested')),
  comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.floor_plan_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view reviews of their floor plans"
  ON public.floor_plan_reviews
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.floor_plans
    WHERE floor_plans.id = floor_plan_reviews.floor_plan_id
    AND floor_plans.user_id = auth.uid()
  ));

CREATE POLICY "Reviewers can create and manage reviews"
  ON public.floor_plan_reviews
  FOR ALL
  USING (public.has_role(auth.uid(), 'reviewer'));

-- Create floor_plan_checks table
CREATE TABLE public.floor_plan_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  floor_plan_id UUID REFERENCES public.floor_plans(id) ON DELETE CASCADE NOT NULL,
  check_type TEXT NOT NULL,
  issues_found JSONB,
  ai_suggestions TEXT,
  severity TEXT CHECK (severity IN ('info', 'warning', 'critical')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.floor_plan_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view checks for their floor plans"
  ON public.floor_plan_checks
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.floor_plans
    WHERE floor_plans.id = floor_plan_checks.floor_plan_id
    AND floor_plans.user_id = auth.uid()
  ));

CREATE POLICY "System can create checks"
  ON public.floor_plan_checks
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Reviewers can view all checks"
  ON public.floor_plan_checks
  FOR SELECT
  USING (public.has_role(auth.uid(), 'reviewer'));

-- Create storage bucket for floor plans
INSERT INTO storage.buckets (id, name, public)
VALUES ('floor-plans', 'floor-plans', false);

-- Storage policies for floor plans
CREATE POLICY "Users can upload floor plans"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'floor-plans' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own floor plans"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'floor-plans' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Reviewers can view all floor plans"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'floor-plans' AND
    public.has_role(auth.uid(), 'reviewer')
  );

-- Trigger to update updated_at
CREATE TRIGGER update_floor_plans_updated_at
  BEFORE UPDATE ON public.floor_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_floor_plan_reviews_updated_at
  BEFORE UPDATE ON public.floor_plan_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();