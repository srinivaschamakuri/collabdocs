# Architecture and tradeoffs

**Product slice:** private document workspace with rich-text editing, durable persistence, and explicit view-only sharing.

**Frontend:** React + TypeScript + Vite. Tiptap/ProseMirror stores structured JSON; the toolbar exposes a limited, coherent set of formatting operations. A 650 ms debounce sends updates to Supabase; navigation through the app flushes pending changes.

**Backend:** Supabase Auth issues user sessions. PostgREST provides typed-by-app CRUD access to Postgres. Row-level security limits read access to owner or grantee and write access to owner. A `security definer` function grants shares by registered email after validating owner identity. No separate API server is needed.

**Data:** `documents` holds title, JSONB editor content, owner, timestamps. `document_shares` joins documents and registered users, with a single `viewer` permission. `profiles` maps registered emails to auth IDs without exposing the full directory to ordinary clients.

**Scope cuts:** no collaborative cursor syncing or OT/CRDT, no unregistered invites, no rich Markdown parser, no binary attachment storage, no comments. This favors a reliable full-stack vertical slice in six hours.

**Next 2–4 hours:** add Supabase-backed integration tests for RLS and sharing, explicit save-on-visibility-change, loading/error states for slow networks, document deletion with confirmation, and more accessible keyboard interactions.
