import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { CartDrawer } from './components/layout/CartDrawer';
import { ScrollToTop } from './components/common/ScrollToTop';
import { YarnBallExperience } from './components/3d/YarnBallExperience';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CustomOrderStudioPage } from './pages/CustomOrderStudioPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AccountPage } from './pages/AccountPage';
import { AdminPage } from './pages/AdminPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PoliciesPage } from './pages/PoliciesPage';

import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import { ProductProvider } from './context/ProductContext';
import { IntroProvider, useIntro } from './context/IntroContext';

function AppContent() {
  const { showIntro, replayTrigger, completeIntro } = useIntro();

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F0E7] text-[#392923] selection:bg-[#F0C9CB] selection:text-[#321923]">
      {/* Signature 3D Yarn-ball Entrance Overlay */}
      {showIntro && (
        <YarnBallExperience
          onComplete={completeIntro}
          replayTrigger={replayTrigger}
        />
      )}

      {/* Main Header / Navigation */}
      <Navbar />

      {/* Primary Content Viewports */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/custom-orders" element={<CustomOrderStudioPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/policies" element={<PoliciesPage />} />
        </Routes>
      </main>

      {/* Shopping Cart Slider Drawer */}
      <CartDrawer />

      {/* Mobile Bottom Navigation (Safe-bottom padded) */}
      <MobileBottomNav />

      {/* Main Luxury Brand Footer */}
      <Footer />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <AdminProvider>
          <ProductProvider>
            <WishlistProvider>
              <CartProvider>
                <IntroProvider>
                  <AppContent />
                </IntroProvider>
              </CartProvider>
            </WishlistProvider>
          </ProductProvider>
        </AdminProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
