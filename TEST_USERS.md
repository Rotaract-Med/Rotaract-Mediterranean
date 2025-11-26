# Test Users for Rotaract Mediterranean Dashboard

This document contains the credentials for test users created in the system. Use these accounts to test different role-based access controls.

## Test User Credentials

### Admin Account
- **Email:** admin@rotaractmed.org
- **Password:** Admin123!
- **Role:** Admin
- **Permissions:** Full access to all features including user management, articles, team, and media

### Journalist Accounts

#### Journalist 1
- **Email:** journalist1@rotaractmed.org
- **Password:** Journalist123!
- **Name:** Sarah Johnson
- **Role:** Journalist
- **Permissions:** Can create, edit, and delete articles in MEDTimes

#### Journalist 2
- **Email:** journalist2@rotaractmed.org
- **Password:** Journalist123!
- **Name:** Michael Chen
- **Role:** Journalist
- **Permissions:** Can create, edit, and delete articles in MEDTimes

### Media Team Accounts

#### Media Team 1
- **Email:** media1@rotaractmed.org
- **Password:** Media123!
- **Name:** Emma Rodriguez
- **Role:** Media Team
- **Permissions:** Can upload, manage, and delete media files (images, documents)

#### Media Team 2
- **Email:** media2@rotaractmed.org
- **Password:** Media123!
- **Name:** David Kim
- **Role:** Media Team
- **Permissions:** Can upload, manage, and delete media files (images, documents)

### Member Accounts

#### Member 1
- **Email:** member1@rotaractmed.org
- **Password:** Member123!
- **Name:** Alex Martinez
- **Role:** Member
- **Permissions:** View-only access to dashboard

#### Member 2
- **Email:** member2@rotaractmed.org
- **Password:** Member123!
- **Name:** Lisa Anderson
- **Role:** Member
- **Permissions:** View-only access to dashboard

#### Member 3
- **Email:** member3@rotaractmed.org
- **Password:** Member123!
- **Name:** James Wilson
- **Role:** Member
- **Permissions:** View-only access to dashboard

## Role Permissions Summary

| Feature | Admin | Journalist | Media Team | Member |
|---------|-------|------------|------------|--------|
| View Dashboard | ✅ | ✅ | ✅ | ✅ |
| Manage Articles | ✅ | ✅ | ❌ | ❌ |
| Manage Team | ✅ | ❌ | ❌ | ❌ |
| Manage Media | ✅ | ❌ | ✅ | ❌ |
| User Management | ✅ | ❌ | ❌ | ❌ |
| Change User Roles | ✅ | ❌ | ❌ | ❌ |

## How to Use

1. Run the SQL script `005_create_test_users.sql` in your Supabase SQL editor
2. The script will create all test users with their respective roles
3. Use the credentials above to log in at `/auth/login`
4. Test the role-based access control by logging in with different accounts

## Security Notes

- These are test credentials for development only
- Change all passwords before deploying to production
- Delete or disable these accounts in production environments
- Use strong, unique passwords for production users
