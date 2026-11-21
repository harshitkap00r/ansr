export default function Loading() {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[#deded7] bg-white p-6 text-sm text-[#77796f]">
      <span className="size-6 animate-spin rounded-full border-2 border-[#d9e0d7] border-t-[#5c715e]" />
      Loading products...
    </div>
  );
}
