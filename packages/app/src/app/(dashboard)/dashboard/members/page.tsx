import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MemberTable } from "@/components/dashboard/member-table";

export default async function MembersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get admin membership
  const { data: membership } = await supabase
    .from("church_members")
    .select("church_id")
    .eq("user_id", user.id)
    .in("role", ["owner", "admin"])
    .eq("status", "active")
    .limit(1)
    .single();

  if (!membership) {
    redirect("/login?error=unauthorized");
  }

  // Fetch members with email from auth.users via RPC
  // Falls back to direct query if RPC not available
  let members;

  const { data: rpcData, error: rpcError } = await supabase.rpc(
    "get_church_members_with_email",
    { target_church_id: membership.church_id }
  );

  if (!rpcError && rpcData) {
    members = rpcData;
  } else {
    // Fallback: fetch members without email join (email will be empty)
    const { data: fallbackData } = await supabase
      .from("church_members")
      .select("id, user_id, role, status, joined_at, last_seen_at, deactivated_at, deactivated_by")
      .eq("church_id", membership.church_id)
      .order("joined_at", { ascending: false });

    members = (fallbackData ?? []).map((m) => ({
      ...m,
      email: "",
      full_name: null,
    }));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-800">Members</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Manage your church members, roles, and access
        </p>
      </div>

      <MemberTable
        churchId={membership.church_id}
        initialMembers={(members ?? []) as Parameters<typeof MemberTable>[0]["initialMembers"]}
      />
    </div>
  );
}
