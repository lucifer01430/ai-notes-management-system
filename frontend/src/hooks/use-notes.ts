"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { getApiErrorMessage, notesApi } from "@/lib/api";
import type { Note, NotePayload } from "@/types/note";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await notesApi.list();
      setNotes(data);
    } catch (caught) {
      const message = getApiErrorMessage(caught);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const stats = useMemo(() => {
    const summarized = notes.filter((note) => note.summary).length;
    const words = notes.reduce((total, note) => total + note.content.trim().split(/\s+/).filter(Boolean).length, 0);
    const lastUpdated = notes[0]?.updated_at ?? null;

    return {
      total: notes.length,
      summarized,
      unsummarized: Math.max(0, notes.length - summarized),
      words,
      lastUpdated,
    };
  }, [notes]);

  return { notes, setNotes, stats, isLoading, error, refresh };
}

export function useNoteActions(onChange?: () => Promise<void> | void) {
  const [pendingId, setPendingId] = useState<number | null>(null);

  const remove = useCallback(
    async (note: Note) => {
      setPendingId(note.id);
      try {
        await notesApi.remove(note.id);
        toast.success("Note deleted", { description: note.title });
        await onChange?.();
      } catch (caught) {
        toast.error("Delete failed", { description: getApiErrorMessage(caught) });
      } finally {
        setPendingId(null);
      }
    },
    [onChange],
  );

  const summarize = useCallback(
    async (note: Note) => {
      setPendingId(note.id);
      try {
        await notesApi.summarize(note.id);
        toast.success("Summary generated", { description: note.title });
        await onChange?.();
      } catch (caught) {
        toast.error("Summary failed", { description: getApiErrorMessage(caught) });
      } finally {
        setPendingId(null);
      }
    },
    [onChange],
  );

  const save = useCallback(async (payload: NotePayload, id?: number | string) => {
    if (id) {
      return notesApi.update(id, payload);
    }

    return notesApi.create(payload);
  }, []);

  return { pendingId, remove, summarize, save };
}
