import { JournalForm } from "@/components/JournalForm";
import { createJournalAction } from "@/lib/journal-actions";
import { getJakartaDateString } from "@/lib/date";

export default function NewJournalPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-violet-200">Jurnal baru</p>
        <h1 className="mt-2 text-3xl font-bold">Catat perasaan hari ini</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
          Pilih mood, beri nilai intensity, lalu tulis catatan dengan jujur dan
          pelan.
        </p>
      </div>

      <JournalForm
        action={createJournalAction}
        mode="create"
        initialValue={{ journal_date: getJakartaDateString() }}
      />
    </div>
  );
}
