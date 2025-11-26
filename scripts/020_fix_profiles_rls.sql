-- Fix RLS policies for profiles table to ensure proper access

-- Drop existing policies
DROP POLICY
IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY
IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY
IF EXISTS "Admins can update any profile" ON public.profiles;

-- Recreate policies with explicit authentication check

-- Allow authenticated users to view all profiles
CREATE POLICY "Authenticated users can view all profiles"
  ON public.profiles FOR
SELECT
    TO authenticated
USING
(true);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR
UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Allow admins to update any profile
CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR
UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
FROM public.profiles
WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow admins to delete profiles (for user management)
CREATE POLICY "Admins can delete profiles"
  ON public.profiles FOR
DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
FROM public.profiles
WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Verify RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT SELECT ON public.profiles TO authenticated;
GRANT UPDATE ON public.profiles TO authenticated;
GRANT DELETE ON public.profiles TO authenticated;
