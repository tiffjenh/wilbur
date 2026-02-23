# Auth UI + “Invalid login credentials” — PR notes

## Root cause (invalid login credentials)

**What we verified**

1. **Login uses password auth only**  
   - `signInWithPassword({ email, password })` is used. No `signInWithOtp` or magic link on the login path.

2. **Signup creates the user correctly**  
   - `signUp({ email, password, options: { data: { first_name, last_name, full_name }, emailRedirectTo } })` is used.  
   - Password is sent in plain text to Supabase (no client-side hashing).

3. **Email confirmation**  
   - When Supabase “Confirm email” is ON, unconfirmed users get an error on login (often “Invalid login credentials” or an “email not confirmed” message).  
   - We detect “email not confirmed” via the error message and show: “Please verify your email before logging in.” with a “Resend verification email” action.  
   - We do not auto-log in or redirect after signup when `requiresConfirmation` is true; we show “Check your email to authenticate your account” and resend.

4. **Env / project**  
   - App uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. If the user was created in a different Supabase project (e.g. different env or another app), login in this project will fail with “Invalid login credentials.”  
   - Ensure Vercel env vars match the Supabase project where the user was created.

5. **Dev logging**  
   - In development, a failed `signInWithPassword` logs the full Supabase error (message, name, status) to the console as `[Auth] signInWithPassword Supabase error:`.

**What changed**

- Auth is a single `/auth` page with a Log in / Sign up toggle.  
- Sign up uses first name + last name and stores them in Supabase user metadata (`first_name`, `last_name`, `full_name`).  
- Login/signup flows and unconfirmed-email handling are unchanged; only the UI and routing were unified.

---

## Files changed

| File | Change |
|------|--------|
| `src/contexts/AuthContext.tsx` | signUp(..., firstName, lastName); options.data first_name, last_name, full_name; dev-only console.warn on signIn error. |
| `src/pages/Auth.tsx` | **New.** Single auth page: toggle (Log in / Sign up), centered module, black border, login + signup forms, first/last name, confirm password, confirmation + resend UX. |
| `src/app/App.tsx` | Route `/auth` → Auth; `/login` → redirect `/auth?mode=login`; `/signup` → redirect `/auth?mode=signup`. |
| `src/pages/AuthCallback.tsx` | Redirects to `/auth?mode=login` or `/auth?mode=login&confirmed=1`. |
| `src/components/ProtectedRoute.tsx` | Redirect to `/auth?mode=login` when unauthenticated. |
| `src/components/layout/TopNav.tsx` | Login → `/auth?mode=login`; Sign up → `/auth?mode=signup` (desktop + mobile + AccountPopup). |
| `src/pages/Dashboard.tsx` | Account popup: Login/Sign up → `/auth?mode=login`, `/auth?mode=signup`. |
| `src/pages/Learning.tsx` | Same. |
| `src/pages/Lesson.tsx` | Same. |
| `src/pages/Signup.tsx` | signUp call updated to pass first/last name (split from single “name” field) for type compatibility; page is no longer used (redirect to /auth). |

---

## How to test

### Local

1. **Env**  
   - `.env.local`: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` for the Supabase project you use locally.

2. **Unified auth**  
   - Open `/auth` → default is Log in.  
   - Switch to “Sign up” → form has First name, Last name, Email, Password, Confirm password (after typing password).  
   - Nav “Login” → `/auth?mode=login`.  
   - Nav “Sign up” → `/auth?mode=signup`.  
   - Refresh with `?mode=signup` → Sign up tab stays selected.

3. **Sign up**  
   - Fill first name, last name, email, password, confirm password (matching, 8+ chars). Submit.  
   - If confirmation is ON: “Check your email to authenticate your account” + “Send it again”; no redirect.  
   - “Send it again” → “Verification email sent.” (and email received if configured).  
   - “Go to Log in” → switches to Log in tab.

4. **Login (unverified)**  
   - Before confirming email, try to log in → “Please verify your email before logging in.” + “Resend verification email.”  
   - Resend → “Verification email sent.”

5. **Login (verified)**  
   - Confirm email via link → redirect to `/auth?mode=login&confirmed=1` → “Authentication successful, please login.”  
   - Log in with email/password → redirect to dashboard (if profile exists) or homepage (if not).

6. **Protected routes**  
   - While logged out, open a protected URL → redirect to `/auth?mode=login`.

7. **Dev logging**  
   - In dev, trigger a failed login (wrong password or unconfirmed) → console shows `[Auth] signInWithPassword Supabase error:` with message/name/status.

### Vercel

1. **Env**  
   - Vercel project: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` same as the Supabase project where users are created.

2. **Supabase**  
   - Authentication → URL Configuration: Site URL = production URL; Redirect URLs include `https://<your-vercel-domain>/auth/callback`.

3. **Repeat**  
   - Same flows as local: `/auth`, toggle, sign up (first/last, confirm password), confirmation message, resend, login blocked until verified, then login → dashboard or home.

---

## Acceptance checklist

- [x] “Invalid login credentials” handled: unconfirmed users see clear message + resend; dev logging for sign-in errors.  
- [x] Login and sign up on one screen with Log in / Sign up toggle.  
- [x] Auth module centered, black border, rounded.  
- [x] Nav Login → `/auth?mode=login`; Sign up → `/auth?mode=signup`.  
- [x] Sign up: first name, last name, confirm password, validation, metadata.  
- [x] Text under primary button centered on both tabs.  
- [x] Verified user can log in and reach dashboard; unverified blocked with message + resend.
