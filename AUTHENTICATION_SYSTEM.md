# TechStora Authentication System - MVP Documentation

## Overview
This document describes the flexible, preference-driven authentication system built for TechStora. The system respects user preferences, allows optional functionality, and serves as the foundation for the HR management system.

## Key Features

### 1. Multiple Login Methods
Users can choose their preferred authentication method:
- **Email Link (Passwordless)**: Receive a magic link via email to login without a password
- **Email & Password**: Traditional email/password authentication
- **Google OAuth**: Sign in with Google account

### 2. Role-Based Access Control
Two primary roles with distinct dashboards:
- **HR Manager**: Access to HR management features, recruitment, and system administration
- **Employee**: Access to personal dashboard, leave requests, and job browsing

### 3. User Preference Management
Users can customize their experience through:
- Email notifications toggle
- Dark mode preference
- Two-factor authentication (opt-in)
- Profile photo upload (optional)

### 4. Optional Onboarding Flow
After signup, users are guided through optional features:
- Profile photo upload
- Two-factor authentication setup
- Notification preferences
- Users can skip any step or all steps

## Database Schema

### Tables Created

#### 1. `profiles` (Extended)
```sql
- id (UUID, primary key)
- email (text)
- full_name (text)
- role (enum: 'hr_manager', 'employee')
- login_method (enum: 'email_link', 'email_password', 'google')
- preferences (JSONB): {
    notifications_enabled: boolean,
    dark_mode: boolean,
    two_factor_enabled: boolean,
    profile_photo_url: text
  }
- onboarding_completed (boolean)
- created_at, updated_at (timestamps)
```

#### 2. `user_auth_methods`
Tracks all authentication methods available to a user:
```sql
- id (UUID)
- user_id (UUID, foreign key)
- method (enum: 'email_link', 'email_password', 'google')
- is_primary (boolean)
- created_at (timestamp)
```

#### 3. `onboarding_steps`
Tracks completion of optional onboarding features:
```sql
- id (UUID)
- user_id (UUID)
- step_name (text)
- completed (boolean)
- skipped (boolean)
- completed_at (timestamp)
```

## Pages & Routes

### Authentication Routes
- `/auth` - Enhanced auth page with signup/login tabs
- `/onboarding` - Optional feature onboarding flow
- `/profile-settings` - User preferences and account management

### Dashboard Routes
- `/hr-dashboard` - HR Manager dashboard (role-protected)
- `/employee-dashboard` - Employee dashboard
- `/dashboard` - Legacy dashboard (kept for backwards compatibility)

### Other Routes
- `/recruitment` - Recruitment module
- `/floor-planner` - Floor planning module
- `/admin` - Admin panel (admin role required)
- `/jobs` - Job listings

## User Flow

### New User Signup
1. User visits `/auth` and clicks "Sign Up" tab
2. User fills in:
   - Full name
   - Email
   - Role selection (HR Manager or Employee)
   - Preferred login method
   - Password (if not using Google)
3. System creates account and sends verification email
4. After email verification, redirect to `/onboarding`
5. User completes or skips optional features
6. Redirect to role-appropriate dashboard

### Returning User Login
1. User visits `/auth` and selects login method
2. Based on saved preference:
   - **Email Link**: Enter email → Receive magic link → Click to login
   - **Email & Password**: Enter credentials → Login
   - **Google**: Click Google button → OAuth flow
3. System checks user role and redirects:
   - HR Manager → `/hr-dashboard`
   - Employee → `/employee-dashboard`

### Profile Settings Management
1. User clicks "Settings" from any dashboard
2. Can modify:
   - Full name
   - View email (read-only)
   - View role (read-only)
   - View current login method
   - Toggle preferences
3. Can access optional features at any time

## Security Features

### Input Validation
- All forms use Zod schema validation
- Email format validation
- Password minimum length (8 characters)
- Name length limits
- SQL injection prevention through Supabase client

### Row Level Security (RLS)
All tables have RLS policies:
- Users can only access their own profiles
- Users can only modify their own auth methods
- Users can only see their own onboarding steps
- Role-based access for HR features

### Session Management
- Persistent sessions using localStorage
- Automatic token refresh
- Secure session handling via Supabase Auth
- Auth state change listeners

### Authentication Security
- Email verification required
- Password strength requirements
- Support for OAuth providers
- Option for two-factor authentication

## Implementation Details

### Frontend Components

#### EnhancedAuth.tsx
Main authentication page with:
- Tabbed interface (Login/Signup)
- Dynamic form based on selected method
- Zod validation
- Error handling
- Toast notifications

#### ProfileSettings.tsx
User preference management:
- Profile information editing
- Preference toggles (notifications, dark mode, 2FA)
- Optional feature access
- Save/cancel functionality

#### Onboarding.tsx
Post-signup optional feature flow:
- Progressive disclosure of features
- Skip or complete each step
- Progress tracking
- Flexible completion

