import React from 'react';
import { Cpu, Eye, ShoppingBag, ShieldCheck, Zap } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, setSelectedProductId } = useStore();

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group relative flex flex-col rounded-xl border border-neutral-800 bg-neutral-900/60 transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-700 hover:shadow-xl hover:shadow-neutral-950/50 overflow-hidden">
      {/* Product Image Stage */}
      <div
        onClick={() => setSelectedProductId(product.id)}
        className="relative h-60 w-full overflow-hidden bg-neutral-950 cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Quiet stock & status tags (No Pill Badge Spam, subtle clean markers) */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {product.status === 'out_of_stock' && (
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-rose-950/80 border border-rose-800/80 text-rose-300">
              Backorder
            </span>
          )}
          {product.status === 'low_stock' && (
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800/80 text-amber-300">
              Only {product.stock} Left
            </span>
          )}
          {product.featured && product.status === 'in_stock' && (
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-neutral-900/90 border border-neutral-700 text-neutral-300">
              Featured
            </span>
          )}
        </div>

        {/* Quick view button overlay */}
        <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-neutral-900/90 text-xs font-medium text-white border border-neutral-700 shadow-md">
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            Inspect Specifications
          </span>
        </div>
      </div>

      {/* Product Body */}
      <div className="flex flex-1 flex-col p-4 sm:p-5 justify-between space-y-4">
        <div className="space-y-2">
          {/* Brand & Category in muted text with typographic separator */}
          <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
            <span>{product.brand}</span>
            <span aria-hidden="true">·</span>
            <span className="uppercase">{product.specs.formFactor}</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => setSelectedProductId(product.id)}
            className="text-base font-semibold text-white group-hover:text-amber-400 transition-colors cursor-pointer line-clamp-1"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Core Hardware Specs Row */}
          <div className="space-y-1 text-xs text-neutral-300">
            <div className="truncate text-neutral-200">
              <span className="text-neutral-500 font-mono">CPU </span>
              {product.specs.cpu.split('(')[0]}
            </div>
            <div className="truncate text-neutral-200">
              <span className="text-neutral-500 font-mono">GPU </span>
              {product.specs.gpu}
            </div>
            <div className="flex items-center gap-2 text-neutral-400 font-mono text-[11px] pt-1">
              <span>{product.specs.ram}GB RAM</span>
              <span aria-hidden="true">/</span>
              <span className="truncate">{product.specs.storage.split('(')[0]}</span>
            </div>
          </div>
        </div>

        {/* Price & Buy Action */}
        <div className="pt-3 border-t border-neutral-800 flex items-center justify-between gap-3">
          <div>
            {product.originalPrice && (
              <span className="text-xs text-neutral-500 line-through tabular-nums block">
                ${product.originalPrice.toLocaleString()}
              </span>
            )}
            <span className="text-lg font-bold font-mono text-white tabular-nums">
              ${product.price.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedProductId(product.id)}
              className="p-2 text-neutral-400 hover:text-white rounded-lg border border-neutral-800 hover:border-neutral-700 bg-neutral-900 transition-colors cursor-pointer"
              title="View full specs"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => addToCart(product)}
              disabled={isOutOfStock}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all active:scale-95 cursor-pointer ${
                isOutOfStock
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  : 'bg-amber-400 hover:bg-amber-300 text-neutral-950 shadow-sm'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
