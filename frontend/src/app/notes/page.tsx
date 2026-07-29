"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FilePlus2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { DeleteDialog } from "@/components/notes/delete-dialog";
import { NoteCard } from "@/components/notes/note-card";
import { SearchBar } from "@/components/search/search-bar";
import { Button, buttonClasses } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { NoteGridSkeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import { useNoteActions, useNotes } from "@/hooks/use-notes";
import { helpContent } from "@/lib/help-content";
import { getSearchTerms, noteMatchesSearch } from "@/lib/note-search";
import type { Note } from "@/types/note";

const PAGE_SIZE = 6;

export default function NotesPage() {
  const { notes, isLoading, error, refresh } = useNotes();
  const { pendingId, remove, summarize } = useNoteActions(refresh);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Note | null>(null);
  const debouncedQuery = useDebounce(query, 300);
  const searchTerms = useMemo(() => getSearchTerms(debouncedQuery), [debouncedQuery]);

  const filtered = useMemo(() => {
    return notes.filter((note) => noteMatchesSearch(note, searchTerms));
  }, [notes, searchTerms]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <AppShell>
      <PageHeader
        eyebrow="All Notes"
        title="Browse your knowledge base"
        description="Filter, edit, summarize, and manage every note in one responsive workspace."
        help={helpContent.notes}
        actions={
          <Link href="/notes/create" className={buttonClasses("primary")}>
            <FilePlus2 className="h-4 w-4" />
            Create Note
          </Link>
        }
      />

      <div className="mb-5">
        <SearchBar value={query} onChange={(value) => { setQuery(value); setPage(1); }} placeholder="Live search titles, content, and summaries..." />
      </div>

      {isLoading ? <NoteGridSkeleton /> : null}
      {error ? <ErrorState message={error} onRetry={refresh} /> : null}
      {!isLoading && !error && filtered.length === 0 ? <EmptyState hasQuery={Boolean(query)} /> : null}
      {!isLoading && !error && filtered.length > 0 ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                isPending={pendingId === note.id}
                onDelete={setDeleteTarget}
                onSummarize={summarize}
                searchTerms={searchTerms}
              />
            ))}
          </div>
          <div className="mt-6">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </>
      ) : null}

      <DeleteDialog
        note={deleteTarget}
        isDeleting={pendingId === deleteTarget?.id}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async (note) => {
          await remove(note);
          setDeleteTarget(null);
        }}
      />
    </AppShell>
  );
}

function EmptyState({ hasQuery }: { hasQuery: boolean }) {
  return (
    <Card>
      <CardContent className="text-center">
        <p className="font-medium text-zinc-950 dark:text-white">{hasQuery ? "No matching notes" : "No notes yet"}</p>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          {hasQuery ? "Try a different keyword or use semantic search for natural language retrieval." : "Create a note to begin."}
        </p>
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
