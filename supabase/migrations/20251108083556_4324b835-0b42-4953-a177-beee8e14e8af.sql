-- Add architect and home_builder roles to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'architect';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'home_builder';