import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductsByCategory, type Product } from "../services/api";
import ProductGrid from "../components/ProductGrid";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

const titleCase = (value: string) => value.replace(/(^|\s)\S/g, (char) => char.toUpperCase());

export default function CategoryPage() {
  const { category = "" } = useParams();
  const selectedCategory = decodeURIComponent(category);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = () => { setLoading(true); setError(""); getProductsByCategory(selectedCategory).then(setProducts).catch(() => setError("Couldn't load this category. Please try again.")).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, [selectedCategory]);

  const sorted = useMemo(() => [...products].sort((a, b) => b.rating.rate - a.rating.rate), [products]);
  const featured = sorted.slice(0, 5);
  const featuredIds = new Set(featured.map((product) => product.id));
  const additional = sorted.filter((product) => !featuredIds.has(product.id));

  return (
    <main className="mx-auto min-h-[55vh] w-[calc(100%-32px)] max-w-[1160px] pb-16 pt-8 sm:pt-11">
      <div className="mb-8"><p className="m-0 text-[11px] font-bold uppercase tracking-[.13em] text-[#5c715e]">Browse collection</p><h1 className="mb-2 mt-2 text-3xl font-extrabold tracking-tight">{titleCase(selectedCategory)}</h1><p className="m-0 text-sm text-[#77796f]">{products.length} products in this collection</p></div>
      {loading ? <Loading /> : error ? <ErrorMessage message={error} onRetry={load} /> : <>
        <section className="pb-9 pt-4"><div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><h2 className="text-xl font-bold sm:text-2xl">Top rated</h2><span className="text-sm text-[#77796f]">Highest customer ratings</span></div><ProductGrid products={featured} /></section>
        {additional.length > 0 && <section className="pt-4"><div className="mb-5"><h2 className="text-xl font-bold sm:text-2xl">More from this category</h2></div><ProductGrid products={additional} /></section>}
      </>}
    </main>
  );
}
