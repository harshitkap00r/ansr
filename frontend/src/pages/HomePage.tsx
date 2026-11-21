import { useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { getFeaturedProducts, type Product } from "../services/api";
import ProductGrid from "../components/ProductGrid";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    setError("");

    getFeaturedProducts()
      .then(setProducts)
      .catch(() =>
        setError(
          "Couldn't connect to the catalogue backend. Make sure the backend is running."
        )
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <main>
      {/* Hero section */}
      <section className="relative overflow-hidden bg-[#e9ede6]">
        <div className="relative mx-auto w-full max-w-7xl px-6 py-12 sm:px-8 sm:py-16">
          <div className="relative z-10 max-w-[520px]">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.13em] text-[#5c715e]">
              <Sparkles size={15} />
              A collection worth discovering
            </div>

            <h1 className="mb-4 mt-5 text-[clamp(38px,5vw,58px)] font-extrabold leading-[1.06] tracking-[-.04em]">
              Find your next
              <br />
              <span className="text-[#5c715e]">favorite thing.</span>
            </h1>

            <p className="mb-6 max-w-[430px] text-[15px] leading-7 text-[#656b61]">
              Explore a curated collection of everyday essentials, timeless
              pieces, and thoughtful finds.
            </p>

            <Link
              to="/search"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#405542] transition hover:gap-3"
            >
              Explore catalogue
              <ArrowRight size={17} />
            </Link>
          </div>

          {/* Decorative ANSR Collection */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 opacity-40 sm:block sm:opacity-75"
          >
            <div className="relative size-[280px] lg:size-[360px]">
              <div className="absolute inset-0 rounded-full border border-[#5c715e]/20" />

              <div className="absolute inset-[28px] rounded-full border border-[#5c715e]/20 lg:inset-[42px]" />

              <div className="absolute inset-[58px] rounded-full border border-[#5c715e]/20 lg:inset-[86px]" />

              <div className="absolute inset-[85px] grid place-content-center rounded-full bg-[#cdd8cc] text-center font-extrabold tracking-[.13em] text-[#405542] shadow-[0_18px_45px_rgba(67,85,69,.12)] lg:inset-[110px]">
                ANSR
                <span className="mt-1 block text-[9px] font-semibold tracking-[.22em]">
                  COLLECTION
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto w-full max-w-7xl px-6 py-10 sm:px-8 sm:py-14">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="m-0 text-[11px] font-bold uppercase tracking-[.13em] text-[#5c715e]">
              Handpicked for you
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-[27px]">
              Featured products
            </h2>
          </div>

          <span className="text-[13px] text-[#77796f]">
            Our top-rated selection
          </span>
        </div>

        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorMessage message={error} onRetry={load} />
        ) : (
          <ProductGrid products={products} />
        )}
      </section>
    </main>
  );
}