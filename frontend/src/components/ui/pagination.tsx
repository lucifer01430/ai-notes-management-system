"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center justify-between gap-3" aria-label="Pagination">
      <Button variant="secondary" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>
      <span className="text-sm text-zinc-500 dark:text-zinc-400">
        Page {page} of {totalPages}
      </span>
      <Button variant="secondary" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}
