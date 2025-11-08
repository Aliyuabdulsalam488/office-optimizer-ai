-- Add new role values to existing app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'finance_manager';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'procurement_manager';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'sales_manager';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'executive';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'admin';

-- Update handle_new_user function to work with user_roles table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role app_role;
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, email, full_name, account_type, department, login_method, onboarding_completed)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'account_type',
    NEW.raw_user_meta_data->>'department',
    COALESCE(NEW.raw_user_meta_data->>'login_method', 'email_password'),
    false
  );

  -- Insert role from metadata into user_roles table
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'employee')::app_role;
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;