"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { NoteForm } from "@/components/notes/note-form";
import { getApiErrorMessage } from "@/lib/api";
import { helpContent } from "@/lib/help-content";
import type { NoteFormValues } from "@/lib/schemas";
import { useNoteActions } from "@/hooks/use-notes";
import { useState } from "react";

export default function CreateNotePage() {
  const router = useRouter();
  const { save } = useNoteActions();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(values: NoteFormValues) {
    setIsSubmitting(true);
    try {
      const note = await save(values);
      toast.success("Note created", { description: note.title });
      router.push(`/notes/${note.id}`);
    } catch (caught) {
      toast.error("Create failed", { description: getApiErrorMessage(caught) });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Create Note"
        title="Capture something worth remembering"
        description="Write clearly now, then let Gemini summarize and retrieve it later."
        help={helpContent.create}
      />
      <NoteForm isSubmitting={isSubmitting} onSubmit={handleSubmit} />
    </AppShell>
  );
}
