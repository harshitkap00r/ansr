import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts, searchProducts, type Product } from "../services/api";
import ProductGrid from "../components/ProductGrid";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

const PRODUCTS_PER_PAGE = 12;

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";

  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    setCurrentPage(1);

    try {
      const results = query
        ? await searchProducts(query)
        : await getProducts();

      setProducts(results);
    } catch {
      setError("Couldn't load products. Make sure the backend is running.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    load();
  }, [load]);

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;

  const visibleProducts = products.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  );

  return (
    <main className="mx-auto min-h-[55vh] w-full max-w-7xl px-6 pb-16 pt-8 sm:px-8 sm:pt-11">
      <div className="mb-8">
        <p className="m-0 text-[11px] font-bold uppercase tracking-[.13em] text-[#5c715e]">
          Catalogue
        </p>

        <h1 className="mb-2 mt-2 text-3xl font-extrabold tracking-tight">
          {query ? "Search results" : "All products"}
        </h1>

        {query && (
          <p className="m-0 text-sm text-[#77796f]">
            Results for{" "}
            <strong className="font-medium text-[#24251f]">
              "{query}"
            </strong>
          </p>
        )}
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorMessage message={error} onRetry={load} />
      ) : products.length > 0 ? (
        <>
          <p className="mb-4 text-sm text-[#77796f]">
            Showing {startIndex + 1}–{Math.min(startIndex + PRODUCTS_PER_PAGE, products.length)} of {products.length} products
          </p>

          <ProductGrid products={visibleProducts} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((page) => page - 1)}
                disabled={currentPage === 1}
                className="rounded-lg border border-[#deded7] px-4 py-2 text-sm transition hover:bg-[#e9ede6] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`h-10 w-10 rounded-lg text-sm transition ${
                      currentPage === page
                        ? "bg-[#273d2c] text-white"
                        : "border border-[#deded7] hover:bg-[#e9ede6]"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => setCurrentPage((page) => page + 1)}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-[#deded7] px-4 py-2 text-sm transition hover:bg-[#e9ede6] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-[#deded7] bg-white p-6 text-center text-[#77796f]">
          {query
            ? `No products found for "${query}".`
            : "No products available."}
        </div>
      )}
    </main>
  );
}