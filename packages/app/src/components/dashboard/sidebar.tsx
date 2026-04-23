"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Church {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  primary_color: string | null;
  subscription_status: string | null;
}

interface SidebarProps {
  church: Church;
  user?: { name?: string | null; email?: string | null; role?: string | null };
}

type NavItem = { label: string; href: string; icon: React.ReactNode };
type NavSection = { heading: string; items: NavItem[] };

const iconCls = "h-[18px] w-[18px]";

const sections: NavSection[] = [
  {
    heading: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: (
          <svg className={iconCls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
          </svg>
        ),
      },
      {
        label: "Shared Lists",
        href: "/dashboard/shared-lists",
        icon: (
          <svg className={iconCls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        ),
      },
    ],
  },
  {
    heading: "Congregation",
    items: [
      {
        label: "Members",
        href: "/dashboard/members",
        icon: (
          <svg className={iconCls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
        ),
      },
    ],
  },
  {
    heading: "Account",
    items: [
      {
        label: "Settings",
        href: "/dashboard/settings",
        icon: (
          <svg className={iconCls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
      },
      {
        label: "Billing",
        href: "/dashboard/billing",
        icon: (
          <svg className={iconCls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
          </svg>
        ),
      },
    ],
  },
];

export function Sidebar({ church, user }: SidebarProps) {
  const pathname = usePathname();
  const initial = (user?.name ?? user?.email ?? "?").charAt(0).toUpperCase();

  return (
    <aside className="flex w-64 flex-col border-r border-sanctuary-hairline bg-white">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sanctuary-hairline">
        <span className="inline-block h-[10px] w-[10px] rounded-full bg-primary-600" />
        <div className="min-w-0">
          <p className="font-serif text-xl leading-tight text-ink">SimplyPray</p>
          <p className="truncate text-[11px] uppercase tracking-[0.08em] text-ink-soft">
            {church.name}
          </p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-5">
        {sections.map((sec) => (
          <div key={sec.heading}>
            <p className="px-3 mb-2 text-[10px] font-medium uppercase tracking-[0.12em] text-ink-soft">
              {sec.heading}
            </p>
            <ul className="space-y-1">
              {sec.items.map((item) => {
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 rounded-pill px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                        isActive
                          ? "bg-primary-600 text-sanctuary-bg"
                          : "text-ink-mid hover:bg-sanctuary-pale hover:text-primary-600"
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="flex items-center gap-3 border-t border-sanctuary-hairline px-4 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 font-serif text-primary-700">
          {initial}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink">
            {user?.name ?? user?.email ?? "You"}
          </p>
          <p className="truncate text-[11px] uppercase tracking-[0.08em] text-ink-soft">
            {user?.role ?? "Member"}
          </p>
        </div>
      </div>
    </aside>
  );
}
