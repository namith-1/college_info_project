import { SearchX } from "lucide-react";

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="grid min-h-64 place-items-center rounded-lg border border-dashed border-black/20 bg-white/70 p-8 text-center">
      <div>
        <SearchX className="mx-auto mb-3 text-ink/45" size={36} />
        <h3 className="text-lg font-semibold text-ink">{title}</h3>
        <p className="mt-1 max-w-md text-sm text-ink/60">{body}</p>
      </div>
    </div>
  );
}
