"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  children: React.ReactNode;
  onClose: () => void;
}

export function Modal({ open, title, description, children, onClose }: ModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <motion.div
            className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="relative w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="modal-title" className="text-base font-semibold text-zinc-950 dark:text-white">{title}</h2>
                {description ? <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{description}</p> : null}
              </div>
              <Button variant="ghost" className="h-8 w-8 p-0" onClick={onClose} aria-label="Close dialog">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-5">{children}</div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
