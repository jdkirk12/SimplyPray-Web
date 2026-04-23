# Shared Lists — Manual UAT Script

**Created:** 2026-04-21
**Status:** Script written; not yet executed end-to-end against staging.

Supabase project: `SimplyPray` (`wkptusgzngfzoucocije`).

## Pre-reqs
- At least one church row with `default_list_write_mode='admin_only'` and at least one `church_members` row with `role='admin'` and `status='active'`.
- Two user accounts: an admin and a non-admin member of that church.

## Steps

1. **Create draft.** Admin browses `/dashboard/shared-lists/new`, creates "Weekly Prayer" with description + cadence "Weekly", `admin_only`. Expect redirect to `/dashboard/shared-lists/<id>` showing pill `draft`.
   - Verify SQL: `select status, write_mode from shared_lists where name='Weekly Prayer';` → `draft, admin_only`.

2. **Publish.** Click Publish. Expect status flips to `published`, `published_at` set.
   - Verify SQL: `select status, published_at from shared_lists where name='Weekly Prayer';`.
   - Verify subscribers: `select count(*) from list_subscriptions where list_id=(select id from shared_lists where name='Weekly Prayer');` → equals count of active `church_members` in this church.

3. **Non-admin sees it (SQL proxy).** Using the non-admin user's JWT (Supabase dashboard → API → impersonate), run `select id,name from shared_lists where church_id='<id>';` → should return the published list row.

4. **Flip to member_submit.** Edit the list, choose "Members can submit". Save.
   - SQL: `update auth trick omitted; insert member submission directly as the non-admin user (via impersonation):` `insert into shared_requests (list_id,title,submitted_by,status) values ('<list-id>','Pray for Mike','<non-admin-uid>','pending');`
   - Admin visits `/dashboard/shared-lists/<id>/requests?tab=pending`. Expect one row. Click Approve.
   - Verify SQL: row status=`active`, `moderated_by`=admin UID.

5. **Mark answered.** Admin switches to Active tab, clicks Mark answered. Verify row `status='answered'`, `answered_at` set.

6. **Public page flag.** Admin toggles the list's `public_page=on` and in Settings enables `public_lists_enabled`. Open `/church/<slug>/shared` in incognito. Expect the list + active/answered requests to render.

7. **Disable public.** Toggle `public_lists_enabled` off. Incognito reload → 404.

8. **Archive.** Admin chooses Archive. Published tab no longer shows it; Archived tab does. Subscriptions remain.

9. **Delete.** Admin clicks Delete in Danger zone. Expect redirect to `/dashboard/shared-lists`. SQL: the `shared_lists`, its `shared_requests`, and `list_subscriptions` are gone (cascaded).

10. **Privacy — `list_subscriptions` leakage.** As a non-admin user JWT, `select * from list_subscriptions where list_id='<another-members-list-id>';` should return only rows where `user_id = auth.uid()`. The `get_shared_list_stats(p_list_id)` RPC should still return aggregate subscriber counts.

## Run log

_Not yet executed end-to-end. Run with a real church + two test users and update this section with pass/fail per step._
