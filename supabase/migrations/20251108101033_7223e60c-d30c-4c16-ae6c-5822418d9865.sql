-- Add missing roles to the app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'finance_manager';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'sales_manager';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'executive';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'procurement_manager';

-- Create a table to store user-specific feature modules
CREATE TABLE IF NOT EXISTS public.user_feature_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_name text NOT NULL,
  enabled boolean DEFAULT true,
  enabled_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, module_name)
);

-- Enable RLS
ALTER TABLE public.user_feature_modules ENABLE ROW LEVEL SECURITY;

-- Users can view and manage their own feature modules
CREATE POLICY "Users can view their own feature modules"
ON public.user_feature_modules
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own feature modules"
ON public.user_feature_modules
FOR ALL
USING (auth.uid() = user_id);

-- Create a table to store role-specific profile data
CREATE TABLE IF NOT EXISTS public.role_specific_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  data jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.role_specific_data ENABLE ROW LEVEL SECURITY;

-- Users can view and manage their own role-specific data
CREATE POLICY "Users can view their own role data"
ON public.role_specific_data
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own role data"
ON public.role_specific_data
FOR ALL
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_role_specific_data_updated_at
BEFORE UPDATE ON public.role_specific_data
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();