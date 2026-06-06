import { SavedDashboard } from "@/components/saved/SavedDashboard";

export default function SavedPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-coral">Your shortlist</p>
        <h1 className="mt-2 text-3xl font-bold text-ink sm:text-4xl">Saved colleges and comparisons</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/62">
          Revisit colleges and decision sets saved to your account.
        </p>
      </div>
      <SavedDashboard />
    </main>
  );
}
