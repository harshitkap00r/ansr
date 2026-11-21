type Props = { message?: string; onRetry?: () => void };

export default function ErrorMessage({ message = "Something went wrong while loading data.", onRetry }: Props) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[#deded7] bg-white p-6 text-center text-[#8b514b]">
      <p>{message}</p>
      {onRetry && <button className="rounded-lg border border-[#e8e8e2] bg-white px-4 py-2.5 text-sm font-semibold text-[#24251f] hover:bg-[#f8f8f5]" onClick={onRetry}>Try again</button>}
    </div>
  );
}
