import React, { useState } from 'react';
import {
  X,
  Check,
  Cpu,
  Zap,
  ShieldCheck,
  ShoppingBag,
  Gauge,
  Box,
  Layers,
  ThermometerSnowflake,
  ExternalLink
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ProductDetailModal: React.FC = () => {
  const {
    products,
    selectedProductId,
    setSelectedProductId,
    addToCart,
    setIsCheckoutOpen
  } = useStore();

  const [selectedWarranty, setSelectedWarranty] = useState<
    'standard' | 'extended_2yr' | 'pro_on_site_3yr'
  >('standard');

  if (!selectedProductId) return null;

  const product = products.find((p) => p.id === selectedProductId);
  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, selectedWarranty);
    setSelectedProductId(null);
  };

  const handleInstantBuy = () => {
    addToCart(product, selectedWarranty);
    setSelectedProductId(null);
    setIsCheckoutOpen(true);
  };

  const warrantyOptions = [
    {
      id: 'standard',
      name: 'Standard Inclusion',
      price: 0,
      description: product.warranty
    },
    {
      id: 'extended_2yr',
      name: 'Extended Coverage (+2 Years)',
      price: 249,
      description: 'Extends hardware parts and freight replacement with overnight cross-shipment.'
    },
    {
      id: 'pro_on_site_3yr',
      name: 'Pro On-Site SLA (+3 Years)',
      price: 499,
      description: 'Dedicated technician on-site within 24 hours plus annual preventative coolant maintenance.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-neutral-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Close Button */}
        <button
          onClick={() => setSelectedProductId(null)}
          className="absolute top-4 right-4 z-10 p-2 text-neutral-400 hover:text-white bg-neutral-950/70 hover:bg-neutral-800 rounded-full transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Left Column: Visual & Benchmarks */}
          <div className="lg:col-span-5 bg-neutral-950 p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-neutral-800">
            <div>
              <div className="aspect-square w-full rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900 mb-6">
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Benchmarks Section */}
              <div className="space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-amber-400" />
                  <span>Lab Verified Benchmarks</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {product.benchmarks.cyberpunkFps4k && (
                    <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
                      <div className="text-neutral-400">Cyberpunk 4K Ultra</div>
                      <div className="text-base font-bold font-mono text-white tabular-nums mt-0.5">
                        {product.benchmarks.cyberpunkFps4k} FPS
                      </div>
                    </div>
                  )}
                  {product.benchmarks.cinebenchR23 && (
                    <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
                      <div className="text-neutral-400">Cinebench R23</div>
                      <div className="text-base font-bold font-mono text-white tabular-nums mt-0.5">
                        {product.benchmarks.cinebenchR23.toLocaleString()} pts
                      </div>
                    </div>
                  )}
                  {product.benchmarks.blenderRenderSec && (
                    <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
                      <div className="text-neutral-400">Blender BMW Cycle</div>
                      <div className="text-base font-bold font-mono text-white tabular-nums mt-0.5">
                        {product.benchmarks.blenderRenderSec}s render
                      </div>
                    </div>
                  )}
                  {product.benchmarks.timespyScore && (
                    <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
                      <div className="text-neutral-400">TimeSpy Extreme</div>
                      <div className="text-base font-bold font-mono text-white tabular-nums mt-0.5">
                        {product.benchmarks.timespyScore.toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Inventory Status Bar */}
            <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400 font-mono">
              <span>Inventory Allocation:</span>
              <span
                className={`font-semibold ${
                  product.stock > 3
                    ? 'text-emerald-400'
                    : product.stock > 0
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              >
                {product.stock > 0 ? `${product.stock} units ready to crate` : 'Backordered'}
              </span>
            </div>
          </div>

          {/* Right Column: Full Hardware Specs & Configuration */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div>
                <div className="text-xs uppercase tracking-wider text-amber-400 font-mono font-medium">
                  {product.brand} · {product.specs.formFactor}
                </div>
                <h2 className="text-2xl font-bold text-white mt-1">{product.name}</h2>
                <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Hardware Breakdown Grid */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                  Full Engineering Blueprint
                </h4>
                <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-4 divide-y divide-neutral-800/80 text-xs">
                  <div className="py-2 first:pt-0 grid grid-cols-3">
                    <span className="text-neutral-400 font-medium">Processor</span>
                    <span className="col-span-2 text-white font-mono">{product.specs.cpu}</span>
                  </div>
                  <div className="py-2 grid grid-cols-3">
                    <span className="text-neutral-400 font-medium">Graphics</span>
                    <span className="col-span-2 text-white font-mono">{product.specs.gpu}</span>
                  </div>
                  <div className="py-2 grid grid-cols-3">
                    <span className="text-neutral-400 font-medium">Memory (RAM)</span>
                    <span className="col-span-2 text-white font-mono">
                      {product.specs.ramType || `${product.specs.ram}GB DDR5`}
                    </span>
                  </div>
                  <div className="py-2 grid grid-cols-3">
                    <span className="text-neutral-400 font-medium">Solid State Drive</span>
                    <span className="col-span-2 text-white font-mono">{product.specs.storage}</span>
                  </div>
                  <div className="py-2 grid grid-cols-3">
                    <span className="text-neutral-400 font-medium">Thermal Architecture</span>
                    <span className="col-span-2 text-white font-mono">{product.specs.cooling}</span>
                  </div>
                  <div className="py-2 last:pb-0 grid grid-cols-3">
                    <span className="text-neutral-400 font-medium">Power Delivery</span>
                    <span className="col-span-2 text-white font-mono">{product.specs.powerSupply}</span>
                  </div>
                </div>
              </div>

              {/* Warranty Tier Selector */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                  Select Warranty & Support Plan
                </h4>
                <div className="space-y-2">
                  {warrantyOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedWarranty(opt.id as any)}
                      className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                        selectedWarranty === opt.id
                          ? 'border-amber-400 bg-amber-400/5'
                          : 'border-neutral-800 bg-neutral-950/50 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white">{opt.name}</span>
                        <span className="text-xs font-mono text-amber-400 font-bold tabular-nums">
                          {opt.price === 0 ? 'Included' : `+$${opt.price}`}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-1 leading-normal">
                        {opt.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Included Crate Accessories */}
              <div className="text-xs text-neutral-400">
                <span className="font-medium text-neutral-300">Crate Includes: </span>
                {product.includedAccessories.join(', ')}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-neutral-400 block font-mono">Total Configuration</span>
                <div className="text-2xl font-bold font-mono text-white tabular-nums">
                  $
                  {(
                    product.price +
                    (selectedWarranty === 'extended_2yr' ? 249 : selectedWarranty === 'pro_on_site_3yr' ? 499 : 0)
                  ).toLocaleString()}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-white transition-colors cursor-pointer ${
                    product.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>

                <button
                  onClick={handleInstantBuy}
                  disabled={product.stock <= 0}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-neutral-950 transition-colors shadow-lg shadow-amber-400/10 cursor-pointer ${
                    product.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <span>Instant Checkout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
