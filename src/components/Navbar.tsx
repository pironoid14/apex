import React from 'react';
import { ShoppingBag, ShieldCheck, BarChart3, Package, SlidersHorizontal } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    cartTotals,
    setIsCartOpen,
    setAdminTab,
    adminTab
  } = useStore();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setCurrentView('store')}
          className="text-left group flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-90"
        >
          <span className="text-xl font-extrabold tracking-tight text-white whitespace-nowrap shrink-0">
            APEX<span className="text-amber-400">RIG</span>
          </span>
          <span className="hidden sm:inline-block text-[10px] tracking-widest uppercase font-mono px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
            COMPUTING
          </span>
        </button>

        {/* Zone 2: Clean single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-400">
          <button
            onClick={() => setCurrentView('store')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === 'store' ? 'text-white' : 'hover:text-neutral-200'
            }`}
          >
            Systems Catalog
          </button>

          <button
            onClick={() => {
              setCurrentView('admin');
              setAdminTab('inventory');
            }}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === 'admin' && adminTab === 'inventory' ? 'text-white' : 'hover:text-neutral-200'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Inventory</span>
          </button>

          <button
            onClick={() => {
              setCurrentView('admin');
              setAdminTab('orders');
            }}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === 'admin' && adminTab === 'orders' ? 'text-white' : 'hover:text-neutral-200'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Orders</span>
          </button>

          <button
            onClick={() => {
              setCurrentView('admin');
              setAdminTab('analytics');
            }}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === 'admin' && adminTab === 'analytics' ? 'text-white' : 'hover:text-neutral-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Analytics</span>
          </button>

          <button
            onClick={() => setCurrentView('order-status')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === 'order-status' ? 'text-white' : 'hover:text-neutral-200'
            }`}
          >
            Track Build
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action (Cart Drawer trigger) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick toggle for mobile between store and admin */}
          <div className="md:hidden flex items-center bg-neutral-900 rounded-lg p-0.5 border border-neutral-800">
            <button
              onClick={() => setCurrentView('store')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md ${
                currentView === 'store' ? 'bg-neutral-800 text-white' : 'text-neutral-400'
              }`}
            >
              Store
            </button>
            <button
              onClick={() => setCurrentView('admin')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md ${
                currentView === 'admin' ? 'bg-neutral-800 text-white' : 'text-neutral-400'
              }`}
            >
              Admin
            </button>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="Open Cart"
            className="relative flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-neutral-950" />
            <span className="hidden sm:inline">Cart</span>
            {cartTotals.itemsCount > 0 && (
              <span className="flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-neutral-950 text-amber-400 font-mono text-[11px] font-bold tabular-nums">
                {cartTotals.itemsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
