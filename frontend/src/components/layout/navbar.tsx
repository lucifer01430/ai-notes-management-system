"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FilePlus2, Library, Menu, Search, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const items = [
  { href: "/notes", label: "Notes", icon: Library },
  { href: "/notes/create", label: "Create", icon: FilePlus2 },
  { href: "/search", label: "Search", icon: Search },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/85 backdrop-blur-xl xl:hidden dark:border-zinc-800 dark:bg-zinc-950/85">
      <div className="flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-zinc-950 dark:text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
            <Sparkles className="h-4 w-4" />
          </span>
          AI Notes
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="secondary" className="h-10 w-10 px-0" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation menu">
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      {open ? (
        <nav className="space-y-1 border-t border-zinc-200 px-4 py-3 dark:border-zinc-800" aria-label="Mobile navigation">
          {items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300",
                  active && "bg-zinc-100 text-zinc-950 dark:bg-zinc-900 dark:text-white",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      ) : null}
    </header>
  );
}
