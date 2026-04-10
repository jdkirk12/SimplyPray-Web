import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/dashboard/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check if user is an admin or owner of any church
  const { data: membership, error: membershipError } = await supabase
    .from("church_members")
    .select("id, church_id, role, status")
    .eq("user_id", user.id)
    .in("role", ["owner", "admin"])
    .eq("status", "active")
    .limit(1)
    .single();

  if (membershipError || !membership) {
    redirect("/login?error=unauthorized");
  }

  // Fetch the church data
  const { data: church, error: churchError } = await supabase
    .from("churches")
    .select(
      "id, name, slug, logo_url, primary_color, landing_page_message, max_seats, subscription_status"
    )
    .eq("id", membership.church_id)
    .single();

  if (churchError || !church) {
    redirect("/login?error=no-church");
  }

  return (
    <div className="flex h-screen bg-neutral-50">
      <Sidebar church={church} />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
