import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ChurchSignupForm } from "./signup-form";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: church } = await supabase
    .from("churches")
    .select("name")
    .eq("slug", slug)
    .single();

  if (!church) {
    return { title: "Church not found" };
  }

  return {
    title: `Join ${church.name} on SimplyPray`,
    description: `Sign up to pray with ${church.name} using SimplyPray.`,
  };
}

export default async function ChurchLandingPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: church } = await supabase
    .from("churches")
    .select(
      "id, name, slug, logo_url, primary_color, landing_page_message, max_seats, subscription_status"
    )
    .eq("slug", slug)
    .single();

  if (!church) {
    notFound();
  }

  // Check subscription status
  if (church.subscription_status !== "active") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-neutral-800 mb-3">
            Subscription Inactive
          </h1>
          <p className="text-neutral-500">
            This church&apos;s subscription is not currently active. Please
            contact your church administrator for more information.
          </p>
        </div>
      </main>
    );
  }

  // Check seat availability
  const { count } = await supabase
    .from("church_members")
    .select("*", { count: "exact", head: true })
    .eq("church_id", church.id)
    .eq("status", "active");

  const seatsAvailable =
    count === null || count < church.max_seats;

  const accentColor = church.primary_color || "#3A6F63";

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Accent bar */}
      <div className="h-1.5 w-full" style={{ backgroundColor: accentColor }} />

      <div className="flex items-center justify-center px-4 py-12 sm:py-20">
        <div className="w-full max-w-lg flex flex-col items-center gap-8">
          {/* Church branding */}
          <div className="flex flex-col items-center gap-4">
            {church.logo_url ? (
              <img
                src={church.logo_url}
                alt={`${church.name} logo`}
                className="w-24 h-24 rounded-2xl object-contain"
              />
            ) : (
              <div
                className="w-24 h-24 rounded-2xl flex items-center justify-center text-white text-3xl font-bold"
                style={{ backgroundColor: accentColor }}
              >
                {church.name
                  .split(" ")
                  .map((w: string) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            )}

            <div className="text-center">
              <h1
                className="text-3xl font-bold tracking-tight"
                style={{ color: accentColor }}
              >
                {church.name}
              </h1>
              <p className="mt-1 text-sm text-neutral-400">
                powered by{" "}
                <span className="font-medium text-primary-500">SimplyPray</span>
              </p>
            </div>
          </div>

          {/* Landing page message */}
          {church.landing_page_message && (
            <div
              className="w-full rounded-2xl border p-6 text-center"
              style={{ borderColor: accentColor + "40" }}
            >
              <p className="text-neutral-600 leading-relaxed">
                {church.landing_page_message}
              </p>
            </div>
          )}

          {/* Signup card */}
          <div className="w-full bg-white rounded-card p-8 shadow-card">
            {seatsAvailable ? (
              <ChurchSignupForm
                churchId={church.id}
                churchName={church.name}
                accentColor={accentColor}
              />
            ) : (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-7 h-7 text-neutral-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-neutral-800 mb-2">
                  At Capacity
                </h2>
                <p className="text-neutral-500 text-sm">
                  This church is currently at capacity. Please contact your
                  church administrator for assistance.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <p className="text-xs text-neutral-400 text-center">
            SimplyPray &mdash; Devotional prayer, made simple
          </p>
        </div>
      </div>
    </main>
  );
}
