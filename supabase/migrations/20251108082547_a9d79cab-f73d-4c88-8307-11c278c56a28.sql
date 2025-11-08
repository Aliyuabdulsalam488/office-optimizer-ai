-- Update profiles table to include role and preferences
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS role TEXT CHECK (role IN ('hr_manager', 'employee')),
ADD COLUMN IF NOT EXISTS login_method TEXT DEFAULT 'email_password' CHECK (login_method IN ('email_link', 'email_password', 'google')),
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{
  "notifications_enabled": true,
  "dark_mode": false,
  "two_factor_enabled": false,
  "profile_photo_url": null
}'::jsonb,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_login_method ON public.profiles(login_method);

-- Update the handle_new_user function to include new fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, account_type, department, role, login_method, onboarding_completed)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'account_type',
    NEW.raw_user_meta_data->>'department',
    NEW.raw_user_meta_data->>'role',
    COALESCE(NEW.raw_user_meta_data->>'login_method', 'email_password'),
    false
  );
  RETURN NEW;
END;
$$;

-- Create auth_methods table to track available login methods per user
CREATE TABLE IF NOT EXISTS public.user_auth_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('email_link', 'email_password', 'google')),
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, method)
);

ALTER TABLE public.user_auth_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own auth methods"
  ON public.user_auth_methods
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own auth methods"
  ON public.user_auth_methods
  FOR ALL
  USING (auth.uid() = user_id);

-- Create onboarding_steps table to track optional features
CREATE TABLE IF NOT EXISTS public.onboarding_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  step_name TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  skipped BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, step_name)
);

ALTER TABLE public.onboarding_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own onboarding steps"
  ON public.onboarding_steps
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own onboarding steps"
  ON public.onboarding_steps
  FOR ALL
  USING (auth.uid() = user_id);