import { PredictorClient } from "@/components/predictor/PredictorClient";

export default function PredictorPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-coral">Predictor tool</p>
        <h1 className="mt-2 text-3xl font-bold text-ink sm:text-4xl">Find colleges that match your exam rank</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/62">
          Enter an exam and rank to receive database-driven recommendations based on previous cutoff ranges.
        </p>
      </div>
      <PredictorClient />
    </main>
  );
}
