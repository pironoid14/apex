import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    cartTotals,
    setIsCheckoutOpen
  } = useStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; error?: boolean } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    setPromoMessage({ text: res.message, error: !res.success });
    if (res.success) setPromoInput('');
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-neutral-950/70 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-neutral-900 border-l border-neutral-800 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-white">Your System Bag</h2>
              <span className="text-xs font-mono text-neutral-400">
                ({cartTotals.itemsCount} {cartTotals.itemsCount === 1 ? 'item' : 'items'})
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="p-4 rounded-full bg-neutral-950 border border-neutral-800 text-neutral-600">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Your cart is empty</h3>
                  <p className="text-xs text-neutral-400 mt-1 max-w-xs">
                    Choose from our pre-configured liquid-cooled gaming rigs, studio workstations, or rackmount AI servers.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
                >
                  Browse Hardware Catalog
                </button>
              </div>
            ) : (
              cart.map((item) => {
                let unitPrice = item.product.price;
                if (item.selectedWarranty === 'extended_2yr') unitPrice += 249;
                if (item.selectedWarranty === 'pro_on_site_3yr') unitPrice += 499;

                const itemTotal = unitPrice * item.quantity;
                const maxStock = item.product.stock;

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/60 space-y-3"
                  >
                    <div className="flex gap-3">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-lg object-cover bg-neutral-900 border border-neutral-800 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-semibold text-white truncate" title={item.product.name}>
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-neutral-500 hover:text-rose-400 transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-[11px] text-neutral-400 font-mono truncate mt-0.5">
                          {item.product.specs.cpu.split('(')[0]} · {item.product.specs.gpu}
                        </div>

                        {item.selectedWarranty !== 'standard' && (
                          <div className="text-[10px] text-amber-400/90 font-mono mt-0.5">
                            Warranty: {item.selectedWarranty === 'extended_2yr' ? '+2yr Coverage (+$249)' : '+3yr On-Site SLA (+$499)'}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quantity Stepper and Price */}
                    <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-neutral-500">Qty:</span>
                        <div className="flex items-center border border-neutral-800 rounded-lg bg-neutral-900">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-mono font-semibold text-white tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= maxStock}
                            className={`p-1 transition-colors cursor-pointer ${
                              item.quantity >= maxStock
                                ? 'text-neutral-700 cursor-not-allowed'
                                : 'text-neutral-400 hover:text-white'
                            }`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        {item.quantity >= maxStock && (
                          <span className="text-[10px] text-amber-500 font-mono">Max stock</span>
                        )}
                      </div>

                      <div className="text-right font-mono font-semibold text-white text-sm tabular-nums">
                        ${itemTotal.toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-neutral-800 bg-neutral-950/80 space-y-4">
              {/* Promo code form */}
              <div>
                {appliedPromo ? (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-xs">
                    <div className="flex items-center gap-1.5 text-amber-400 font-mono">
                      <Tag className="w-3.5 h-3.5" />
                      <span>{appliedPromo.code}: {appliedPromo.label}</span>
                    </div>
                    <button
                      onClick={removePromoCode}
                      className="text-neutral-400 hover:text-white text-[11px] underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon: APEX10 or TITAN150"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-neutral-900 border border-neutral-800 rounded-lg text-white uppercase placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {promoMessage && (
                  <div
                    className={`text-[11px] mt-1 font-mono ${
                      promoMessage.error ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {promoMessage.text}
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-neutral-400">
                <div className="flex justify-between">
                  <span>Hardware Subtotal</span>
                  <span className="font-mono text-neutral-200 tabular-nums">
                    ${cartTotals.subtotal.toLocaleString()}
                  </span>
                </div>
                {cartTotals.discount > 0 && (
                  <div className="flex justify-between text-amber-400">
                    <span>Discount</span>
                    <span className="font-mono tabular-nums">
                      -${cartTotals.discount.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Insured Crate Freight</span>
                  <span className="font-mono text-neutral-200 tabular-nums">
                    {cartTotals.shipping === 0 ? 'FREE (Orders > $2,500)' : `$${cartTotals.shipping}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8.25%)</span>
                  <span className="font-mono text-neutral-200 tabular-nums">
                    ${cartTotals.tax.toFixed(2)}
                  </span>
                </div>
                <div className="pt-2 border-t border-neutral-800 flex justify-between text-sm font-bold text-white">
                  <span>Total Due</span>
                  <span className="font-mono text-amber-400 tabular-nums">
                    ${cartTotals.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Secure Checkout CTA */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3 rounded-lg bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-400/10 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-neutral-950" />
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-[10px] text-neutral-500 font-mono">
                🔒 256-Bit Encrypted · PCI-DSS Compliant · Crate Insured
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
