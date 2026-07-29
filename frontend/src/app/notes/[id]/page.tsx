"use client";

import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Edit3, Sparkles, Trash2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { DeleteDialog } from "@/components/notes/delete-dialog";
import { SummaryCard } from "@/components/notes/summary-card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonClasses } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getApiErrorMessage, notesApi } from "@/lib/api";
import { formatDate, readingTime } from "@/lib/utils";
import type { Note } from "@/types/note";

export default function ViewNotePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Note | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      setNote(await notesApi.get(params.id));
    } catch {
      notFound();
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    void load();
  }, [load]);

  async function summarize() {
    if (!note) return;
    setIsSummarizing(true);
    try {
      const updated = await notesApi.summarize(note.id);
      setNote(updated);
      toast.success("Summary generated");
    } catch (caught) {
      toast.error("Summary failed", { description: getApiErrorMessage(caught) });
    } finally {
      setIsSummarizing(false);
    }
  }

  async function remove() {
    if (!note) return;
    setIsDeleting(true);
    try {
      await notesApi.remove(note.id);
      toast.success("Note deleted");
      router.push("/notes");
    } catch (caught) {
      toast.error("Delete failed", { description: getApiErrorMessage(caught) });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AppShell>
      <Link href="/notes" className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white">
        <ArrowLeft className="h-4 w-4" />
        Back to notes
      </Link>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-72 w-full" />
        </div>
      ) : null}

      {!isLoading && note ? (
        <>
          <PageHeader
            eyebrow={`Updated ${formatDate(note.updated_at)}`}
            title={note.title}
            description={`${readingTime(note.content)} min read`}
            actions={
              <>
                <Link href={`/notes/${note.id}/edit`} className={buttonClasses("secondary")}>
                  <Edit3 className="h-4 w-4" />
                  Edit
                </Link>
                <Button variant="secondary" isLoading={isSummarizing} onClick={summarize}>
                  <Sparkles className="h-4 w-4" />
                  Generate Summary
                </Button>
                <Button variant="ghost" className="text-red-600" onClick={() => setDeleteTarget(note)}>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </>
            }
          />

          <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
            <Card>
              <CardContent>
                <div className="mb-5 flex flex-wrap gap-2">
                  <Badge>Created {formatDate(note.created_at)}</Badge>
                  <Badge>{note.summary ? "Summarized" : "Awaiting summary"}</Badge>
                </div>
                <div className="whitespace-pre-wrap text-base leading-8 text-zinc-700 dark:text-zinc-300">{note.content}</div>
              </CardContent>
            </Card>
            <SummaryCard summary={note.summary} />
          </div>

          <DeleteDialog note={deleteTarget} isDeleting={isDeleting} onClose={() => setDeleteTarget(null)} onConfirm={remove} />
        </>
      ) : null}
    </AppShell>
  );
}
