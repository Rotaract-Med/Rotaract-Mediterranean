-- Script to create test users with different roles
-- Note: This script creates users directly in the auth.users table
-- In production, users should sign up through the application

-- Create admin user
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at,
  aud,
  role
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@rotaractmed.org',
  crypt('Admin123!', gen_salt('bf')),
  NOW(),
  jsonb_build_object(
    'full_name', 'Admin User',
    'role', 'admin'
  ),
  NOW(),
  NOW(),
  'authenticated',
  'authenticated'
) ON CONFLICT (email) DO NOTHING;

-- Create journalist users
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at,
  aud,
  role
) VALUES 
(
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'journalist1@rotaractmed.org',
  crypt('Journalist123!', gen_salt('bf')),
  NOW(),
  jsonb_build_object(
    'full_name', 'Sarah Johnson',
    'role', 'journalist'
  ),
  NOW(),
  NOW(),
  'authenticated',
  'authenticated'
),
(
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'journalist2@rotaractmed.org',
  crypt('Journalist123!', gen_salt('bf')),
  NOW(),
  jsonb_build_object(
    'full_name', 'Michael Chen',
    'role', 'journalist'
  ),
  NOW(),
  NOW(),
  'authenticated',
  'authenticated'
) ON CONFLICT (email) DO NOTHING;

-- Create media team users
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at,
  aud,
  role
) VALUES 
(
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'media1@rotaractmed.org',
  crypt('Media123!', gen_salt('bf')),
  NOW(),
  jsonb_build_object(
    'full_name', 'Emma Rodriguez',
    'role', 'media_team'
  ),
  NOW(),
  NOW(),
  'authenticated',
  'authenticated'
),
(
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'media2@rotaractmed.org',
  crypt('Media123!', gen_salt('bf')),
  NOW(),
  jsonb_build_object(
    'full_name', 'David Kim',
    'role', 'media_team'
  ),
  NOW(),
  NOW(),
  'authenticated',
  'authenticated'
) ON CONFLICT (email) DO NOTHING;

-- Create regular member users
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at,
  aud,
  role
) VALUES 
(
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'member1@rotaractmed.org',
  crypt('Member123!', gen_salt('bf')),
  NOW(),
  jsonb_build_object(
    'full_name', 'Alex Martinez',
    'role', 'member'
  ),
  NOW(),
  NOW(),
  'authenticated',
  'authenticated'
),
(
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'member2@rotaractmed.org',
  crypt('Member123!', gen_salt('bf')),
  NOW(),
  jsonb_build_object(
    'full_name', 'Lisa Anderson',
    'role', 'member'
  ),
  NOW(),
  NOW(),
  'authenticated',
  'authenticated'
),
(
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'member3@rotaractmed.org',
  crypt('Member123!', gen_salt('bf')),
  NOW(),
  jsonb_build_object(
    'full_name', 'James Wilson',
    'role', 'member'
  ),
  NOW(),
  NOW(),
  'authenticated',
  'authenticated'
) ON CONFLICT (email) DO NOTHING;

-- Display created users summary
DO $$
BEGIN
  RAISE NOTICE '=== Test Users Created ===';
  RAISE NOTICE 'Admin: admin@rotaractmed.org (Password: Admin123!)';
  RAISE NOTICE 'Journalists:';
  RAISE NOTICE '  - journalist1@rotaractmed.org (Password: Journalist123!)';
  RAISE NOTICE '  - journalist2@rotaractmed.org (Password: Journalist123!)';
  RAISE NOTICE 'Media Team:';
  RAISE NOTICE '  - media1@rotaractmed.org (Password: Media123!)';
  RAISE NOTICE '  - media2@rotaractmed.org (Password: Media123!)';
  RAISE NOTICE 'Members:';
  RAISE NOTICE '  - member1@rotaractmed.org (Password: Member123!)';
  RAISE NOTICE '  - member2@rotaractmed.org (Password: Member123!)';
  RAISE NOTICE '  - member3@rotaractmed.org (Password: Member123!)';
  RAISE NOTICE '========================';
END $$;
