"use client";

import { deleteJournalAction } from "@/lib/journal-actions";

type DeleteJournalFormProps = {
  journalId: string;
  compact?: boolean;
};

export function DeleteJournalForm({
  journalId,
  compact = false,
}: DeleteJournalFormProps) {
  return (
    <form
      action={deleteJournalAction.bind(null, journalId)}
      onSubmit={(event) => {
        if (!window.confirm("Hapus jurnal ini?")) {
          event.preventDefault();
        }
      }}
    >
      <button
        className={
          compact
            ? "rounded-lg border border-rose-300/20 px-3 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-400/10"
            : "rounded-xl border border-rose-300/20 px-5 py-3 font-semibold text-rose-100 transition hover:bg-rose-400/10"
        }
      >
        Delete
      </button>
    </form>
  );
}
