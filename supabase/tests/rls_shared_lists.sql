-- Shared Lists RLS regression assertions.
-- Run manually via Supabase MCP `execute_sql` (service role). Use `set local role`
-- + `set local "request.jwt.claims"` to impersonate each user.
--
-- Template for each case:
--
-- begin;
--   set local role authenticated;
--   set local "request.jwt.claims" to '{"sub":"<user-uuid>","role":"authenticated"}';
--   -- assertion SQL here
-- rollback;

-- Case 1: outsider cannot see a church's draft lists
-- Substitute UUIDs for <outsider-uid> and <church-uid>.
begin;
  set local role authenticated;
  set local "request.jwt.claims" to '{"sub":"<outsider-uid>","role":"authenticated"}';
  select count(*) as should_be_zero
  from public.shared_lists
  where church_id = '<church-uid>';
rollback;

-- Case 2: active member of the church sees published church lists
begin;
  set local role authenticated;
  set local "request.jwt.claims" to '{"sub":"<member-uid>","role":"authenticated"}';
  select count(*) as published_visible
  from public.shared_lists
  where church_id = '<church-uid>' and status = 'published';
rollback;

-- Case 3: admin can insert a church-scope shared_list
begin;
  set local role authenticated;
  set local "request.jwt.claims" to '{"sub":"<admin-uid>","role":"authenticated"}';
  insert into public.shared_lists (scope, church_id, name, created_by)
  values ('church', '<church-uid>', 'RLS test insert', '<admin-uid>')
  returning id;
rollback;

-- Case 4: non-admin member_submit insert allowed only when subscribed
begin;
  set local role authenticated;
  set local "request.jwt.claims" to '{"sub":"<subscriber-uid>","role":"authenticated"}';
  insert into public.shared_requests (list_id, title, submitted_by, status)
  values ('<member-submit-list-id>', 'Member submitted', '<subscriber-uid>', 'pending')
  returning id, status;
rollback;

-- Case 5: list_subscriptions leakage — another user's rows must not be visible
begin;
  set local role authenticated;
  set local "request.jwt.claims" to '{"sub":"<user-a-uid>","role":"authenticated"}';
  select count(*) as should_only_match_self
  from public.list_subscriptions
  where user_id <> '<user-a-uid>';
  -- Expected: 0.
rollback;

-- Case 6: anon only sees public_page=true, status=published
begin;
  set local role anon;
  select count(*) as public_rows
  from public.shared_lists
  where church_id = '<church-uid>';
  -- Expected: count of rows where (public_page=true and status='published').
rollback;

-- -----------------------------------------------------------------
-- Run log: not yet executed against the deployed database. Capture
-- results below once UAT is run with real UUIDs.
-- -----------------------------------------------------------------
