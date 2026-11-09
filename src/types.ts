export type ProductCategory = 'workstation' | 'gaming' | 'laptop' | 'server' | 'mini-itx';
export type FormFactor = 'Full Tower' | 'Mid Tower' | 'Mini-ITX' | 'Laptop' | '4U Rackmount';
export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface ProductSpecs {
  cpu: string;
  gpu: string;
  ram: number; // in GB
  ramType?: string; // e.g. DDR5-6000MHz
  storage: string;
  formFactor: FormFactor;
  cooling: string;
  powerSupply: string;
  motherboard?: string;
  ports?: string[];
}

export interface ProductBenchmarks {
  cinebenchR23?: number;
  timespyScore?: number;
  blenderRenderSec?: number;
  cyberpunkFps4k?: number;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: ProductCategory;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  specs: ProductSpecs;
  benchmarks: ProductBenchmarks;
  stock: number;
  status: StockStatus;
  featured: boolean;
  description: string;
  warranty: string;
  includedAccessories: string[];
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedWarranty: 'standard' | 'extended_2yr' | 'pro_on_site_3yr';
  notes?: string;
}

export type OrderStatus = 'pending' | 'assembling' | 'stress_testing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'credit_card' | 'apple_pay' | 'google_pay' | 'wire_transfer';
export type PaymentStatus = 'authorized' | 'captured' | 'failed' | 'refunded';

export interface CustomerInfo {
  fullName: string;
  companyName?: string;
  email: string;
  phone: string;
  address: string;
  suite?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  timestamp: string;
  title: string;
  description: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  specsSummary: string;
  warranty: string;
  image: string;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentDetails: {
    last4: string;
    brand: string;
    transactionId: string;
    authCode?: string;
  };
  orderStatus: OrderStatus;
  shippingSpeed: 'standard_freight' | 'expedited_air' | 'white_glove';
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
  timeline: OrderTimelineEvent[];
}

export interface FilterState {
  searchQuery: string;
  category: string;
  brands: string[];
  cpuTypes: string[];
  gpuTypes: string[];
  ramMin: number;
  priceMin: number;
  priceMax: number;
  inStockOnly: boolean;
  sortBy: 'featured' | 'price_asc' | 'price_desc' | 'rating' | 'performance';
}
