"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

interface HelpModalProps {
  title: string;
  children: React.ReactNode;
}

export function HelpModal({ title, children }: HelpModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        className="h-10 w-10 px-0"
        onClick={() => setOpen(true)}
        aria-label={`Open help for ${title}`}
        title="Page information"
      >
        <Info className="h-4 w-4" aria-hidden />
      </Button>
      <Modal open={open} title={title} description="Quick guide" onClose={() => setOpen(false)}>
        <div className="space-y-4 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{children}</div>
      </Modal>
    </>
  );
}
