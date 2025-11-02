-- Add user categorization fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN account_type text CHECK (account_type IN ('business', 'personal')),
ADD COLUMN department text CHECK (department IN ('hr', 'finance', 'procurement', 'sales', 'executive', 'data_cleaning', 'general'));

-- Add comment for clarity
COMMENT ON COLUMN public.profiles.account_type IS 'Type of account: business or personal';
COMMENT ON COLUMN public.profiles.department IS 'User department/interest area: hr, finance, procurement, sales, executive, data_cleaning, or general';