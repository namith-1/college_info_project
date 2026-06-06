export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <div className="grid min-h-64 place-items-center rounded-lg border border-black/10 bg-white p-8">
      <div className="flex items-center gap-3 text-sm font-medium text-ink/65">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-moss border-t-transparent" />
        {label}
      </div>
    </div>
  );
}
