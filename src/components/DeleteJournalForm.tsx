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
      className={compact ? "flex-1 sm:flex-none" : "w-full sm:w-auto"}
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
            ? "w-full rounded-lg border border-white/45 bg-[#fffaf0]/35 px-3 py-2 text-sm font-semibold text-rose-800 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#fffaf0]/50"
            : "w-full rounded-xl border border-white/45 bg-[#fffaf0]/35 px-5 py-3 font-semibold text-rose-800 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#fffaf0]/50 sm:w-auto"
        }
      >
        Delete
      </button>
    </form>
  );
}
