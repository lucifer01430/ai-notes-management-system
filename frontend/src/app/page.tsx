"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, FileText, Search, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { NoteCard } from "@/components/notes/note-card";
import { Button, buttonClasses } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NoteGridSkeleton } from "@/components/ui/skeleton";
import { helpContent } from "@/lib/help-content";
import { formatDate } from "@/lib/utils";
import { useNoteActions, useNotes } from "@/hooks/use-notes";

export default function DashboardPage() {
  const { notes, stats, isLoading, error, refresh } = useNotes();
  const { pendingId, summarize } = useNoteActions(refresh);
  const recentNotes = notes.slice(0, 3);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Dashboard"
        title="Your AI-powered note workspace"
        description="Capture ideas, generate summaries, and retrieve knowledge semantically from a clean command center."
        help={helpContent.dashboard}
        actions={
          <>
            <Link href="/search" className={buttonClasses("secondary")}>
              <Search className="h-4 w-4" />
              Semantic Search
            </Link>
            <Link href="/notes/create" className={buttonClasses("primary")}>
              <FileText className="h-4 w-4" />
              New Note
            </Link>
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Dashboard statistics">
        <StatCard icon={BookOpen} label="Total notes" value={stats.total.toString()} />
        <StatCard icon={Sparkles} label="Summarized" value={stats.summarized.toString()} />
        <StatCard icon={FileText} label="Unsummarized" value={stats.unsummarized.toString()} />
        <StatCard icon={ArrowRight} label="Words captured" value={stats.words.toLocaleString()} />
      </section>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_360px]">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-950 dark:text-white">Recent notes</h2>
            <Link href="/notes" className="text-sm font-medium text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white">
              View all
            </Link>
          </div>
          {isLoading ? <NoteGridSkeleton /> : null}
          {error ? <ErrorState message={error} onRetry={refresh} /> : null}
          {!isLoading && !error && recentNotes.length === 0 ? <EmptyState /> : null}
          {!isLoading && !error && recentNotes.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {recentNotes.map((note) => (
                <NoteCard key={note.id} note={note} isPending={pendingId === note.id} onSummarize={summarize} />
              ))}
            </div>
          ) : null}
        </section>

        <Card className="self-start">
          <CardContent>
            <h2 className="text-lg font-semibold text-zinc-950 dark:text-white">Workspace health</h2>
            <div className="mt-5 space-y-4">
              <HealthRow label="Summary coverage" value={stats.total ? `${Math.round((stats.summarized / stats.total) * 100)}%` : "0%"} />
              <HealthRow label="Last updated" value={stats.lastUpdated ? formatDate(stats.lastUpdated) : "No notes yet"} />
              <HealthRow label="Search readiness" value={stats.total ? "Ready" : "Add a note"} />
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <Card>
      <CardContent>
        <Icon className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
        <p className="mt-5 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">{value}</p>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
      </CardContent>
    </Card>
  );
}

function HealthRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-zinc-50 px-3 py-2 dark:bg-zinc-900">
      <span className="text-sm text-zinc-500 dark:text-zinc-400">{label}</span>
      <span className="text-sm font-medium text-zinc-950 dark:text-white">{value}</span>
    </div>
  );
}

function EmptyState() {
  return (
    <Card>
      <CardContent className="text-center">
        <p className="font-medium text-zinc-950 dark:text-white">No notes yet</p>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Create your first note to start building your knowledge base.</p>
        <Link href="/notes/create" className={buttonClasses("primary", "mt-5")}>Create note</Link>
      </CardContent>
    </Card>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Card>
      <CardContent className="text-center">
        <p className="font-medium text-zinc-950 dark:text-white">{message}</p>
        <Button className="mt-5" variant="secondary" onClick={onRetry}>Retry</Button>
      </CardContent>
    </Card>
  );
}
