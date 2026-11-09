import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  Order,
  OrderStatus,
  StockStatus
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from '../data/seedData';

interface PromoCode {
  code: string;
  type: 'percent' | 'flat';
  value: number;
  label: string;
}

const PROMO_CODES: PromoCode[] = [
  { code: 'APEX10', type: 'percent', value: 10, label: '10% System Discount' },
  { code: 'TITAN150', type: 'flat', value: 150, label: '$150 Off Enterprise Rig' },
  { code: 'FREESHIP', type: 'flat', value: 99, label: 'Free Insured Freight' }
];

interface StoreContextType {
  // Navigation & UI
  currentView: 'store' | 'admin' | 'order-status';
  setCurrentView: (view: 'store' | 'admin' | 'order-status') => void;
  adminTab: 'analytics' | 'inventory' | 'orders';
  setAdminTab: (tab: 'analytics' | 'inventory' | 'orders') => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  activeOrderForReceipt: Order | null;
  setActiveOrderForReceipt: (order: Order | null) => void;

  // Products & Inventory
  products: Product[];
  updateStock: (productId: string, newStock: number) => void;
  adjustStock: (productId: string, delta: number) => void;
  updateProduct: (product: Product) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  resetToDefaults: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, warranty?: 'standard' | 'extended_2yr' | 'pro_on_site_3yr', notes?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  appliedPromo: PromoCode | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  cartTotals: {
    itemsCount: number;
    subtotal: number;
    discount: number;
    tax: number;
    shipping: number;
    total: number;
  };

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'timeline'>) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => void;
  updateOrderTracking: (orderId: string, carrier: string, trackingNumber: string) => void;
  cancelOrder: (orderId: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'apexrig_products_v1',
  ORDERS: 'apexrig_orders_v1',
  CART: 'apexrig_cart_v1'
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Views
  const [currentView, setCurrentView] = useState<'store' | 'admin' | 'order-status'>('store');
  const [adminTab, setAdminTab] = useState<'analytics' | 'inventory' | 'orders'>('analytics');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeOrderForReceipt, setActiveOrderForReceipt] = useState<Order | null>(null);

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_PRODUCTS;
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_ORDERS;
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);

  // Persist products
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch {
      // Ignore
    }
  }, [products]);

  // Persist orders
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch {
      // Ignore
    }
  }, [orders]);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch {
      // Ignore
    }
  }, [cart]);

  // Helper to calculate stock status
  const calculateStockStatus = (stock: number): StockStatus => {
    if (stock <= 0) return 'out_of_stock';
    if (stock <= 3) return 'low_stock';
    return 'in_stock';
  };

  // Inventory actions
  const updateStock = (productId: string, newStock: number) => {
    const safeStock = Math.max(0, newStock);
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              stock: safeStock,
              status: calculateStockStatus(safeStock)
            }
          : p
      )
    );
  };

  const adjustStock = (productId: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const safeStock = Math.max(0, p.stock + delta);
        return {
          ...p,
          stock: safeStock,
          status: calculateStockStatus(safeStock)
        };
      })
    );
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? { ...updated, status: calculateStockStatus(updated.stock) } : p))
    );
  };

  const addProduct = (newProduct: Product) => {
    setProducts((prev) => [
      {
        ...newProduct,
        status: calculateStockStatus(newProduct.stock)
      },
      ...prev
    ]);
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const resetToDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setCart([]);
    setAppliedPromo(null);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.CART);
  };

  // Cart actions
  const addToCart = (
    product: Product,
    warranty: 'standard' | 'extended_2yr' | 'pro_on_site_3yr' = 'standard',
    notes?: string
  ) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.selectedWarranty === warranty
      );
      if (existing) {
        return prev.map((item) =>
          item.id === existing.id
            ? { ...item, quantity: Math.min(product.stock, item.quantity + 1) }
            : item
        );
      }
      return [
        ...prev,
        {
          id: `${product.id}-${warranty}-${Date.now()}`,
          product,
          quantity: 1,
          selectedWarranty: warranty,
          notes
        }
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const maxAvailable = item.product.stock;
          return { ...item, quantity: Math.min(maxAvailable, quantity) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
  };

  const applyPromoCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    const found = PROMO_CODES.find((p) => p.code === clean);
    if (found) {
      setAppliedPromo(found);
      return { success: true, message: `Applied ${found.label}!` };
    }
    return { success: false, message: 'Invalid coupon code. Try APEX10 or TITAN150.' };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  // Cart totals calculation
  const cartTotals = React.useMemo(() => {
    const itemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = cart.reduce((acc, item) => {
      let itemPrice = item.product.price;
      if (item.selectedWarranty === 'extended_2yr') itemPrice += 249;
      if (item.selectedWarranty === 'pro_on_site_3yr') itemPrice += 499;
      return acc + itemPrice * item.quantity;
    }, 0);

    let discount = 0;
    if (appliedPromo) {
      if (appliedPromo.type === 'percent') {
        discount = (subtotal * appliedPromo.value) / 100;
      } else {
        discount = Math.min(subtotal, appliedPromo.value);
      }
    }

    // Free shipping on orders over $2500, else $99
    const shipping = subtotal > 2500 || itemsCount === 0 ? 0 : 99;
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = taxableAmount * 0.0825; // standard tech equipment tax
    const total = taxableAmount + shipping + tax;

    return {
      itemsCount,
      subtotal,
      discount,
      tax,
      shipping,
      total
    };
  }, [cart, appliedPromo]);

  // Orders and inventory decrement
  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'timeline'>): Order => {
    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      createdAt: now,
      timeline: [
        {
          status: 'pending',
          timestamp: now,
          title: 'Payment Cleared & Order Placed',
          description: `Transaction ${orderData.paymentDetails.transactionId} authorized via ${orderData.paymentDetails.brand}.`
        },
        {
          status: 'assembling',
          timestamp: now,
          title: 'Hardware Queued for Clean-Room Build',
          description: 'Components pulled from secure inventory and assigned build serial.'
        }
      ]
    };

    // Decrement inventory for all items in order
    setProducts((prev) =>
      prev.map((product) => {
        const orderedItem = orderData.items.find((item) => item.productId === product.id);
        if (orderedItem) {
          const newStock = Math.max(0, product.stock - orderedItem.quantity);
          return {
            ...product,
            stock: newStock,
            status: calculateStockStatus(newStock)
          };
        }
        return product;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setActiveOrderForReceipt(newOrder);

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    const now = new Date().toISOString();
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const defaultNoteMap: Record<OrderStatus, { title: string; desc: string }> = {
          pending: { title: 'Order Awaiting Verification', desc: 'Hold placed for compliance review.' },
          assembling: { title: 'Assembly & Cable Management', desc: 'Motherboard, cooling tubes and GPUs locked in place.' },
          stress_testing: { title: '24h Burn-in & Stress Testing', desc: 'Running Prime95, FurMark, and memtest86 at max thermal headroom.' },
          shipped: { title: 'Dispatched via Insured Carrier', desc: `In transit. Tracking: ${order.trackingNumber || 'Pending pickup'}` },
          delivered: { title: 'Delivered and Signed For', desc: 'Secure delivery confirmed at destination.' },
          cancelled: { title: 'Order Cancelled', desc: note || 'Order has been cancelled and funds refunded.' }
        };

        const newEvent = {
          status: newStatus,
          timestamp: now,
          title: defaultNoteMap[newStatus].title,
          description: note || defaultNoteMap[newStatus].desc
        };

        return {
          ...order,
          orderStatus: newStatus,
          timeline: [...order.timeline, newEvent]
        };
      })
    );
  };

  const updateOrderTracking = (orderId: string, carrier: string, trackingNumber: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, carrier, trackingNumber } : o))
    );
  };

  const cancelOrder = (orderId: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder || targetOrder.orderStatus === 'cancelled') return;

    // Return items to stock
    setProducts((prev) =>
      prev.map((product) => {
        const item = targetOrder.items.find((i) => i.productId === product.id);
        if (item) {
          const newStock = product.stock + item.quantity;
          return {
            ...product,
            stock: newStock,
            status: calculateStockStatus(newStock)
          };
        }
        return product;
      })
    );

    updateOrderStatus(orderId, 'cancelled', 'Customer requested cancellation; stock replenished to inventory.');
  };

  return (
    <StoreContext.Provider
      value={{
        currentView,
        setCurrentView,
        adminTab,
        setAdminTab,
        selectedProductId,
        setSelectedProductId,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        activeOrderForReceipt,
        setActiveOrderForReceipt,
        products,
        updateStock,
        adjustStock,
        updateProduct,
        addProduct,
        deleteProduct,
        resetToDefaults,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
        cartTotals,
        orders,
        createOrder,
        updateOrderStatus,
        updateOrderTracking,
        cancelOrder
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
