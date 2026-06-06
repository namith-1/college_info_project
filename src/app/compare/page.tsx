import Link from "next/link";
import { CompareClient } from "@/components/compare/CompareClient";
import { SaveComparisonButton } from "@/components/compare/SaveComparisonButton";

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ ids?: string }> }) {
  const params = await searchParams;
  const ids = params.ids?.split(",").filter(Boolean).slice(0, 3) ?? [];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-coral">Compare colleges</p>
          <h1 className="mt-2 text-3xl font-bold text-ink sm:text-4xl">Side-by-side decision table</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/62">Compare fees, placements, rating, location, courses, and accepted exams for up to three colleges.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SaveComparisonButton collegeIds={ids} />
          <Link href="/" className="rounded-md bg-moss px-4 py-2 text-sm font-semibold text-white">
            Add colleges
          </Link>
        </div>
      </div>
      <CompareClient ids={ids} />
    </main>
  );
}
