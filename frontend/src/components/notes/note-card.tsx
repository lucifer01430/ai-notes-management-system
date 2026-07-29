"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Edit3, Sparkles, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonClasses } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { excerpt, formatDate, readingTime } from "@/lib/utils";
import type { Note } from "@/types/note";

interface NoteCardProps {
  note: Note;
  onDelete?: (note: Note) => void;
  onSummarize?: (note: Note) => void;
  isPending?: boolean;
  showScore?: boolean;
}

export function NoteCard({ note, onDelete, onSummarize, isPending, showScore }: NoteCardProps) {
  return (
    <motion.article initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <Card className="group h-full transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-zinc-950/[0.06] dark:hover:shadow-black/20">
        <CardContent className="flex h-full flex-col">
          <div className="flex items-start justify-between gap-3">
            <Link href={`/notes/${note.id}`} className="min-w-0">
              <h3 className="line-clamp-2 text-base font-semibold tracking-tight text-zinc-950 transition group-hover:text-zinc-700 dark:text-white dark:group-hover:text-zinc-200">
                {note.title}
              </h3>
            </Link>
            {showScore && typeof note.similarity_score === "number" ? (
              <Badge>{Math.round(note.similarity_score * 100)}%</Badge>
            ) : null}
          </div>

          <p className="mt-3 line-clamp-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{excerpt(note.content, 220)}</p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge>{readingTime(note.content)} min read</Badge>
            <Badge>{note.summary ? "Summarized" : "No summary"}</Badge>
            <Badge>{formatDate(note.updated_at)}</Badge>
          </div>

          {note.summary ? (
            <div className="mt-4 rounded-xl bg-zinc-50 p-3 text-sm leading-6 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
              {excerpt(note.summary, 130)}
            </div>
          ) : null}

          <div className="mt-auto flex flex-wrap gap-2 pt-5">
            <Link href={`/notes/${note.id}/edit`} className={buttonClasses("secondary", "flex-1")}>
              <Edit3 className="h-4 w-4" />
              Edit
            </Link>
            <Button variant="secondary" className="flex-1" type="button" isLoading={isPending} onClick={() => onSummarize?.(note)}>
              <Sparkles className="h-4 w-4" />
              Summary
            </Button>
            <Button variant="ghost" className="h-10 w-10 px-0 text-red-600" type="button" onClick={() => onDelete?.(note)} aria-label={`Delete ${note.title}`}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.article>
  );
}
