import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-[55vh] w-[calc(100%-32px)] max-w-[1160px] flex-col items-center justify-center gap-3 py-16 text-center">
      <p className="m-0 text-[11px] font-bold uppercase tracking-[.13em] text-[#5c715e]">404</p><h1 className="m-0 text-3xl font-extrabold">Page not found</h1><p className="text-sm text-[#77796f]">The page you're looking for doesn't exist.</p><Link to="/" className="mt-2 rounded-lg bg-[#5c715e] px-4 py-3 text-sm font-bold text-white hover:bg-[#405542]">Return home</Link>
    </main>
  );
}
