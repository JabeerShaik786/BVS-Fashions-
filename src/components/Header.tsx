import React, { useState, useRef, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  User, 
  Menu, 
  X,
  Package,
  Sparkles,
  ArrowRight,
  MessageCircle
} from 'lucide-react';
import { CATEGORIES } from '../data/products';
import type { CategoryId } from '../types';

export const Header: React.FC = () => {
  const {
    cartCount,
    wishlistCount,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsMobileMenuOpen,
    setIsAccountModalOpen,
    setActiveInfoModal,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    products,
    setQuickViewProduct,
    setViewMode,
  } = useShop();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchSuggestions = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.fabric.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 4)
    : [];

  const handleSelectProduct = (product: typeof products[0]) => {
    setQuickViewProduct(product);
    setIsSearchFocused(false);
  };

  const handleSelectCategory = (catId: CategoryId) => {
    setSelectedCategory(catId);
    setSearchQuery('');
    setIsSearchFocused(false);
    const element = document.getElementById('products-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchFocused(false);
    const element = document.getElementById('products-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFCF8] border-b border-[#E9DED2] transition-all shadow-xs">
      {/* 1. Announcement Bar */}
      <div className="bg-[#491019] text-[#FFF6EB] text-xs py-2 px-4 border-b border-[#D4B16A]/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <Sparkles className="w-3.5 h-3.5 text-[#D4B16A]" />
            <span className="font-serif tracking-wider font-light text-[11px] sm:text-xs">
              The Wedding Edit · 2026 · Pure Handloom Weaves & Family Ethnic Attire
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-5 text-[11px] tracking-wider text-[#FFF6EB]/80">
            <a
              href="https://wa.me/918639778188?text=Hello%20BVS%20Fashions!%20I%20would%20like%20to%20enquire%20about%20your%20collection."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#D4B16A] hover:text-white transition-colors"
            >
              <MessageCircle className="w-3 h-3 fill-current" />
              <span>WhatsApp: +91 8639778188</span>
            </a>
            <span>·</span>
            <button
              onClick={() => setViewMode('admin')}
              className="text-[#FFF6EB]/80 hover:text-[#D4B16A] transition-colors cursor-pointer"
            >
              Admin Portal
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 sm:gap-6 lg:gap-10 h-20 sm:h-24">
          
          {/* Brand Logo & Mobile Menu Button */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 -ml-1 text-[#282522] hover:text-[#701522] md:hidden transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 stroke-[1.8]" />
            </button>

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setSelectedCategory('all');
                setSearchQuery('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 group select-none"
              aria-label="BVS Fashions home"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded bg-[#701522] border border-[#D4B16A]/70 flex items-center justify-center text-[#FFFCF8] font-serif font-bold text-xs sm:text-sm tracking-wider shadow-xs group-hover:bg-[#561019] transition-colors shrink-0">
                BVS
              </div>
              <div className="flex flex-col text-left">
                <span className="font-serif text-lg sm:text-xl font-bold tracking-[0.16em] text-[#701522] group-hover:text-[#561019] transition-colors leading-none">
                  BVS FASHIONS
                </span>
                <span className="text-[8px] sm:text-[8.5px] uppercase tracking-[0.26em] text-[#796E69] mt-1 font-medium">
                  Handloom & Ethnic Atelier
                </span>
              </div>
            </a>
          </div>

          {/* Wide Search Bar (Desktop & Tablet) */}
          <div ref={searchContainerRef} className="flex-1 max-w-2xl relative hidden md:block">
            <form 
              onSubmit={handleSearchSubmit} 
              className="flex items-center w-full bg-white border border-[#E9DED2] rounded-[2px] h-[46px] overflow-hidden focus-within:border-[#701522] transition-colors shadow-2xs"
            >
              <div className="pl-4 pr-2 text-[#796E69] shrink-0">
                <Search className="w-4 h-4 stroke-[1.8]" />
              </div>
              <input
                type="text"
                placeholder="Search for Kanchi, Banarasi, zari..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full bg-transparent text-[#282522] placeholder:text-[#796E69]/75 text-xs sm:text-[13px] py-2 px-1 outline-none min-w-0"
                aria-label="Search products"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1.5 text-[#796E69] hover:text-[#282522] mr-1"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="submit"
                className="bg-[#701522] hover:bg-[#561019] text-white text-xs font-semibold uppercase tracking-wider px-6 h-full flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                Search
              </button>
            </form>

            {/* Live Search Suggestions Dropdown */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-[#E9DED2] overflow-hidden z-50 animate-fade-in">
                {searchQuery.trim() ? (
                  <div>
                    <div className="px-4 py-2 bg-[#FAF6EE] text-[10px] font-semibold text-[#796E69] uppercase tracking-wider border-b border-[#E9DED2]">
                      Search Results ({searchSuggestions.length})
                    </div>
                    {searchSuggestions.length > 0 ? (
                      <div className="divide-y divide-[#E9DED2]/50 max-h-72 overflow-y-auto">
                        {searchSuggestions.map((prod) => (
                          <div
                            key={prod.id}
                            onClick={() => handleSelectProduct(prod)}
                            className="flex items-center gap-3 p-3 hover:bg-[#FAF6EE] cursor-pointer transition-colors"
                          >
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-10 h-12 object-cover rounded border border-[#E9DED2]"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] text-[#701522] font-bold uppercase">{prod.categoryLabel}</p>
                              <p className="text-xs font-serif font-medium text-[#282522] truncate">{prod.name}</p>
                              <p className="text-xs font-bold text-[#701522]">₹{prod.price.toLocaleString('en-IN')}</p>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-[#796E69] shrink-0" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-5 text-center text-xs text-[#796E69]">
                        No matching ethnic wear found for "{searchQuery}".
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4">
                    <p className="text-[10px] font-semibold text-[#796E69] uppercase tracking-wider mb-2">
                      Saree Drape Categories
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {CATEGORIES.slice(1, 7).map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => handleSelectCategory(cat.id as CategoryId)}
                          className="text-[11px] bg-[#FAF6EE] hover:bg-[#701522] hover:text-white px-2.5 py-1 rounded border border-[#E9DED2] transition-colors cursor-pointer"
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Outline Action Icons */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* 1. Wishlist (Heart outline) */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-2 text-[#282522] hover:text-[#701522] transition-colors cursor-pointer"
              aria-label={`Wishlist (${wishlistCount} items)`}
              title="Wishlist"
            >
              <Heart className="w-[21px] h-[21px] stroke-[1.6]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#701522] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#FFFCF8]">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* 2. Track Order (Package icon with small maroon "Track" badge above it) */}
            <button
              onClick={() => setActiveInfoModal('tracking')}
              className="relative p-2 text-[#282522] hover:text-[#701522] transition-colors cursor-pointer group"
              aria-label="Track your order"
              title="Track Order"
            >
              <span className="absolute -top-1.5 -right-1 bg-[#701522] group-hover:bg-[#561019] text-white text-[8px] font-semibold tracking-wider px-1.5 py-[1px] rounded-full uppercase leading-none shadow-xs transition-colors">
                Track
              </span>
              <Package className="w-[21px] h-[21px] stroke-[1.6]" />
            </button>

            {/* 3. My Account (User icon outline) */}
            <button
              onClick={() => setIsAccountModalOpen(true)}
              className="p-2 text-[#282522] hover:text-[#701522] transition-colors cursor-pointer"
              aria-label="Customer account"
              title="My Account"
            >
              <User className="w-[21px] h-[21px] stroke-[1.6]" />
            </button>

            {/* 4. Shopping Bag (Bag outline with counter) */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-[#282522] hover:text-[#701522] transition-colors cursor-pointer"
              aria-label={`Shopping bag (${cartCount} items)`}
              title="Shopping Bag"
            >
              <ShoppingBag className="w-[21px] h-[21px] stroke-[1.6]" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#701522] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#FFFCF8]">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (visible on mobile viewports) */}
        <div className="pb-3 md:hidden">
          <form 
            onSubmit={handleSearchSubmit} 
            className="flex items-center w-full bg-white border border-[#E9DED2] rounded-[2px] h-[42px] overflow-hidden focus-within:border-[#701522] transition-colors shadow-2xs"
          >
            <div className="pl-3.5 pr-2 text-[#796E69] shrink-0">
              <Search className="w-4 h-4 stroke-[1.8]" />
            </div>
            <input
              type="text"
              placeholder="Search for Kanchi, Banarasi, zari..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-[#282522] placeholder:text-[#796E69]/75 text-xs py-2 px-1 outline-none min-w-0"
              aria-label="Search products mobile"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1 text-[#796E69] hover:text-[#282522] mr-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="submit"
              className="bg-[#701522] hover:bg-[#561019] text-white text-xs font-semibold uppercase tracking-wider px-4 h-full flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* 3. Bottom Navigation Row (HOME, PRODUCTS, CATEGORIES, ABOUT US) */}
      <nav className="border-t border-[#E9DED2] bg-[#FFFCF8]" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-7 sm:gap-14 h-[49px] overflow-x-auto scrollbar-none">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="relative text-xs sm:text-[13px] font-medium tracking-[0.16em] uppercase text-[#282522] hover:text-[#701522] transition-colors py-3 group cursor-pointer whitespace-nowrap"
            >
              HOME
              <span className="absolute bottom-0 left-1/2 right-1/2 h-[2px] bg-[#701522] transition-all duration-200 group-hover:left-0 group-hover:right-0" />
            </button>

            <button
              onClick={() => scrollToSection('products-section')}
              className="relative text-xs sm:text-[13px] font-medium tracking-[0.16em] uppercase text-[#282522] hover:text-[#701522] transition-colors py-3 group cursor-pointer whitespace-nowrap"
            >
              PRODUCTS
              <span className="absolute bottom-0 left-1/2 right-1/2 h-[2px] bg-[#701522] transition-all duration-200 group-hover:left-0 group-hover:right-0" />
            </button>

            <button
              onClick={() => scrollToSection('saree-wardrobe-section')}
              className="relative text-xs sm:text-[13px] font-medium tracking-[0.16em] uppercase text-[#282522] hover:text-[#701522] transition-colors py-3 group cursor-pointer whitespace-nowrap"
            >
              CATEGORIES
              <span className="absolute bottom-0 left-1/2 right-1/2 h-[2px] bg-[#701522] transition-all duration-200 group-hover:left-0 group-hover:right-0" />
            </button>

            <button
              onClick={() => scrollToSection('brand-story-section')}
              className="relative text-xs sm:text-[13px] font-medium tracking-[0.16em] uppercase text-[#282522] hover:text-[#701522] transition-colors py-3 group cursor-pointer whitespace-nowrap"
            >
              ABOUT US
              <span className="absolute bottom-0 left-1/2 right-1/2 h-[2px] bg-[#701522] transition-all duration-200 group-hover:left-0 group-hover:right-0" />
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};
