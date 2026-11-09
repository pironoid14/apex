import React, { useState } from 'react';
import {
  Search,
  Filter,
  CheckCircle,
  Truck,
  Clock,
  AlertOctagon,
  Eye,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';

export const OrderManager: React.FC = () => {
  const { orders, updateOrderStatus, updateOrderTracking, cancelOrder, setActiveOrderForReceipt, setCurrentView } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Tracking edit form
  const [editCarrier, setEditCarrier] = useState('');
  const [editTrackingNum, setEditTrackingNum] = useState('');

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.customer.companyName && order.customer.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      order.items.some((i) => i.productName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleAdvanceStatus = (order: Order) => {
    const flow: OrderStatus[] = ['pending', 'assembling', 'stress_testing', 'shipped', 'delivered'];
    const currentIndex = flow.indexOf(order.orderStatus);
    if (currentIndex >= 0 && currentIndex < flow.length - 1) {
      const nextStatus = flow[currentIndex + 1];
      updateOrderStatus(order.id, nextStatus);
      if (selectedOrder && selectedOrder.id === order.id) {
        setSelectedOrder({ ...selectedOrder, orderStatus: nextStatus });
      }
    }
  };

  const handleSaveTracking = (orderId: string) => {
    if (editTrackingNum.trim()) {
      updateOrderTracking(orderId, editCarrier || 'FedEx Priority Freight', editTrackingNum.trim());
      setEditTrackingNum('');
      setEditCarrier('');
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'text-amber-400 bg-amber-400/10 border-amber-400/30';
      case 'assembling':
        return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30';
      case 'stress_testing':
        return 'text-purple-400 bg-purple-400/10 border-purple-400/30';
      case 'shipped':
        return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
      case 'delivered':
        return 'text-emerald-300 bg-emerald-950/60 border-emerald-800';
      case 'cancelled':
        return 'text-rose-400 bg-rose-400/10 border-rose-400/30';
      default:
        return 'text-neutral-400 bg-neutral-800 border-neutral-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Status Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search orders by ID, client, email, or PC model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'pending', label: 'Pending' },
            { id: 'assembling', label: 'Assembling' },
            { id: 'stress_testing', label: 'Testing' },
            { id: 'shipped', label: 'Shipped' },
            { id: 'delivered', label: 'Delivered' },
            { id: 'cancelled', label: 'Cancelled' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-amber-400 text-neutral-950 font-semibold'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950/80 text-neutral-400 border-b border-neutral-800 font-mono">
              <tr>
                <th className="px-4 py-3 font-medium">Order ID & Date</th>
                <th className="px-4 py-3 font-medium">Customer & Entity</th>
                <th className="px-4 py-3 font-medium">Hardware Ordered</th>
                <th className="px-4 py-3 font-medium">Payment & Total</th>
                <th className="px-4 py-3 font-medium">Build Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
                    No matching orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-800/40 transition-colors">
                    {/* ID and Date */}
                    <td className="px-4 py-3 font-mono">
                      <div className="font-bold text-white">{order.id}</div>
                      <div className="text-[11px] text-neutral-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="px-4 py-3">
                      <div className="font-semibold text-white">{order.customer.fullName}</div>
                      {order.customer.companyName && (
                        <div className="text-[11px] text-amber-400/90 font-mono truncate max-w-[160px]">
                          {order.customer.companyName}
                        </div>
                      )}
                      <div className="text-[11px] text-neutral-400 truncate max-w-[160px]">
                        {order.customer.email}
                      </div>
                    </td>

                    {/* Hardware Items */}
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            <span className="font-semibold text-white truncate max-w-[200px]">
                              {item.productName}
                            </span>
                            <span className="text-[10px] font-mono text-neutral-400">
                              (x{item.quantity})
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Total & Payment */}
                    <td className="px-4 py-3 font-mono">
                      <div className="font-bold text-white tabular-nums">
                        ${order.total.toFixed(2)}
                      </div>
                      <div className="text-[11px] text-neutral-400 capitalize">
                        {order.paymentDetails.brand} · •••• {order.paymentDetails.last4}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2.5 py-1 rounded text-[11px] font-mono uppercase tracking-wider border font-semibold ${getStatusColor(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled' && (
                          <button
                            onClick={() => handleAdvanceStatus(order)}
                            className="px-2.5 py-1 rounded bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] font-mono transition-colors cursor-pointer"
                            title="Advance to next production stage"
                          >
                            Advance Stage &rarr;
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                          title="Inspect full details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div>
                <span className="text-xs font-mono text-neutral-400 uppercase">Order Inspection</span>
                <h3 className="text-lg font-bold font-mono text-white">{selectedOrder.id}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-neutral-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            {/* Status Pipeline Controller */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
              <span className="text-xs font-mono text-neutral-400 uppercase block">Production Pipeline Controller</span>
              <div className="flex flex-wrap items-center gap-2">
                {(['pending', 'assembling', 'stress_testing', 'shipped', 'delivered'] as OrderStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, st);
                      setSelectedOrder({ ...selectedOrder, orderStatus: st });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-all cursor-pointer ${
                      selectedOrder.orderStatus === st
                        ? 'bg-amber-400 text-neutral-950 font-bold'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}

                {selectedOrder.orderStatus !== 'cancelled' && (
                  <button
                    onClick={() => {
                      cancelOrder(selectedOrder.id);
                      setSelectedOrder({ ...selectedOrder, orderStatus: 'cancelled' });
                    }}
                    className="ml-auto px-3 py-1.5 rounded-lg text-xs font-mono text-rose-400 border border-rose-900/60 hover:bg-rose-950/40 transition-colors cursor-pointer"
                  >
                    Cancel & Restock
                  </button>
                )}
              </div>
            </div>

            {/* Carrier Tracking Updater */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3 text-xs">
              <span className="font-semibold text-white block">Logistics & Tracking ID</span>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Carrier (e.g. FedEx Freight)"
                  value={editCarrier || selectedOrder.carrier || ''}
                  onChange={(e) => setEditCarrier(e.target.value)}
                  className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white font-mono"
                />
                <input
                  type="text"
                  placeholder="Tracking Number"
                  value={editTrackingNum || selectedOrder.trackingNumber || ''}
                  onChange={(e) => setEditTrackingNum(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleSaveTracking(selectedOrder.id)}
                  className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-mono transition-colors cursor-pointer"
                >
                  Save
                </button>
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-neutral-500 font-mono text-[10px] uppercase">Client Details</span>
                <div className="text-white font-semibold">{selectedOrder.customer.fullName}</div>
                {selectedOrder.customer.companyName && (
                  <div className="text-neutral-300">{selectedOrder.customer.companyName}</div>
                )}
                <div className="text-neutral-400">{selectedOrder.customer.email}</div>
                <div className="text-neutral-400 font-mono">{selectedOrder.customer.phone}</div>
              </div>

              <div className="space-y-1">
                <span className="text-neutral-500 font-mono text-[10px] uppercase">Delivery Address</span>
                <div className="text-neutral-300">{selectedOrder.customer.address}</div>
                <div className="text-neutral-400">
                  {selectedOrder.customer.city}, {selectedOrder.customer.state} {selectedOrder.customer.zipCode}
                </div>
                <div className="text-neutral-400">{selectedOrder.customer.country}</div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
              <button
                onClick={() => {
                  setActiveOrderForReceipt(selectedOrder);
                  setSelectedOrder(null);
                  setCurrentView('order-status');
                }}
                className="text-xs text-amber-400 hover:underline font-mono cursor-pointer"
              >
                View Customer Receipt View &rarr;
              </button>

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-neutral-800 text-white rounded-lg text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
