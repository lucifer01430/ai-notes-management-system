"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, FilePlus2, Library, Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Dashboard", icon: BarChart3 },
  { href: "/notes", label: "All Notes", icon: Library },
  { href: "/notes/create", label: "Create Note", icon: FilePlus2 },
  { href: "/search", label: "Semantic Search", icon: Search },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 shrink-0 border-r border-zinc-200 bg-white/80 px-4 py-5 backdrop-blur xl:block dark:border-zinc-800 dark:bg-zinc-950/80">
      <Link href="/" className="flex items-center gap-3 rounded-2xl px-2 py-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
          <Sparkles className="h-5 w-5" />
        </span>
        <span>
          <span className="block text-sm font-semibold text-zinc-950 dark:text-white">AI Notes</span>
          <span className="block text-xs text-zinc-500 dark:text-zinc-400">Knowledge workspace</span>
        </span>
      </Link>

      <nav className="mt-8 space-y-1" aria-label="Primary navigation">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white",
                active && "bg-zinc-950 text-white hover:bg-zinc-950 hover:text-white dark:bg-white dark:text-zinc-950 dark:hover:bg-white dark:hover:text-zinc-950",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm font-medium text-zinc-950 dark:text-white">Gemini powered</p>
        <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          Generate concise summaries and search by meaning across your notes.
        </p>
      </div>
    </aside>
  );
}
