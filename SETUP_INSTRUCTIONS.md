# Setup Instructions

## Environment Variables

Create a file called `.env.local` in the consultit folder with this content:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://rxqsqwjlbauomtyrhfbc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4cXNxd2psYmF1b210eXJoZmJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwODIzMDEsImV4cCI6MjA3ODY1ODMwMX0.T51D73rch7XRlY_34PQfZKOWleMxRipjR1642vebZC0

# OpenAI (you'll need to get your own key)
OPENAI_API_KEY=your-key-here
```

## Setting Up Supabase Authentication

1. **Go to your Supabase Dashboard:** https://supabase.com/dashboard
2. **Select your project** (or create one if you haven't)
3. **Go to Authentication → Providers**
4. **Enable Email Provider:**
   - Toggle "Enable Email provider" ON
   - Configure email templates if desired (optional)
5. **Enable Google OAuth (Optional):**
   - Toggle "Google" ON
   - You'll need to create OAuth credentials in Google Cloud Console
   - Add Client ID and Client Secret
   - Add redirect URL: `http://localhost:3000/auth/callback` (for dev)
6. **Enable Microsoft OAuth (Optional):**
   - Toggle "Azure" ON
   - Create app in Azure Portal
   - Add Client ID and Client Secret
   - Add redirect URL: `http://localhost:3000/auth/callback` (for dev)
7. **Configure Redirect URLs:**
   - Go to Authentication → URL Configuration
   - Add Site URL: `http://localhost:3000` (for dev)
   - Add Redirect URLs: `http://localhost:3000/auth/callback`

**Note:** For production, you'll need to update these URLs to your production domain.

## Getting OpenAI API Key

1. Go to https://platform.openai.com/signup
2. Create account
3. Add payment method (pay-as-you-go)
4. Go to API Keys section
5. Create new secret key
6. Copy and paste into .env.local

Cost: ~$0.01-0.05 per conversation (very cheap!)

## Running the App

```bash
cd /Users/ianbarker/Desktop/CONSULTANT/consultit
npm run dev
```

Open http://localhost:3000

