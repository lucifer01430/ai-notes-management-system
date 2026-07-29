"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { NoteCard } from "@/components/notes/note-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getApiErrorMessage, notesApi } from "@/lib/api";
import { searchSchema, type SearchFormValues } from "@/lib/schemas";
import type { Note } from "@/types/note";

export default function SemanticSearchPage() {
  const [results, setResults] = useState<Note[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: { query: "" },
  });

  async function onSubmit(values: SearchFormValues) {
    setIsSearching(true);
    setHasSearched(true);
    try {
      setResults(await notesApi.search(values));
    } catch (caught) {
      toast.error("Search failed", { description: getApiErrorMessage(caught) });
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Semantic Search"
        title="Ask for ideas by meaning"
        description="Search naturally. Gemini embeddings compare your question with stored note vectors and rank the closest matches."
      />

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 md:flex-row">
            <div className="min-w-0 flex-1">
              <label htmlFor="query" className="sr-only">Search query</label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <Input id="query" placeholder="How does Laravel routing work?" className="pl-10" {...register("query")} />
              </div>
              {errors.query ? <p className="mt-2 text-sm text-red-600">{errors.query.message}</p> : null}
            </div>
            <Button type="submit" isLoading={isSearching} className="md:w-40">
              <SlidersHorizontal className="h-4 w-4" />
              Rank Notes
            </Button>
          </form>
        </CardContent>
      </Card>

      <section className="mt-6" aria-live="polite">
        {isSearching ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-64" />
            ))}
          </div>
        ) : null}

        {!isSearching && !hasSearched ? (
          <Card>
            <CardContent className="text-center">
              <p className="font-medium text-zinc-950 dark:text-white">Ready for natural language search</p>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Try “notes about routing”, “Gemini summaries”, or “Laravel validation”.</p>
            </CardContent>
          </Card>
        ) : null}

        {!isSearching && hasSearched && results.length === 0 ? (
          <Card>
            <CardContent className="text-center">
              <p className="font-medium text-zinc-950 dark:text-white">No semantic matches</p>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Add more notes or try a broader question.</p>
            </CardContent>
          </Card>
        ) : null}

        {!isSearching && results.length > 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {results.map((note) => (
              <NoteCard key={note.id} note={note} showScore />
            ))}
          </motion.div>
        ) : null}
      </section>
    </AppShell>
  );
}
