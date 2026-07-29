"use client";

import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { NoteForm } from "@/components/notes/note-form";
import { Skeleton } from "@/components/ui/skeleton";
import { getApiErrorMessage, notesApi } from "@/lib/api";
import type { NoteFormValues } from "@/lib/schemas";
import type { Note } from "@/types/note";

export default function EditNotePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  async function handleSubmit(values: NoteFormValues) {
    setIsSubmitting(true);
    try {
      const updated = await notesApi.update(params.id, values);
      toast.success("Note updated", { description: updated.title });
      router.push(`/notes/${updated.id}`);
    } catch (caught) {
      toast.error("Update failed", { description: getApiErrorMessage(caught) });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AppShell>
      <Link href={`/notes/${params.id}`} className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white">
        <ArrowLeft className="h-4 w-4" />
        Back to note
      </Link>
      <PageHeader eyebrow="Edit Note" title="Refine your note" description="Update the source content. Generate a fresh summary from the detail page when needed." />
      {isLoading ? <Skeleton className="h-96 w-full" /> : null}
      {!isLoading && note ? <NoteForm note={note} isSubmitting={isSubmitting} onSubmit={handleSubmit} /> : null}
    </AppShell>
  );
}
