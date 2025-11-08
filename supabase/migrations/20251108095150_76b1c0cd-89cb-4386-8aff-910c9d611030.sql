-- Add missing roles to enum to prevent signup failures
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'employee';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'hr_manager';

-- Keep existing function handle_new_user as-is (it defaults to 'employee' if metadata role is missing)
