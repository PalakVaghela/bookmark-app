# Bookmark App

A Next.js bookmark manager with Supabase auth. Users sign up, save private/public links on `/dashboard`, and share public bookmarks at `/<handle>`.

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com/) project

## Run locally

```bash
git clone https://github.com/PalakVaghela/bookmark-app.git
cd bookmark-app
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (signup handle check) |
| `EMAIL_USER` | Gmail address used to send welcome emails |
| `EMAIL_PASSWORD` | Gmail [app password](https://myaccount.google.com/apppasswords) |

## Supabase setup

### Create tables

**`user`**

| Column | Type |
|---|---|
| `id` | `uuid` (references `auth.users.id`) |
| `handle` | `text` |
| `created_at` | `timestamp` |

**`bookmarks`**

| Column | Type |
|---|---|
| `id` | `uuid` |
| `user_id` | `uuid` (references `user.id`) |
| `title` | `text` |
| `url` | `text` |
| `is_public` | `boolean` |
| `created_at` | `timestamp` |

```sql
create table public."user" (
  id uuid primary key references auth.users(id) on delete cascade,
  handle text unique not null,
  created_at timestamptz not null default now()
);

create table public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public."user"(id) on delete cascade,
  title text not null,
  url text not null,
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);
```

### Enable Row Level Security

Turn on RLS for both tables. Policies:

**`user`**

| Operation | Policy |
|---|---|
| SELECT | Public read (for `/<handle>` pages) |
| INSERT | `auth.uid() = id` |

**`bookmarks`**

| Operation | Policy |
|---|---|
| SELECT | `auth.uid() = user_id` or `is_public = true` |
| INSERT | `auth.uid() = user_id` |
| UPDATE | `auth.uid() = user_id` |
| DELETE | `auth.uid() = user_id` |


### Notes

- `EMAIL_USER` / `EMAIL_PASSWORD` are the **sender** credentials; users can sign up with any email provider.
- Signup still works if welcome email fails; email is optional, not verification.
- For production, enable Supabase **email confirmation** to block fake signups.


## AI Usage Reflection
AI was used as a development assistant throughout the project for architecture suggestions, code generation, debugging. However, all generated solutions were reviewed and validated before implementation.

- ### Problem: Unnecessary Form Reset Logic

    The AI suggested using a `formKey` to reset the bookmark form after creation.

    **Solution**

    I reviewed the component lifecycle and noticed the form was already being unmounted when closed, which naturally reset its state.

    I removed the `formKey` implementation and relied on component unmounting.

    **Impact**

    Reduced state management complexity and removed unnecessary code.

---
- ### Problem: Over-Engineered State Updates

    The AI initially suggested solutions involving `Date.now()` and additional client-side state tracking.

    **Solution**

    I noticed inconsistencies in how dependencies were being managed and questioned whether the extra state was actually required.

    I moved timestamp generation to the server action and used action state updates instead of client-generated values.

    **Impact**

    Created a more predictable data flow and simplified component logic.

---

- ### Problem: Excessive Project Structure

    The AI frequently suggested additional files, folders, and abstractions.

    **Solution**

    For a small bookmark application, several of these layers provided little practical value and increased navigation complexity.

    I consolidated related logic and only introduced abstractions when they solved a real problem.

    **Impact**

    Reduced code complexity, improved maintainability, and lowered the total lines of code.

---
- ### Problem: Redundant Validation Logic

    The AI suggested implementing custom validation for conditions that were already enforced by Supabase Authentication, such as password length requirements.

    **Solution**

    During testing, I noticed that Supabase was already returning clear validation errors for these cases. Maintaining the same validation in multiple places would increase code and complexity.

    I removed the duplicate validation logic and relied on Supabase's built-in validation responses, displaying the returned error messages directly to users.

    **Impact**

    Reduced code duplication, simplified the authentication flow, and ensured validation rules remained consistent with the authentication provider.

---

- ### Problem: Unnecessary Database Queries

    The AI occasionally suggested querying user information that was already available from the authenticated session.

    **Solution**

    While reviewing the generated code, I noticed that some database requests were retrieving data that had already been provided by the active user session.

    I reused the existing session data instead of issuing additional database queries and only fetched data when it was genuinely required.

    **Impact**

    Reduced database operations, improved performance, simplified request flows, and lowered unnecessary backend overhead.

## Thing I'd Improve With More Time
- User profile pages with profile information.
- Search functionality to discover bookmarks.
- Sorting and filtering options (newest, oldest, alphabetical).
- Password reset and account management features.

If I had more time, I would like to expand the application from a personal bookmark manager into a **small social bookmarking platform**.

The first feature I would add is a **follow system**, allowing users to follow other public profiles. When a user publishes a new public bookmark, followers would receive an **email notification** containing the new link.

To support this, I would also introduce:

These additions would transform the application from a simple bookmark storage tool into a **platform for sharing and discovering useful resources while maintaining the existing privacy controls.**
