-- SOLUTION 1: Add project identifier column to profiles table
-- This allows both projects to coexist without trigger changes

-- Add project column to profiles
ALTER TABLE public.profiles 
ADD COLUMN
IF NOT EXISTS project TEXT DEFAULT 'mdiomed';

-- Create index for faster filtering
CREATE INDEX
IF NOT EXISTS idx_profiles_project ON public.profiles
(project);

-- Update existing profiles to have 'mdiomed' project
UPDATE public.profiles 
SET project = 'mdiomed' 
WHERE project IS NULL;

-- Update trigger to set project from metadata or default to 'mdiomed'
DROP TRIGGER IF EXISTS on_auth_user_created
ON auth.users;

CREATE OR REPLACE FUNCTION public.handle_new_user
()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path
= public
AS $$
BEGIN
    -- Create profile with project identifier
    INSERT INTO public.profiles
        (id, email, full_name, role, project)
    VALUES
        (
            new.id,
            new.email,
            COALESCE(new.raw_user_meta_data->>'full_name', ''),
            COALESCE((new.raw_user_meta_data->>'role')::user_role, 'member'),
            COALESCE(new.raw_user_meta_data->>'project', 'mdiomed')
  )
    ON CONFLICT
    (id) DO NOTHING;

    RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER
INSERT ON
auth.users
FOR EACH ROW
EXECUTE
FUNCTION public.handle_new_user
();

-- Add RLS policy to only show mdiomed profiles
DROP POLICY
IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Users can view mdiomed profiles"
  ON public.profiles FOR
SELECT
    USING (project = 'mdiomed');

-- Keep other policies but add project filter
DROP POLICY
IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR
UPDATE
  USING (auth.uid()
= id AND project = 'mdiomed');

DROP POLICY
IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR
UPDATE
  USING (
    project = 'mdiomed'
AND
    EXISTS
(
      SELECT 1
FROM public.profiles
WHERE id = auth.uid() AND role = 'admin' AND project = 'mdiomed'
    )
);

-- Note: Profiles from other projects will still be created in the table,
-- but they won't be visible to mdiomed users due to RLS policies
