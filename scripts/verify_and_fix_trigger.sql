-- Check if trigger exists
SELECT
    trigger_name,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Recreate the function and trigger to ensure it works
CREATE OR REPLACE FUNCTION public.handle_new_user
()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path
= public
AS $$
BEGIN
    INSERT INTO public.profiles
        (id, email, full_name, role)
    VALUES
        (
            new.id,
            new.email,
            COALESCE(new.raw_user_meta_data->>'full_name', new.email),
            'member'
    ::user_role
  )
  ON CONFLICT
    (id) DO NOTHING;
    RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created
ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER
INSERT ON
auth.users
FOR EACH ROW
EXECUTE
FUNCTION public.handle_new_user
();

-- Verify it was created
SELECT
    trigger_name,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
