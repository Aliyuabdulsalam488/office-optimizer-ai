-- Drop the foreign key constraints that prevent user deletion
ALTER TABLE public.audit_logs 
  DROP CONSTRAINT IF EXISTS audit_logs_user_id_fkey;

ALTER TABLE public.user_activity 
  DROP CONSTRAINT IF EXISTS user_activity_user_id_fkey;

-- Add comments to document why these don't have FK constraints
COMMENT ON COLUMN public.audit_logs.user_id IS 
  'Historical reference to user ID. No foreign key to allow audit logs to persist after user deletion.';

COMMENT ON COLUMN public.user_activity.user_id IS 
  'Historical reference to user ID. No foreign key to allow activity logs to persist after user deletion.';