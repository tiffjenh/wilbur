# Supabase setup for Wilbur

Sign up, log in (magic link), and sync lesson progress and profile to Supabase.

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a project.
2. In **Project Settings → API**, copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

## 2. Configure environment variables

**Local (Vite):**

Create `.env.local` in the project root (or copy from `.env.example`):

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Restart the dev server after changing env vars.

**Production (Vercel):**

In your Vercel project → Settings → Environment Variables, add:

- `VITE_SUPABASE_URL` = your Project URL  
- `VITE_SUPABASE_ANON_KEY` = your anon key  

Redeploy so the build picks them up.

## 3. Run the database schema

In Supabase Dashboard → **SQL Editor**, run the contents of `supabase/schema.sql`.

If you previously ran an older schema that had foreign keys from `lesson_progress` or `lesson_feedback` to `public.lessons`, drop them so lesson slugs can be stored without populating the lessons table:

```sql
ALTER TABLE public.lesson_progress DROP CONSTRAINT IF EXISTS lesson_progress_lesson_id_fkey;
ALTER TABLE public.lesson_feedback DROP CONSTRAINT IF EXISTS lesson_feedback_lesson_id_fkey;
```

## 4. Enable magic link auth

1. In Supabase Dashboard → **Authentication → Providers**, ensure **Email** is enabled.
2. Go to **Authentication → URL Configuration**:
   - **Site URL**: your production URL (e.g. `https://your-app.vercel.app`) or for local dev `http://localhost:5188`
   - **Redirect URLs**: add both:
     - `https://your-app.vercel.app/auth/callback`
     - `http://localhost:5188/auth/callback`

After this, sign up and log in will send a magic link; clicking it completes auth and redirects to `/auth/callback`, then to `/learning`.

## 5. What gets stored when users sign in

- **Profile**: onboarding answers (user_profiles).
- **Learning path**: recommended lesson order (user_paths).
- **Progress**: which lessons are completed (lesson_progress).
- **Feedback**: thumbs up/down / “already know” per lesson (lesson_feedback).
- **Saved lessons**: lessons added from the Library (user_added_lessons).

On login, local data is migrated to Supabase once; on each load, the app hydrates from Supabase so progress and profile are remembered across devices.

## Resend verification email not working?

If you click "Resend verification email" but never get an email:

1. **Account was created in a different Supabase project**  
   If you first signed up when the app was using another project (e.g. another site’s backend), your email exists there, not in this project. Resend in this app does nothing. **Fix:** Go to **Sign up**, enter the same email and a password, and submit. That creates the user in *this* project and sends one confirmation email to Wilbur’s callback.

2. **Supabase rate limits**  
   Default is about **2 emails per hour** per project and **one resend per 60 seconds** per user. If you hit the limit, the UI may show an error or the request may succeed but no email is sent. **Fix:** Wait at least 60 seconds between resend clicks, and up to an hour if you’ve already sent 2 emails. For production, configure [custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp) for higher limits.

3. **Default SMTP / authorized emails**  
   On the free tier, Supabase may only send to addresses authorized in the project. **Fix:** In Supabase Dashboard → **Project Settings → Auth**, check “Authorized emails” (or similar) and add your test address, or set up custom SMTP for production.
