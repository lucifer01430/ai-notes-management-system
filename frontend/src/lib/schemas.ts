import { z } from "zod";

export const noteSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(255, "Title is too long"),
  content: z.string().trim().min(1, "Content is required"),
});

export const searchSchema = z.object({
  query: z.string().trim().min(1, "Search query is required").max(1000, "Search query is too long"),
});

export type NoteFormValues = z.infer<typeof noteSchema>;
export type SearchFormValues = z.infer<typeof searchSchema>;
