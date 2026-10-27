# CollabDocs submission

## Included
- `src/` — React/TypeScript editor, auth, document dashboard, sharing, import, and tests
- `supabase/schema.sql` — database schema, triggers, RLS policies, sharing RPC
- `README.md` — setup, usage, deployment, limitations
- `ARCHITECTURE.md` — design and scope tradeoffs
- `AI_WORKFLOW.md` — AI disclosure and verification checklist
- `WALKTHROUGH_URL.txt` — video link placeholder
- `.env.example` — environment variable names (no secrets)

## Live product
**URL:** TODO — deploy and replace.

## Test accounts
**User A:** TODO — create a safe demo account.  
**User B:** TODO — create a second demo account.  
**Credentials:** TODO — provide to reviewers securely or use a dedicated temporary demo-only account.

## Local run
See `README.md`. Quick start: `npm install`, configure `.env`, run Supabase SQL, `npm run dev`.

## Status
Core source code is provided, but **deployment, live integration verification, and walkthrough recording are not complete**. Do not submit without checking them.

## Next 2–4 hours
Integration test access policies, harden autosave, improve error states, and add delete/export actions.
