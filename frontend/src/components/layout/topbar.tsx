import Link from "next/link";
import { FilePlus2, Search } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function Topbar() {
  return (
    <div className="hidden h-16 items-center justify-between border-b border-zinc-200 bg-white/75 px-8 backdrop-blur-xl xl:flex dark:border-zinc-800 dark:bg-zinc-950/75">
      <div>
        <p className="text-sm font-medium text-zinc-950 dark:text-white">Workspace</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Manage notes, summaries, and semantic retrieval.</p>
      </div>
      <div className="flex items-center gap-2">
        <Link href="/search" className={buttonClasses("secondary")}>
          <Search className="h-4 w-4" />
          Search
        </Link>
        <Link href="/notes/create" className={buttonClasses("primary")}>
          <FilePlus2 className="h-4 w-4" />
          New note
        </Link>
        <ThemeToggle />
      </div>
    </div>
  );
}
