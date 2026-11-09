import React from 'react';
import { BarChart3, Package, SlidersHorizontal, ArrowLeft, RotateCcw } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { InventoryManager } from './InventoryManager';
import { OrderManager } from './OrderManager';

export const AdminPortal: React.FC = () => {
  const { adminTab, setAdminTab, setCurrentView, resetToDefaults } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Breadcrumb & Control Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('store')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white text-xs font-medium transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Storefront</span>
          </button>
          <span className="text-neutral-700">/</span>
          <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
            Operations & Analytics Portal
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Tabs */}
          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => setAdminTab('analytics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                adminTab === 'analytics'
                  ? 'bg-amber-400 text-neutral-950 font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Customer Analytics</span>
            </button>

            <button
              onClick={() => setAdminTab('inventory')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                adminTab === 'inventory'
                  ? 'bg-amber-400 text-neutral-950 font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Inventory Matrix</span>
            </button>

            <button
              onClick={() => setAdminTab('orders')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                adminTab === 'orders'
                  ? 'bg-amber-400 text-neutral-950 font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Order Queue</span>
            </button>
          </div>

          {/* Quick reset button for reviewer testing */}
          <button
            onClick={() => {
              if (window.confirm('Reset all demo inventory and orders back to initial seed data?')) {
                resetToDefaults();
              }
            }}
            className="p-2 text-neutral-500 hover:text-amber-400 bg-neutral-900 border border-neutral-800 rounded-lg transition-colors cursor-pointer"
            title="Reset to initial seed inventory & orders"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      {adminTab === 'analytics' && <AnalyticsDashboard />}
      {adminTab === 'inventory' && <InventoryManager />}
      {adminTab === 'orders' && <OrderManager />}
    </div>
  );
};
