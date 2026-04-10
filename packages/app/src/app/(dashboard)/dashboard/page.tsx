import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { StatsPanel } from "@/components/dashboard/stats-panel";
import { Card } from "@/components/ui/card";

export default async function DashboardPage() {
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

  // Fetch church data
  const { data: church } = await supabase
    .from("churches")
    .select("id, name, slug, max_seats")
    .eq("id", membership.church_id)
    .single();

  if (!church) {
    redirect("/login?error=no-church");
  }

  // Fetch member counts by status
  const { count: activeCount } = await supabase
    .from("church_members")
    .select("*", { count: "exact", head: true })
    .eq("church_id", church.id)
    .eq("status", "active");

  const { count: inactiveCount } = await supabase
    .from("church_members")
    .select("*", { count: "exact", head: true })
    .eq("church_id", church.id)
    .eq("status", "inactive");

  const { count: deactivatedCount } = await supabase
    .from("church_members")
    .select("*", { count: "exact", head: true })
    .eq("church_id", church.id)
    .eq("status", "deactivated");

  const counts = {
    active: activeCount ?? 0,
    inactive: inactiveCount ?? 0,
    deactivated: deactivatedCount ?? 0,
    total: (activeCount ?? 0) + (inactiveCount ?? 0) + (deactivatedCount ?? 0),
  };

  const quickActions = [
    {
      title: "View Members",
      description: "Manage your church members, roles, and access",
      href: "/dashboard/members",
      icon: (
        <svg
          className="h-6 w-6 text-primary-500"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
          />
        </svg>
      ),
    },
    {
      title: "Church Settings",
      description: "Update your church profile and landing page",
      href: "/dashboard/settings",
      icon: (
        <svg
          className="h-6 w-6 text-primary-500"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      title: "Manage Billing",
      description: "View subscription, invoices, and payment details",
      href: "/dashboard/billing",
      icon: (
        <svg
          className="h-6 w-6 text-primary-500"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <StatsPanel church={church} counts={counts} />

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-neutral-700">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card hover className="h-full">
                <div className="flex items-start gap-3">
                  {action.icon}
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-800">
                      {action.title}
                    </h3>
                    <p className="mt-1 text-xs text-neutral-500">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
