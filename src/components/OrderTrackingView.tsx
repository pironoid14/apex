import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Box,
  ShieldCheck,
  FileText,
  Printer,
  Copy,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order, OrderStatus } from '../types';

export const OrderTrackingView: React.FC = () => {
  const { orders, activeOrderForReceipt, setActiveOrderForReceipt, setCurrentView } = useStore();

  const [searchQuery, setSearchQuery] = useState(activeOrderForReceipt ? activeOrderForReceipt.id : '');
  const [copied, setCopied] = useState(false);

  // Active displayed order: either selected or search match or first order
  const displayOrder: Order | undefined =
    orders.find((o) => o.id.toLowerCase() === searchQuery.trim().toLowerCase()) ||
    activeOrderForReceipt ||
    orders[0];

  const handleCopyId = (id: string) => {
    navigator.clipboard?.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <span className="text-amber-400 font-mono text-xs font-semibold">Payment Cleared · Queued</span>;
      case 'assembling':
        return <span className="text-cyan-400 font-mono text-xs font-semibold">In Clean-Room Assembly</span>;
      case 'stress_testing':
        return <span className="text-purple-400 font-mono text-xs font-semibold">48h Thermal QA Testing</span>;
      case 'shipped':
        return <span className="text-emerald-400 font-mono text-xs font-semibold">In Transit with Carrier</span>;
      case 'delivered':
        return <span className="text-emerald-300 font-mono text-xs font-semibold">Delivered & Signed</span>;
      case 'cancelled':
        return <span className="text-rose-400 font-mono text-xs font-semibold">Order Cancelled</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fade-in">
      {/* Top Banner & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="text-xs uppercase tracking-widest text-amber-400 font-mono font-medium">
            Post-Order Transparency
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Live Computer Build & Shipment Tracking</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Track individual thermal certification, assembly milestones, and freight dispatch.
          </p>
        </div>

        {/* Order Search Box */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Look up Order ID (e.g. ORD-89241)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 w-64"
            />
          </div>
        </div>
      </div>

      {!displayOrder ? (
        <div className="p-12 text-center rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
          <div className="p-3 w-12 h-12 rounded-full bg-neutral-950 border border-neutral-800 mx-auto text-neutral-500 flex items-center justify-center">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-white">No Order Found</h3>
          <p className="text-xs text-neutral-400">
            Check the Order ID in your confirmation email or browse through your existing orders.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Order Header Summary Card */}
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold font-mono text-white">{displayOrder.id}</span>
                  <button
                    onClick={() => handleCopyId(displayOrder.id)}
                    className="p-1 text-neutral-400 hover:text-white transition-colors"
                    title="Copy Order ID"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  {copied && <span className="text-[10px] text-amber-400 font-mono">Copied!</span>}
                </div>
                <div className="text-xs text-neutral-400">
                  Placed on {new Date(displayOrder.createdAt).toLocaleDateString()} at{' '}
                  {new Date(displayOrder.createdAt).toLocaleTimeString()}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800">
                  {getStatusBadge(displayOrder.orderStatus)}
                </div>

                <button
                  onClick={() => window.print()}
                  className="p-2 text-neutral-400 hover:text-white rounded-lg bg-neutral-950 border border-neutral-800 transition-colors"
                  title="Print official receipt invoice"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Logistics & Delivery details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-neutral-300">
              <div>
                <span className="text-neutral-500 block uppercase font-mono text-[10px]">Recipient</span>
                <span className="font-semibold text-white block mt-0.5">{displayOrder.customer.fullName}</span>
                {displayOrder.customer.companyName && (
                  <span className="text-neutral-400 block">{displayOrder.customer.companyName}</span>
                )}
                <span className="text-neutral-400 block">{displayOrder.customer.email}</span>
              </div>

              <div>
                <span className="text-neutral-500 block uppercase font-mono text-[10px]">Freight Destination</span>
                <span className="block mt-0.5">{displayOrder.customer.address}</span>
                <span className="text-neutral-400 block">
                  {displayOrder.customer.city}, {displayOrder.customer.state} {displayOrder.customer.zipCode}
                </span>
                <span className="text-neutral-400 block">{displayOrder.customer.country}</span>
              </div>

              <div>
                <span className="text-neutral-500 block uppercase font-mono text-[10px]">Insured Dispatch</span>
                <span className="font-semibold text-white block mt-0.5">
                  {displayOrder.carrier || 'Pending Dispatch Assignment'}
                </span>
                <span className="font-mono text-amber-400 block mt-0.5">
                  {displayOrder.trackingNumber ? `Track: ${displayOrder.trackingNumber}` : 'Tracking generated upon QA signoff'}
                </span>
                {displayOrder.estimatedDelivery && (
                  <span className="text-neutral-400 block text-[11px]">
                    Est. Arrival: {displayOrder.estimatedDelivery}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Assembly Milestones Timeline */}
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Production & Validation Milestone History</span>
            </h3>

            <div className="space-y-4 pl-2">
              {displayOrder.timeline.map((event, idx) => (
                <div key={idx} className="relative pl-6 pb-2 last:pb-0 border-l border-neutral-800">
                  <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-amber-400 ring-4 ring-neutral-900" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-xs font-bold text-white">{event.title}</span>
                    <span className="text-[11px] font-mono text-neutral-500">
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">{event.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Ordered Systems & Pricing Receipt */}
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Allocated Hardware Units
            </h3>

            <div className="divide-y divide-neutral-800">
              {displayOrder.items.map((item, idx) => (
                <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.productName}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-lg object-cover bg-neutral-950 border border-neutral-800 shrink-0"
                    />
                    <div>
                      <h4 className="text-xs font-semibold text-white">{item.productName}</h4>
                      <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                        {item.specsSummary}
                      </div>
                      <div className="text-[10px] text-amber-400/90 font-mono mt-0.5">
                        Warranty: {item.warranty}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-neutral-400">Qty: {item.quantity}</div>
                    <div className="text-sm font-bold font-mono text-white tabular-nums mt-0.5">
                      ${(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Financial Summary */}
            <div className="pt-4 border-t border-neutral-800 space-y-2 text-xs text-neutral-400 max-w-xs ml-auto">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-neutral-200 tabular-nums">
                  ${displayOrder.subtotal.toLocaleString()}
                </span>
              </div>
              {displayOrder.discount > 0 && (
                <div className="flex justify-between text-amber-400">
                  <span>Discount</span>
                  <span className="font-mono tabular-nums">
                    -${displayOrder.discount.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Freight Logistics</span>
                <span className="font-mono text-neutral-200 tabular-nums">
                  {displayOrder.shipping === 0 ? 'FREE' : `$${displayOrder.shipping}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="font-mono text-neutral-200 tabular-nums">
                  ${displayOrder.tax.toFixed(2)}
                </span>
              </div>
              <div className="pt-2 border-t border-neutral-800 flex justify-between text-sm font-bold text-white">
                <span>Paid via {displayOrder.paymentDetails.brand} (•••• {displayOrder.paymentDetails.last4})</span>
                <span className="font-mono text-amber-400 tabular-nums">
                  ${displayOrder.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setCurrentView('store')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-white transition-colors cursor-pointer"
            >
              <span>Return to Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
