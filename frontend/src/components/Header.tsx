import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import { getCategories, searchProducts, type Product } from "../services/api";

const prettifyCategory = (category: string) =>
  category
    .replace(/&/g, "and")
    .replace(/(^|\s)\S/g, (letter) => letter.toUpperCase());

export default function Header() {
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setShowSuggestions(false);
  }, [location.pathname, location.search]);

  // Debounced autocomplete
  useEffect(() => {
    const query = search.trim();

    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLoadingSuggestions(true);
      setShowSuggestions(true);

      try {
        const results = await searchProducts(query);
        setSuggestions(results.slice(0, 3));
      } catch {
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search]);

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();

    const query = search.trim();

    if (query) {
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[#e8e8e2] bg-white/95 backdrop-blur">
      {/* Header */}
      <div className="mx-auto flex h-[68px] w-full max-w-7xl items-center gap-4 px-6 md:h-[76px] md:gap-8 sm:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2.5 font-extrabold tracking-[.11em]"
          aria-label="ANSR home"
        >
          <span className="grid size-8 place-items-center rounded-[9px] bg-[#5c715e] text-white tracking-normal">
            A
          </span>
          <span>ANSR</span>
        </Link>

        {/* Search */}
        <div className="relative mx-auto min-w-0 flex-1 md:max-w-[500px]">
          <form
            onSubmit={submitSearch}
            className="flex items-center gap-2 rounded-lg border border-[#ecece7] bg-[#f5f5f2] px-3 py-1.5 text-[#85867e]"
          >
            <Search size={18} className="shrink-0" />

            <input
              aria-label="Search products"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onFocus={() => {
                if (search.trim().length >= 2) {
                  setShowSuggestions(true);
                }
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setShowSuggestions(false);
                }
              }}
              placeholder="Search products..."
              className="min-w-0 flex-1 bg-transparent text-sm text-[#24251f] outline-none placeholder:text-[#85867e]"
            />

            <button
              type="submit"
              className="rounded-md bg-[#5c715e] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#405542]"
            >
              Search
            </button>
          </form>

          {/* Autocomplete dropdown */}
          {showSuggestions && (
            <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-[#e8e8e2] bg-white shadow-xl">
              {loadingSuggestions ? (
                <div className="px-4 py-5 text-center text-sm text-[#77796f]">
                  Searching products...
                </div>
              ) : suggestions.length > 0 ? (
                <div>
                  {suggestions.map((product) => (
                    <Link
                      key={product.id}
                      to={`/products/${product.id}`}
                      onClick={() => {
                        setShowSuggestions(false);
                        setSearch("");
                      }}
                      className="flex items-center gap-3 border-b border-[#f1f1ed] p-3 transition hover:bg-[#f8f8f5] last:border-0"
                    >
                      {/* Product image */}
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-[#f7f7f5] p-1.5">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="h-full w-full object-contain"
                        />
                      </div>

                      {/* Product info */}
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-medium text-[#24251f]">
                          {product.title}
                        </p>

                        <p className="mt-1 text-xs text-[#77796f]">
                          {prettifyCategory(product.category)}
                        </p>
                      </div>

                      {/* Price */}
                      <span className="shrink-0 text-sm font-semibold text-[#24251f]">
                        ${product.price.toFixed(2)}
                      </span>
                    </Link>
                  ))}

                  {/* View all */}
                  <button
                    onClick={() => {
                      const query = search.trim();
                      setShowSuggestions(false);
                      navigate(`/search?q=${encodeURIComponent(query)}`);
                    }}
                    className="w-full px-4 py-3 text-center text-sm font-semibold text-[#5c715e] transition hover:bg-[#f8f8f5]"
                  >
                    View all results for "{search}"
                  </button>
                </div>
              ) : (
                <div className="px-4 py-5 text-center text-sm text-[#77796f]">
                  No products found.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile menu */}
        <button
          className="inline-flex shrink-0 p-2 md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {/* Categories — Home removed */}
      <nav
        className={`${mobileOpen ? "block" : "hidden"} border-t border-[#f1f1ed] md:block`}
      >
        <div className="mx-auto flex min-h-11 w-full max-w-7xl items-center gap-5 overflow-x-auto px-6 py-2 sm:px-8 md:gap-7">
          {categories.map((category) => (
            <Link
              key={category}
              to={`/categories/${encodeURIComponent(category)}`}
              className="shrink-0 whitespace-nowrap text-sm text-[#62645c] transition hover:text-[#405542]"
            >
              {prettifyCategory(category)}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}