#### HRDashboard.tsx
HR Manager interface:
- Role verification
- Quick access to HR modules
- Statistics cards
- Navigation to sub-modules

#### EmployeeDashboard.tsx
Employee interface:
- Personal information display
- Leave balance
- Profile completion status
- Quick actions

### Backend Functions

#### handle_new_user()
Trigger function that:
- Creates profile when user signs up
- Extracts metadata from auth
- Sets default preferences
- Initializes role and login method

### Authentication Flows

#### Passwordless (Email Link)
```typescript
await supabase.auth.signInWithOtp({
  email: data.email,
  options: {
    emailRedirectTo: `${window.location.origin}/`,
  },
});
```

#### Email & Password
```typescript
await supabase.auth.signInWithPassword({
  email,
  password,
});
```

#### Google OAuth
```typescript
await supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo: `${window.location.origin}/`,
  },
});
```

## Configuration Requirements

### Supabase Auth Settings
1. **Email Confirmation**: For development, disable "Confirm email" in Supabase settings
2. **Site URL**: Set to your deployment URL
3. **Redirect URLs**: Add all deployment URLs and localhost for development

### Google OAuth Setup (if using)
1. Create Google Cloud Project
2. Configure OAuth consent screen
3. Create OAuth client ID
4. Add authorized origins and redirect URLs
5. Add credentials in Lovable Cloud dashboard

### Environment Variables
Already configured in Lovable Cloud:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

## Future Expansion

### Planned Features
1. **Advanced 2FA**: SMS, authenticator app support
2. **Profile Photos**: Upload and crop functionality
3. **Login Method Switching**: Allow users to add/remove methods
4. **Social Providers**: LinkedIn, Microsoft, etc.
5. **Session Management**: View and revoke active sessions
6. **Login History**: Track login attempts and locations
7. **Password Reset Flow**: Self-service password changes

### HR System Integration
The authentication system is designed to integrate with:
- Leave management module
- Attendance tracking
- Performance reviews
- Payroll system
- Document management
- Employee directory

### Analytics & Tracking
Track user preferences to understand:
- Most popular login methods
- Feature adoption rates
- Onboarding completion rates
- Preference patterns
- User engagement

## Deployment Instructions

### Initial Deployment
1. Ensure Lovable Cloud is connected
2. Run database migrations (already done)
3. Configure Google OAuth (if using)
4. Update auth settings in Lovable Cloud
5. Test all login methods
6. Publish frontend changes

### Updating the System
1. Make code changes locally
2. Test authentication flows
3. Run any new migrations
4. Deploy frontend updates
5. Verify role-based access
6. Check redirect logic

### Testing Checklist
- [ ] Email link login works
- [ ] Email/password login works
- [ ] Google OAuth login works (if configured)
- [ ] Signup creates profile correctly
- [ ] Role selection is saved
- [ ] Onboarding flow is skippable
- [ ] HR Manager redirects to `/hr-dashboard`
- [ ] Employee redirects to `/employee-dashboard`
- [ ] Profile settings save correctly
- [ ] Preferences persist across sessions
- [ ] Logout works from all dashboards

## Support & Troubleshooting

### Common Issues

#### "Requested path is invalid" error
- Check Site URL and Redirect URLs in Supabase
- Ensure they match your deployment URL
- Add all subdomains and localhost for development

#### Email verification not working
- For development: Disable "Confirm email" in Supabase auth settings
- For production: Configure email templates and SMTP

#### Google OAuth not working
- Verify OAuth credentials in Lovable Cloud
- Check authorized origins and redirect URLs
- Ensure consent screen is configured

#### Users can't access dashboard
- Verify role is set in profiles table
- Check RLS policies are enabled
- Ensure auth session is valid

### Getting Help
1. Check Lovable documentation: https://docs.lovable.dev/
2. Review Supabase Auth docs: https://supabase.com/docs/guides/auth
3. Contact support: support@lovable.dev
4. TechStora team support channel

## Best Practices

### For Users
1. Choose a strong, unique password
2. Enable two-factor authentication for sensitive accounts
3. Keep profile information up to date
4. Review and update preferences periodically
5. Use email link (passwordless) for convenience and security

### For Administrators
1. Regularly review user roles and access
2. Monitor authentication logs for suspicious activity
3. Keep backup of database schema
4. Test authentication flows after updates
5. Communicate changes to users
6. Provide training on security features

### For Developers
1. Never log sensitive authentication data
2. Always validate user input
3. Use RLS policies for all user data
4. Test with multiple user roles
5. Handle errors gracefully
6. Keep dependencies updated
7. Follow secure coding practices

## Conclusion

This authentication system provides a solid, flexible foundation for TechStora's HR platform. It prioritizes user preference and optional functionality while maintaining security and ease of use. The modular design allows for future expansion without disrupting existing functionality.

The system is ready for MVP launch and can scale as TechStora grows.
