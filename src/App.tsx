import { useState } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { CategoryNav } from './components/CategoryNav';
import { Hero } from './components/Hero';
import { CategoryGrid } from './components/CategoryGrid';
import { FeaturedProducts } from './components/FeaturedProducts';
import { FestiveCampaign } from './components/FestiveCampaign';
import { BrandBenefits } from './components/BrandBenefits';
import { BrandStory } from './components/BrandStory';
import { Footer } from './components/Footer';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { MobileMenu } from './components/MobileMenu';
import { Modals } from './components/Modals';
import { Toast } from './components/Toast';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminLogin } from './admin/AdminLogin';
import { getAdminToken, adminApi } from './admin/adminApi';
import './App.css';

function MainLayout() {
  const { viewMode, setViewMode } = useShop();
  const [adminToken, setAdminTokenState] = useState<string | null>(() => getAdminToken());

  // Handle Admin Logout
  const handleAdminLogout = () => {
    adminApi.logout();
    setAdminTokenState(null);
    setViewMode('public');
  };

  // If in Admin route
  if (viewMode === 'admin') {
    if (!adminToken) {
      return (
        <AdminLogin
          onLoginSuccess={() => {
            setAdminTokenState(getAdminToken());
            setViewMode('admin');
          }}
          onBackToStore={() => setViewMode('public')}
        />
      );
    }

    return (
      <AdminDashboard
        onLogout={handleAdminLogout}
        onViewPublicSite={() => setViewMode('public')}
      />
    );
  }

  // Public Storefront (Preserving exact approved design)
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F0E5] text-[#282522] selection:bg-[#702C38] selection:text-white">
      {/* Navigation & Header */}
      <Header />
      <CategoryNav />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* Shop by Category */}
        <CategoryGrid />

        {/* Featured Collections & Products Grid */}
        <FeaturedProducts />

        {/* Festive Campaign */}
        <FestiveCampaign />

        {/* Brand Benefits */}
        <BrandBenefits />

        {/* Brand Story & Heritage */}
        <BrandStory />
      </main>

      {/* Comprehensive Footer */}
      <Footer />

      {/* Drawers, Modals & Alerts */}
      <CartDrawer />
      <WishlistDrawer />
      <ProductModal />
      <MobileMenu />
      <Modals />
      <Toast />
    </div>
  );
}

export function App() {
  return (
    <ShopProvider>
      <MainLayout />
    </ShopProvider>
  );
}

export default App;
