import React from 'react';
import { Cpu, ShieldCheck, Zap, ArrowRight, Gauge, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Hero: React.FC = () => {
  const { setSelectedProductId, products } = useStore();
  const flagship = products.find((p) => p.id === 'pc-apex-one') || products[0];

  return (
    <section className="relative overflow-hidden border-b border-neutral-800/80 bg-neutral-950 pt-8 pb-14">
      {/* Subtle ambient gradient mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(245,158,11,0.08),rgba(255,255,255,0))]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headline and Proof */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <div className="text-xs uppercase tracking-widest text-amber-400 font-mono font-medium">
                Engineered in Austin, TX · Custom Hardline Liquid Cooling
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.12] text-balance">
                Precision Computing for High-Stakes Workloads.
              </h1>
              <p className="text-base text-neutral-400 leading-relaxed max-w-xl">
                Every desktop and server is individually stress-tested for 48 hours under maximum thermal load. Backed by real-time inventory, transparent hardware verification, and zero bloatware.
              </p>
            </div>

            {/* Hardware trust specs strip */}
            <div className="grid grid-cols-3 gap-4 py-3 border-y border-neutral-800/80">
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">48h</div>
                <div className="text-xs text-neutral-500 mt-0.5">Burn-In Stress QA</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">100%</div>
                <div className="text-xs text-neutral-500 mt-0.5">Non-Throttling SLA</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">3-Yr</div>
                <div className="text-xs text-neutral-500 mt-0.5">On-Site Warranty</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              {flagship && (
                <button
                  onClick={() => setSelectedProductId(flagship.id)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold text-sm transition-all active:scale-95 cursor-pointer shadow-lg shadow-amber-400/10"
                >
                  <span>Explore Flagship 9950X</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
              <a
                href="#catalog"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-neutral-700 bg-neutral-900/60 hover:bg-neutral-800 text-neutral-200 text-sm font-medium transition-colors"
              >
                Browse All Systems ({products.length})
              </a>
            </div>

            {/* Guarantees */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                PCI-DSS Level 1 Secure Checkout
              </span>
              <span className="text-neutral-700">·</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                Live Stock Guaranteed
              </span>
              <span className="text-neutral-700">·</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                Insured Wooden Crate Delivery
              </span>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 group shadow-2xl">
              <img
                src="/src/assets/images/hero_custom_workstation_1794212401925.jpg"
                alt="Apex-Liquid Extreme Custom Workstation"
                referrerPolicy="no-referrer"
                className="w-full h-[360px] sm:h-[420px] object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />

              {/* Scrim overlay for specs text legibility */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent p-5 sm:p-6">
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-amber-400">Featured Build</span>
                    <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">Apex-Liquid Extreme 9950X</h2>
                    <p className="text-xs text-neutral-300 mt-1">Ryzen 9 9950X · RTX 4090 24GB · 64GB DDR5 · EKWB Hardline</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs text-neutral-400 line-through tabular-nums">$5,299</div>
                    <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400 tabular-nums">$4,899</div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 font-mono text-neutral-300">
                      <Gauge className="w-3.5 h-3.5 text-amber-400" /> 124 FPS (Cyberpunk 4K Ray-Tracing)
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedProductId('pc-apex-one')}
                    className="text-white hover:text-amber-400 font-medium transition-colors cursor-pointer"
                  >
                    View Build Specs &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
