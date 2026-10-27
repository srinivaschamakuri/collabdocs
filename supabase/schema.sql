-- Run once in Supabase SQL Editor. Email signup confirmation can be enabled.
create table if not exists public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 email text not null unique,
 display_name text
);
create table if not exists public.documents (
 id uuid primary key default gen_random_uuid(),
 title text not null check (char_length(trim(title)) between 1 and 120),
 content jsonb not null default '{"type":"doc","content":[{"type":"paragraph"}]}'::jsonb,
 owner_id uuid not null references auth.users(id) on delete cascade,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table if not exists public.document_shares (
 document_id uuid not null references public.documents(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 permission text not null default 'viewer' check(permission='viewer'),
 created_at timestamptz not null default now(),
 primary key(document_id,user_id)
);
create index if not exists documents_owner_idx on public.documents(owner_id);
create index if not exists shares_user_idx on public.document_shares(user_id);
create or replace function public.create_profile() returns trigger language plpgsql security definer set search_path = '' as $$
begin insert into public.profiles(id,email) values(new.id,lower(new.email)) on conflict(id) do update set email=excluded.email;return new;end;$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.create_profile();
-- Backfill preexisting users.
insert into public.profiles(id,email) select id,lower(email) from auth.users where email is not null on conflict(id) do update set email=excluded.email;
create or replace function public.touch_document() returns trigger language plpgsql set search_path='' as $$begin new.updated_at=now();return new;end;$$;
drop trigger if exists documents_touch on public.documents;
create trigger documents_touch before update on public.documents for each row execute function public.touch_document();
alter table public.profiles enable row level security;
alter table public.documents enable row level security;
alter table public.document_shares enable row level security;
drop policy if exists profiles_self on public.profiles;
create policy profiles_self on public.profiles for select to authenticated using(id=(select auth.uid()));
drop policy if exists docs_read on public.documents;
create policy docs_read on public.documents for select to authenticated using(owner_id=(select auth.uid()) or exists(select 1 from public.document_shares s where s.document_id=id and s.user_id=(select auth.uid())));
drop policy if exists docs_insert on public.documents;
create policy docs_insert on public.documents for insert to authenticated with check(owner_id=(select auth.uid()));
drop policy if exists docs_update on public.documents;
create policy docs_update on public.documents for update to authenticated using(owner_id=(select auth.uid())) with check(owner_id=(select auth.uid()));
drop policy if exists docs_delete on public.documents;
create policy docs_delete on public.documents for delete to authenticated using(owner_id=(select auth.uid()));
drop policy if exists shares_read on public.document_shares;
create policy shares_read on public.document_shares for select to authenticated using(user_id=(select auth.uid()));
-- No direct share writes; the security-definer RPC verifies ownership.
create or replace function public.share_document_by_email(p_document_id uuid,p_email text)
returns void language plpgsql security definer set search_path='' as $$
declare target_id uuid;
begin
 if (select auth.uid()) is null then raise exception 'Authentication required';end if;
 if not exists(select 1 from public.documents where id=p_document_id and owner_id=(select auth.uid())) then raise exception 'Only the owner can share this document';end if;
 select id into target_id from public.profiles where email=lower(trim(p_email));
 if target_id is null then raise exception 'No registered user found with this email';end if;
 if target_id=(select auth.uid()) then raise exception 'You already own this document';end if;
 insert into public.document_shares(document_id,user_id,permission) values(p_document_id,target_id,'viewer') on conflict(document_id,user_id) do nothing;
end;$$;
revoke all on function public.share_document_by_email(uuid,text) from public;
grant execute on function public.share_document_by_email(uuid,text) to authenticated;
