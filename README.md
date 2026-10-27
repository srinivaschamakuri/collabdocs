# CollabDocs

A deliberately scoped, Google Docs-inspired full-stack document editor built with React, TypeScript, Tiptap, Supabase Postgres/Auth/RLS, and Vercel.

## What works
- Email/password sign up and sign in; confirmation email may be required depending on Supabase Auth settings.
- Create, rename, edit, autosave, reopen documents; JSON rich text retains bold, italic, underline, headings, and lists.
- Import **.txt and .md only**, up to **1 MB**. Markdown is imported as plain text (not parsed as Markdown formatting).
- Share with another **already registered** user by email, granting **read-only** access. Owned and Shared sections are separate.
- Database-level RLS enforces owner write permissions and shared read permissions.

## Local setup
Prerequisites: Node.js 20+ and a free Supabase project.
1. Run `npm install`.
2. Create a Supabase project, open **SQL Editor**, and run `supabase/schema.sql`.
3. Copy `.env.example` to `.env`; fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from Supabase **Project Settings → API** (use the publishable/anon key, **never the service role key**).
4. In Supabase **Authentication → URL Configuration**, set your Site URL to `http://localhost:5173` for local testing; add the deployed domain after deployment.
5. Run `npm run dev` and open `http://localhost:5173`.
6. Run `npm test` and `npm run build`.

## Sharing demo
Create two accounts with separate email addresses, and verify them if confirmation is enabled. Log in as User A, create a document, and grant view access to User B's email. Log in as B (separate browser/private window) and open **Shared with me**. B can view but cannot edit or re-share. User A can edit. Share recipients must have registered before sharing.

## Deploy to Vercel
1. Push the source folder to a Git repository (do not commit `.env`).
2. Import it into Vercel with **Vite** framework preset; build command `npm run build`, output directory `dist`.
3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel environment variables; redeploy.
4. Add the deployed URL to Supabase Authentication URL Configuration. Test two-user sharing on the public URL.
5. Paste the verified live URL into `SUBMISSION.md`.

## Known limitations
No real-time coediting, invitations to unregistered emails, document deletion UI, version history, export, comments, attachments, or advanced roles. Autosave is debounced; navigate using the **Documents** button to flush pending changes. Refreshing during the debounce window may lose the latest keystrokes. File import reads text into the browser; no binary file storage. No production rate limiting or audit logs. The automated test covers import/title validation; manual two-user RLS checks are required before submission.

## Security notes
Never ship service-role keys in client code. RLS applies to all document reads/writes. The sharing RPC checks ownership before inserting grants. For a production app, add stricter email handling, abuse controls, and integration tests against a dedicated Supabase instance.
