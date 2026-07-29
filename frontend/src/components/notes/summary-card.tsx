import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SummaryCardProps {
  summary: string | null;
}

export function SummaryCard({ summary }: SummaryCardProps) {
  return (
    <Card className="bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
      <CardContent>
        <div className="flex items-center gap-2 text-sm font-medium">
          <Sparkles className="h-4 w-4" />
          AI Summary
        </div>
        <p className="mt-3 text-sm leading-6 text-zinc-200 dark:text-zinc-700">
          {summary ?? "No summary yet. Generate one from the note detail page."}
        </p>
      </CardContent>
    </Card>
  );
}
