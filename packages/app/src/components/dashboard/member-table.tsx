"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type MemberStatus = "active" | "inactive" | "deactivated";
type TabFilter = "all" | MemberStatus;

interface Member {
  id: string;
  user_id: string;
  role: string;
  status: MemberStatus;
  joined_at: string;
  last_seen_at: string | null;
  deactivated_at: string | null;
  deactivated_by: string | null;
  email: string;
  full_name: string | null;
}

interface MemberTableProps {
  churchId: string;
  initialMembers: Member[];
}

const PAGE_SIZE = 25;

function relativeTime(dateString: string | null): string {
  if (!dateString) return "Never";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 30) {
    const diffMonths = Math.floor(diffDays / 30);
    return `${diffMonths} month${diffMonths === 1 ? "" : "s"} ago`;
  }
  if (diffDays > 0) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  if (diffHours > 0)
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  if (diffMins > 0)
    return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
  return "Just now";
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const statusStyles: Record<MemberStatus, string> = {
  active: "bg-primary-50 text-primary-600",
  inactive: "bg-neutral-100 text-neutral-500",
  deactivated: "bg-red-50 text-red-600",
};

export function MemberTable({ churchId, initialMembers }: MemberTableProps) {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [tab, setTab] = useState<TabFilter>("all");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const supabase = useMemo(() => createClient(), []);

  // Subscribe to real-time updates on church_members
  useEffect(() => {
    const channel = supabase
      .channel("church-members-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "church_members",
          filter: `church_id=eq.${churchId}`,
        },
        () => {
          // Refetch members on any change
          fetchMembers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [churchId]);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc("get_church_members_with_email", {
        target_church_id: churchId,
      });

      if (!error && data) {
        setMembers(data as Member[]);
      }
    } finally {
      setLoading(false);
    }
  }, [supabase, churchId]);

  // Filter members
  const filteredMembers = useMemo(() => {
    let result = members;

    // Tab filter
    if (tab !== "all") {
      result = result.filter((m) => m.status === tab);
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.email.toLowerCase().includes(q) ||
          (m.full_name && m.full_name.toLowerCase().includes(q))
      );
    }

    return result;
  }, [members, tab, search]);

  const visibleMembers = filteredMembers.slice(0, visibleCount);
  const hasMore = visibleCount < filteredMembers.length;

  async function handleDeactivate(memberId: string) {
    setActionLoading(memberId);
    setOpenDropdown(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase
      .from("church_members")
      .update({
        status: "deactivated",
        deactivated_at: new Date().toISOString(),
        deactivated_by: user?.id ?? null,
      })
      .eq("id", memberId);

    // Optimistic update
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? {
              ...m,
              status: "deactivated" as MemberStatus,
              deactivated_at: new Date().toISOString(),
            }
          : m
      )
    );
    setActionLoading(null);
  }

  async function handleReactivate(memberId: string) {
    setActionLoading(memberId);
    setOpenDropdown(null);

    await supabase
      .from("church_members")
      .update({
        status: "active",
        deactivated_at: null,
        deactivated_by: null,
      })
      .eq("id", memberId);

    // Optimistic update
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? {
              ...m,
              status: "active" as MemberStatus,
              deactivated_at: null,
            }
          : m
      )
    );
    setActionLoading(null);
  }

  function exportCSV() {
    const headers = ["Email", "Name", "Role", "Status", "Joined", "Last Active"];
    const rows = filteredMembers.map((m) => [
      m.email,
      m.full_name ?? "",
      m.role,
      m.status,
      formatDate(m.joined_at),
      m.last_seen_at ? relativeTime(m.last_seen_at) : "Never",
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `members-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const tabs: { label: string; value: TabFilter; count: number }[] = [
    { label: "All", value: "all", count: members.length },
    {
      label: "Active",
      value: "active",
      count: members.filter((m) => m.status === "active").length,
    },
    {
      label: "Inactive",
      value: "inactive",
      count: members.filter((m) => m.status === "inactive").length,
    },
    {
      label: "Deactivated",
      value: "deactivated",
      count: members.filter((m) => m.status === "deactivated").length,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Tabs and controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 rounded-xl bg-neutral-100 p-1">
          {tabs.map((t) => (
            <button
              key={t.value}
              onClick={() => {
                setTab(t.value);
                setVisibleCount(PAGE_SIZE);
              }}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                tab === t.value
                  ? "bg-white text-neutral-800 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              {t.label}{" "}
              <span className="text-xs text-neutral-400">{t.count}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="w-64">
            <Input
              placeholder="Search by email or name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
            />
          </div>
          <Button variant="outline" size="sm" onClick={exportCSV}>
            Export CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                <th className="px-4 py-3 font-medium text-neutral-500">
                  Email
                </th>
                <th className="px-4 py-3 font-medium text-neutral-500">
                  Role
                </th>
                <th className="px-4 py-3 font-medium text-neutral-500">
                  Status
                </th>
                <th className="px-4 py-3 font-medium text-neutral-500">
                  Joined
                </th>
                <th className="px-4 py-3 font-medium text-neutral-500">
                  Last Active
                </th>
                <th className="px-4 py-3 font-medium text-neutral-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && members.length === 0 ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-neutral-50">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 w-24 animate-pulse rounded bg-neutral-200" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : visibleMembers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-neutral-400"
                  >
                    {search
                      ? "No members match your search."
                      : "No members found."}
                  </td>
                </tr>
              ) : (
                visibleMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="border-b border-neutral-50 transition-colors hover:bg-neutral-50/50"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-neutral-800">
                          {member.email}
                        </p>
                        {member.full_name && (
                          <p className="text-xs text-neutral-400">
                            {member.full_name}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 capitalize text-neutral-600">
                      {member.role}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles[member.status]}`}
                      >
                        {member.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-neutral-500">
                      {formatDate(member.joined_at)}
                    </td>
                    <td className="px-4 py-3 text-neutral-500">
                      {relativeTime(member.last_seen_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative">
                        <button
                          onClick={() =>
                            setOpenDropdown(
                              openDropdown === member.id ? null : member.id
                            )
                          }
                          disabled={actionLoading === member.id}
                          className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 disabled:opacity-50"
                        >
                          {actionLoading === member.id ? (
                            <svg
                              className="h-4 w-4 animate-spin"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                              />
                            </svg>
                          )}
                        </button>

                        {openDropdown === member.id && (
                          <>
                            {/* Backdrop to close dropdown */}
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setOpenDropdown(null)}
                            />
                            <div className="absolute right-0 z-20 mt-1 w-40 rounded-xl border border-neutral-200 bg-white py-1 shadow-card">
                              {member.status === "active" ||
                              member.status === "inactive" ? (
                                <button
                                  onClick={() => handleDeactivate(member.id)}
                                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                >
                                  Deactivate
                                </button>
                              ) : member.status === "deactivated" ? (
                                <button
                                  onClick={() => handleReactivate(member.id)}
                                  className="w-full px-3 py-2 text-left text-sm text-primary-600 hover:bg-primary-50"
                                >
                                  Reactivate
                                </button>
                              ) : null}
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Load more */}
        {hasMore && (
          <div className="border-t border-neutral-100 px-4 py-3 text-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
              className="text-sm font-medium text-primary-500 hover:text-primary-600"
            >
              Load more ({filteredMembers.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}
