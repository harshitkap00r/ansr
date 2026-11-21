import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import type { Product } from "../services/api";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-[#ecece7] bg-white transition hover:-translate-y-0.5 hover:border-[#d9ded6] hover:shadow-[0_12px_28px_rgba(28,32,26,.07)]"
    >
      {/* Image container */}
      <div className="flex h-[165px] shrink-0 items-center justify-center overflow-hidden bg-white p-4 sm:h-[205px] sm:p-5">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Product information */}
      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <span className="truncate text-[10px] uppercase tracking-[.1em] text-[#77796f]">
          {product.category}
        </span>

        <h3 className="mb-4 mt-2 line-clamp-2 min-h-[38px] text-[12px] font-semibold leading-[1.45] sm:text-[13px]">
          {product.title}
        </h3>

        <div className="mt-auto flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-bold">${product.price.toFixed(2)}</span>

          <span className="inline-flex items-center gap-1 whitespace-nowrap text-xs text-[#b47b27]">
            <Star size={14} fill="currentColor" />
            {product.rating.rate.toFixed(1)}
            <span className="text-[11px] text-[#93948d]">
              ({product.rating.count})
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}