# SPEC-007 — Authentication

## Context
Email + password authentication using Auth.js v5 (NextAuth).
Login and register appear as modals over the current page.
Protected routes: /booking/[slug]/* and /my-bookings.
Bookings are linked to authenticated users via user_id.
Session persists for 24 hours maximum.
Visual reference: specs/auth.html

## Supabase Schema Changes

```sql
-- Add user_id to bookings
ALTER TABLE bookings ADD COLUMN user_id text;

-- New users table (mirrors Auth.js session user)
CREATE TABLE users (
  id text PRIMARY KEY,
  full_name text,
  email text UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
```

## TypeScript Interfaces

```typescript
// app/types/auth.ts
interface AuthUser {
  id: string
  email: string
  fullName: string | null
}

interface SignInForm {
  email: string
  password: string
}

interface RegisterForm {
  fullName: string
  email: string
  password: string
  passwordConfirm: string
}

interface AuthModalState {
  isOpen: boolean
  mode: 'signin' | 'register'
  redirectTo: string | null
}
```

## Auth.js v5 Configuration

File: `auth.ts` (project root)
- Provider: Credentials (email + password)
- Session strategy: JWT
- Max session age: 86400 (24 hours)
- Callbacks: session callback adds user.id and fullName to session
- Credentials authorize function:
  1. Query Supabase users table by email
  2. Verify password with bcrypt.compare
  3. Return user object or null

File: `server/api/auth/[...].ts` — Auth.js Nuxt handler

## Pinia Store — Auth

File: `app/stores/auth.ts`

```typescript
interface AuthState {
  modal: AuthModalState
}
```

Actions:
- `openSignIn(redirectTo?: string)` — opens modal in signin mode
- `openRegister()` — opens modal in register mode
- `closeModal()` — closes modal, clears redirectTo
- `switchMode()` — toggles between signin and register

## Server API

### POST /api/auth/register
File: `server/api/auth/register.post.ts`

Steps:
1. Validate required fields — 400 if missing
2. Validate password rules:
   - Min 8 characters
   - At least 1 uppercase letter
   - At least 1 number
   - At least 1 special character
3. Check email not already taken — 409 if exists
4. Hash password with bcrypt (saltRounds: 12)
5. Insert into Supabase users table
6. Return 201 with user (id, email, fullName)

### POST /api/bookings (updated)
Add user_id from session to the booking insert.
If no session → user_id is null (anonymous bookings still allowed
until auth guard redirects unauthenticated users).

## Nuxt Middleware

File: `app/middleware/auth.global.ts` (global route guard)
- Runs on every navigation
- Protected routes: /booking/* and /my-bookings
- If unauthenticated → store openSignIn(redirectTo: currentRoute)
  then stay on current page (modal opens)
- After successful sign in → navigateTo(redirectTo)

## Components

### AuthModal.vue
File: `app/components/AuthModal.vue`
- Teleport to body
- Backdrop: fixed inset-0 bg-black/50 backdrop-blur-sm
- Modal: bg-surface rounded-xl shadow-xl p-8 max-w-md w-full
- Close button: absolute top-4 right-4
- Switches between SignInForm and RegisterForm based on store mode

### SignInForm.vue
File: `app/components/SignInForm.vue`
- Title: "Welcome back" — font-display text-2xl
- Email field
- Password field with show/hide toggle (eye icon SVG)
- "Sign in" button — bg-primary full width
- "Forgot password?" → shows inline message 
  "Password reset coming soon." (placeholder)
- Divider "or"
- "Create an account" link → store.switchMode()
- On submit: calls Auth.js signIn('credentials', {...})
- On success: store.closeModal() → navigateTo(redirectTo ?? '/')
- Validation on submit: email format, fields required

### RegisterForm.vue
File: `app/components/RegisterForm.vue`
- Title: "Join Wayrest" — font-display text-2xl
- Full name field
- Email field
- Password field with show/hide toggle
- Password confirmation field
- "Create account" button — bg-primary full width
- "Already have an account?" → store.switchMode()
- On submit: POST /api/auth/register → then signIn('credentials')
- Validation on submit:
  - All fields required
  - Email format valid
  - Password: 8+ chars, 1 uppercase, 1 number, 1 special char
  - passwordConfirm matches password

## AppHeader Updates

When unauthenticated:
- "Sign in" button → store.openSignIn()

When authenticated:
- Replace "Sign in" with user avatar circle (w-9 h-9 rounded-full)
- Initials fallback: first + last initial, bg-primary text-white
- Dropdown on click:
  - "My bookings" → navigateTo('/my-bookings')
  - "Sign out" → Auth.js signOut()

## My Bookings Page

File: `app/pages/my-bookings.vue`
- AppHeader
- Title: "My bookings" — font-display text-3xl
- List of bookings fetched from GET /api/my-bookings
- Each booking card:
  - Listing thumbnail (imageUrl, w-24 h-24 rounded-lg object-cover)
  - Listing title (font-medium)
  - Dates: "Check-in → Check-out"
  - Guests: "{n} guest(s)"
  - Reference: font-mono text-sm text-text-muted
  - Total paid: font-semibold
  - Status badge:
    - Upcoming: bg-success-50 text-success-700
    - Past: bg-neutral-100 text-neutral-500
- Empty state: "No bookings yet." with link to /

### GET /api/my-bookings
File: `server/api/my-bookings.get.ts`
- Requires authenticated session — 401 if not
- Query bookings WHERE user_id = session.user.id
- Join with listings for title and image_url
- Return bookings ordered by start_date DESC

## Password Validation Rules
- Minimum 8 characters
- At least 1 uppercase letter (A-Z)
- At least 1 number (0-9)
- At least 1 special character (!@#$%^&*...)
- Implemented as a shared utility: `server/utils/validatePassword.ts`
- Exportable for client-side use

## Technical Constraints

- Auth.js v5 with Nuxt — package: `@auth/nuxt`
- bcrypt for password hashing — package: `bcryptjs`
- Composition API — `<script setup lang="ts">`
- Tailwind CSS only — no inline styles
- Session max age: 86400 seconds (24h)
- AuthModal mounted in app.vue via <AuthModal />
- No dedicated /login or /register pages

## Expected Tests

- [ ] validatePassword: accepts valid password
- [ ] validatePassword: rejects missing uppercase
- [ ] validatePassword: rejects missing number
- [ ] validatePassword: rejects missing special char
- [ ] validatePassword: rejects under 8 chars
- [ ] register API: returns 400 on missing fields
- [ ] register API: returns 409 on duplicate email
- [ ] register API: returns 201 and hashes password
- [ ] my-bookings API: returns 401 when unauthenticated
- [ ] my-bookings API: returns bookings for authenticated user
- [ ] AuthModal: renders SignInForm by default
- [ ] AuthModal: switches to RegisterForm on link click
- [ ] AppHeader: shows avatar when authenticated
- [ ] AppHeader: shows Sign in button when unauthenticated
- [ ] middleware: redirects unauthenticated user to signin modal