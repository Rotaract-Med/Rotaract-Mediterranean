-- Set JWT expiry to 15 minutes (900 seconds) for self-hosted Supabase
-- This configures the auth.jwt_exp configuration parameter

-- Set JWT expiry to 15 minutes (900 seconds)
ALTER DATABASE postgres SET "app.settings.jwt_exp"
TO '900';

-- Alternative: Update the auth config if using GoTrue directly
-- You may also need to update your GoTrue configuration file (config.toml or environment variables):
-- JWT_EXP = 900
-- JWT_DEFAULT_GROUP_NAME = "authenticated"

-- The client-side auth configuration in lib/client.ts, lib/server.ts, and lib/middleware.ts
-- has been updated to support auto-refresh tokens with 15-minute sessions

-- After running this script, restart your Supabase services for changes to take effect:
-- docker-compose restart (if using Docker)
-- or restart the GoTrue service

-- Users will be automatically logged out after 15 minutes of inactivity
-- The middleware will check session validity on each request to protected routes
