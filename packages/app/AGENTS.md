<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Shared Lists data layer

- All shared-list reads/writes go through `src/lib/shared-lists/` modules.
- Subscriber counts come exclusively from the `get_shared_list_stats` RPC — never query `list_subscriptions` directly from the UI; that table's RLS is per-user.
- Publishing a list must go through the `publish_list` RPC so the status change and subscription backfill stay atomic.
- New migrations live in `supabase/migrations/YYYYMMDDHHMM_*.sql` and are applied via the Supabase MCP `apply_migration` tool. The file and the remote state must stay in sync.
