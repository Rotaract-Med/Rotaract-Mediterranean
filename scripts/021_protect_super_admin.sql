-- Protect a specific super admin user from deletion
-- This ensures that even other admins cannot delete this protected account

-- First, drop the existing delete policy
DROP POLICY
IF EXISTS "Admins can delete profiles" ON public.profiles;

-- Recreate the delete policy with super admin protection
-- Replace 'YOUR_SUPER_ADMIN_USER_ID' with the actual UUID of the user you want to protect
CREATE POLICY "Admins can delete profiles except super admin"
  ON public.profiles FOR
DELETE
  TO authenticated
  USING (
    -- User must be an admin
    EXISTS (
      SELECT 1
FROM public.profiles
WHERE id = auth.uid() AND role = 'admin'
    )
    AND
    -- Cannot delete the protected super admin user
    -- IMPORTANT: Replace this UUID with your actual super admin user ID
    id != 'YOUR_SUPER_ADMIN_USER_ID'::uuid
  );

-- Example with actual UUID (uncomment and replace with your user ID):
-- CREATE POLICY "Admins can delete profiles except super admin"
--   ON public.profiles FOR DELETE
--   TO authenticated
--   USING (
--     EXISTS (
--       SELECT 1 FROM public.profiles
--       WHERE id = auth.uid() AND role = 'admin'
--     )
--     AND
--     id != '12345678-1234-1234-1234-123456789abc'::uuid
--   );

-- To find your user ID, run this query:
-- SELECT id, email, full_name, role FROM public.profiles WHERE role = 'admin';
