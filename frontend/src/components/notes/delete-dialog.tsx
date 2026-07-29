"use client";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import type { Note } from "@/types/note";

interface DeleteDialogProps {
  note: Note | null;
  isDeleting?: boolean;
  onClose: () => void;
  onConfirm: (note: Note) => void;
}

export function DeleteDialog({ note, isDeleting, onClose, onConfirm }: DeleteDialogProps) {
  return (
    <Modal
      open={Boolean(note)}
      title="Delete note"
      description="This action permanently removes the note from your workspace."
      onClose={onClose}
    >
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Are you sure you want to delete <span className="font-medium text-zinc-950 dark:text-white">{note?.title}</span>?
      </p>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="danger" isLoading={isDeleting} onClick={() => note && onConfirm(note)}>
          Delete
        </Button>
      </div>
    </Modal>
  );
}
