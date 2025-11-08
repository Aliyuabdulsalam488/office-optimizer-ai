-- Create role upgrade requests table
CREATE TABLE public.role_upgrade_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  requested_role app_role NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.role_upgrade_requests ENABLE ROW LEVEL SECURITY;

-- Users can create their own requests
CREATE POLICY "Users can create their own upgrade requests"
ON public.role_upgrade_requests
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can view their own requests
CREATE POLICY "Users can view their own upgrade requests"
ON public.role_upgrade_requests
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Admins can view all requests
CREATE POLICY "Admins can view all upgrade requests"
ON public.role_upgrade_requests
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Admins can update requests
CREATE POLICY "Admins can update upgrade requests"
ON public.role_upgrade_requests
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_role_upgrade_requests_updated_at
BEFORE UPDATE ON public.role_upgrade_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to notify user when request is reviewed
CREATE OR REPLACE FUNCTION public.notify_role_upgrade_reviewed()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only notify if status changed to approved or rejected
  IF NEW.status != OLD.status AND NEW.status IN ('approved', 'rejected') THEN
    INSERT INTO public.notifications (user_id, title, message, type, action_url)
    VALUES (
      NEW.user_id,
      CASE 
        WHEN NEW.status = 'approved' THEN 'Role Upgrade Approved'
        ELSE 'Role Upgrade Request Reviewed'
      END,
      CASE 
        WHEN NEW.status = 'approved' THEN 'Your request to become ' || NEW.requested_role || ' has been approved!'
        ELSE 'Your request to become ' || NEW.requested_role || ' has been reviewed.'
      END,
      CASE 
        WHEN NEW.status = 'approved' THEN 'success'
        ELSE 'info'
      END,
      '/profile-settings'
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for notifications
CREATE TRIGGER on_role_upgrade_reviewed
AFTER UPDATE ON public.role_upgrade_requests
FOR EACH ROW
EXECUTE FUNCTION public.notify_role_upgrade_reviewed();