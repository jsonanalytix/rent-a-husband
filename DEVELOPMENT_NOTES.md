# Development Notes

## Email Confirmation in Supabase

Currently, email confirmation is **enabled** on this Supabase project. This means:

1. When users sign up, they must confirm their email before they can log in
2. Users will receive an email with a confirmation link
3. Only after clicking the link can they sign in to the application

### To Disable Email Confirmation (for easier development):

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `rent-a-husband`
3. Navigate to **Authentication** → **Providers**
4. Click on **Email** provider
5. Toggle OFF "Confirm email" option
6. Save the changes

### Current Behavior:

- When a user signs up, they see a success message asking them to check their email
- The user record and profile are created via database triggers
- The user cannot log in until they confirm their email

### Testing with Email Confirmation Enabled:

1. Sign up with a real email address
2. Check your email inbox (including spam folder)
3. Click the confirmation link in the email
4. You can now log in with your credentials

### Alternative: Use Supabase Dashboard to Confirm Users

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Users**
3. Find the user you just created
4. Click on the user to view details
5. You can manually confirm the user from there

## Other Development Tips

### Viewing Database Records

1. Go to Supabase Dashboard → **Table Editor**
2. Check these tables:
   - `users` - Core user records
   - `profiles` - User profile information
   - `helper_profiles` - Additional data for helpers
   - `tasks` - Posted tasks
   - `applications` - Task applications

### Monitoring Logs

1. Go to Supabase Dashboard → **Logs** → **Edge Functions**
2. You can see real-time logs for API calls
3. Check for any errors in user creation or authentication

### RLS (Row Level Security) Policies

All tables have RLS enabled for security. Current policies:
- Users can only view/edit their own data
- Public profiles are viewable by everyone
- Tasks and applications have role-based access

### Local Development

To run the project locally:
```bash
npm install
npm run dev
```

Access the app at: http://localhost:5173 