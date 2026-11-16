# My Wall

A 2008-inspired guest message wall for Test 2. Built with React 19, Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui-style source components, and Supabase Postgres Changes.

## Run it

1. Open a dedicated personal Supabase project and run `supabase/setup.sql` once in the SQL Editor. It creates the posts table, restricts public writes to the message body, and enables Realtime.
2. Copy `.env.example` to `.env.local`. Enter the Project URL and the public publishable key (or legacy anon key). Never use a secret or service-role key.
3. Run `npm ci` and `npm run dev`. Open http://localhost:3000.

## Deploy it

Push the source to a personal GitHub repository and import it into Vercel as a Next.js project. Set both example environment variables for Production before deploying. Copy the public production URL for the submission.

## Acceptance checks

- Space-only drafts leave Share disabled. The input stops at 280 characters.
- Share from browser A and verify a corresponding row in Supabase.
- Open browser B separately and wait for Live. Verify the post appears without refresh.
- Share a second post and verify it appears above the first in both browsers. Refresh and confirm both remain.
- Repeat on the public production deployment as a signed-out visitor.
