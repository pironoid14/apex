import React from 'react';
import { ShieldCheck, Truck, Lock } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { setCurrentView, setAdminTab } = useStore();

  return (
    <footer className="border-t border-neutral-800/80 bg-neutral-950 text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3">
            <span className="text-lg font-extrabold tracking-tight text-white">
              APEX<span className="text-amber-400">RIG</span> COMPUTING
            </span>
            <p className="text-neutral-500 text-xs leading-relaxed">
              Engineered high-performance computers, custom liquid-cooled workstations, and AI servers. Built in Austin, Texas.
            </p>
            <div className="flex items-center gap-2 text-neutral-400 text-[11px] font-mono">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>PCI-DSS Level 1 & TLS 1.3 Certified</span>
            </div>
          </div>

          {/* Catalog Categories */}
          <div className="space-y-2">
            <h4 className="text-white font-mono uppercase text-[11px] tracking-wider font-semibold">
              Hardware Systems
            </h4>
            <ul className="space-y-1.5 text-neutral-400">
              <li>
                <button
                  onClick={() => setCurrentView('store')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Hardline Liquid Rigs
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('store')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  3D Studio Workstations
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('store')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Mobile Creator Laptops
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('store')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Dual-GPU AI Rackmounts
                </button>
              </li>
            </ul>
          </div>

          {/* Operations & Management */}
          <div className="space-y-2">
            <h4 className="text-white font-mono uppercase text-[11px] tracking-wider font-semibold">
              Store Operations
            </h4>
            <ul className="space-y-1.5 text-neutral-400">
              <li>
                <button
                  onClick={() => {
                    setCurrentView('admin');
                    setAdminTab('inventory');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Inventory Matrix & Restock
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('admin');
                    setAdminTab('orders');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Order Processing Queue
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('admin');
                    setAdminTab('analytics');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Customer Sales Analytics
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('order-status')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Track Build & Freight
                </button>
              </li>
            </ul>
          </div>

          {/* Guarantees */}
          <div className="space-y-2">
            <h4 className="text-white font-mono uppercase text-[11px] tracking-wider font-semibold">
              Security & Freight
            </h4>
            <ul className="space-y-1.5 text-neutral-400">
              <li>Direct Signature Freight Delivery</li>
              <li>Laminated 48h Stress Test Reports</li>
              <li>Zero Bloatware Guarantee</li>
              <li>3-Year Advance Hardware Replacement</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500 font-mono">
          <div>
            &copy; {new Date().getFullYear()} ApexRig Systems Inc. All hardware benchmarks certified.
          </div>
          <div className="flex items-center gap-3">
            <span>Visa</span>
            <span aria-hidden="true">·</span>
            <span>Mastercard</span>
            <span aria-hidden="true">·</span>
            <span>American Express</span>
            <span aria-hidden="true">·</span>
            <span>Apple Pay</span>
            <span aria-hidden="true">·</span>
            <span>Wire ACH</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
