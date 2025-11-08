-- Create businesses table
CREATE TABLE public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  industry TEXT,
  size TEXT,
  logo_url TEXT,
  brand_colors JSONB DEFAULT '{"primary": "#6366f1", "secondary": "#8b5cf6", "accent": "#0ea5e9"}'::jsonb,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for businesses
CREATE POLICY "Users can view businesses they own"
  ON public.businesses
  FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can create their own business"
  ON public.businesses
  FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own business"
  ON public.businesses
  FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Admins can view all businesses"
  ON public.businesses
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- Create business_members table for multi-user businesses
CREATE TABLE public.business_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(business_id, user_id)
);

-- Enable RLS
ALTER TABLE public.business_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for business_members
CREATE POLICY "Users can view their business memberships"
  ON public.business_members
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Business owners can manage members"
  ON public.business_members
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE id = business_members.business_id
      AND owner_id = auth.uid()
    )
  );

-- Add business_id to profiles
ALTER TABLE public.profiles ADD COLUMN business_id UUID REFERENCES public.businesses(id);

-- Update trigger for businesses
CREATE TRIGGER update_businesses_updated_at
  BEFORE UPDATE ON public.businesses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();