"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { noteSchema, type NoteFormValues } from "@/lib/schemas";
import type { Note } from "@/types/note";

interface NoteFormProps {
  note?: Note;
  isSubmitting?: boolean;
  onSubmit: (values: NoteFormValues) => void;
}

export function NoteForm({ note, isSubmitting, onSubmit }: NoteFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: note?.title ?? "",
      content: note?.content ?? "",
    },
  });

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="title" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Title</label>
            <Input id="title" className="mt-2" placeholder="Give your note a clear title" {...register("title")} />
            {errors.title ? <p className="mt-2 text-sm text-red-600">{errors.title.message}</p> : null}
          </div>
          <div>
            <label htmlFor="content" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Content</label>
            <Textarea id="content" className="mt-2" placeholder="Write the details, ideas, links, or meeting notes..." {...register("content")} />
            {errors.content ? <p className="mt-2 text-sm text-red-600">{errors.content.message}</p> : null}
          </div>
          <div className="flex justify-end">
            <Button type="submit" isLoading={isSubmitting}>
              <Save className="h-4 w-4" />
              {note ? "Save changes" : "Create note"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
