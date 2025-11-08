-- Add comments table for collaboration
CREATE TABLE public.floor_plan_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  floor_plan_id UUID REFERENCES public.floor_plans(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  comment TEXT NOT NULL,
  position_x NUMERIC,
  position_y NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.floor_plan_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view comments on their floor plans"
  ON public.floor_plan_comments
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.floor_plans
    WHERE floor_plans.id = floor_plan_comments.floor_plan_id
    AND floor_plans.user_id = auth.uid()
  ));

CREATE POLICY "Users can create comments on accessible floor plans"
  ON public.floor_plan_comments
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.floor_plans
    WHERE floor_plans.id = floor_plan_comments.floor_plan_id
    AND floor_plans.user_id = auth.uid()
  ) OR public.has_role(auth.uid(), 'reviewer'));

CREATE POLICY "Reviewers can view all comments"
  ON public.floor_plan_comments
  FOR SELECT
  USING (public.has_role(auth.uid(), 'reviewer'));

-- Add sharing table
CREATE TABLE public.floor_plan_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  floor_plan_id UUID REFERENCES public.floor_plans(id) ON DELETE CASCADE NOT NULL,
  shared_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  shared_with_email TEXT NOT NULL,
  access_level TEXT DEFAULT 'view' CHECK (access_level IN ('view', 'comment', 'edit')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.floor_plan_shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view shares of their floor plans"
  ON public.floor_plan_shares
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.floor_plans
    WHERE floor_plans.id = floor_plan_shares.floor_plan_id
    AND floor_plans.user_id = auth.uid()
  ));

CREATE POLICY "Users can create shares for their floor plans"
  ON public.floor_plan_shares
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.floor_plans
    WHERE floor_plans.id = floor_plan_shares.floor_plan_id
    AND floor_plans.user_id = auth.uid()
  ));

-- Add cost estimates table
CREATE TABLE public.floor_plan_cost_estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  floor_plan_id UUID REFERENCES public.floor_plans(id) ON DELETE CASCADE NOT NULL,
  materials_cost NUMERIC DEFAULT 0,
  labor_cost NUMERIC DEFAULT 0,
  total_cost NUMERIC DEFAULT 0,
  cost_breakdown JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.floor_plan_cost_estimates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view cost estimates for their floor plans"
  ON public.floor_plan_cost_estimates
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.floor_plans
    WHERE floor_plans.id = floor_plan_cost_estimates.floor_plan_id
    AND floor_plans.user_id = auth.uid()
  ));

CREATE POLICY "Users can create cost estimates for their floor plans"
  ON public.floor_plan_cost_estimates
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.floor_plans
    WHERE floor_plans.id = floor_plan_cost_estimates.floor_plan_id
    AND floor_plans.user_id = auth.uid()
  ));

-- Add export logs table
CREATE TABLE public.floor_plan_exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  floor_plan_id UUID REFERENCES public.floor_plans(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  export_type TEXT NOT NULL CHECK (export_type IN ('pdf', 'png', 'jpg', 'dxf')),
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.floor_plan_exports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own exports"
  ON public.floor_plan_exports
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create exports"
  ON public.floor_plan_exports
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_floor_plan_comments_updated_at
  BEFORE UPDATE ON public.floor_plan_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_floor_plan_cost_estimates_updated_at
  BEFORE UPDATE ON public.floor_plan_cost_estimates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();