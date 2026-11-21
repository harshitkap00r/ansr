import type { Product } from "../services/api";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) return <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-[#deded7] bg-white p-6 text-center text-[#77796f]">No products found.</div>;
  return <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>;
}
