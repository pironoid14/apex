import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { CatalogView } from './components/CatalogView';
import { AdminPortal } from './components/admin/AdminPortal';
import { OrderTrackingView } from './components/OrderTrackingView';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { Footer } from './components/Footer';

const MainLayout: React.FC = () => {
  const { currentView } = useStore();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-400 selection:text-neutral-950">
      <Navbar />

      <main className="flex-1">
        {currentView === 'store' && <CatalogView />}
        {currentView === 'admin' && <AdminPortal />}
        {currentView === 'order-status' && <OrderTrackingView />}
      </main>

      <Footer />

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <CheckoutModal />
      <ProductDetailModal />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainLayout />
    </StoreProvider>
  );
}
