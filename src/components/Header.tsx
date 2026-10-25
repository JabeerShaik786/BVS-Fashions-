import React, { useState, useRef, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  User, 
  Menu, 
  X,
  Sparkles,
  ArrowRight
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
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    products,
    setQuickViewProduct,
    setViewMode,
  } = useShop();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearchExpandedMobile, setIsSearchExpandedMobile] = useState(false);
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

  return (
    <header className="sticky top-0 z-40 bg-[#FAF6EE]/95 backdrop-blur-md border-b border-[#EADBCA] transition-all">
      {/* 1. Announcement Bar */}
      <div className="bg-[#702C38] text-[#F7F0E5] text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <Sparkles className="w-3.5 h-3.5 text-[#D4B16A]" />
            <span className="font-normal tracking-wide">
              Festive & Wedding Ethnic Wear for Families • In-Store & Online Catalog
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-[11px] tracking-wider text-[#F7F0E5]/80">
            <span className="hover:text-[#D4B16A] transition-colors">Traditional Handloom Weaves</span>
            <span>•</span>
            <button
              onClick={() => setViewMode('admin')}
              className="text-[#D4B16A] hover:underline font-semibold cursor-pointer"
            >
              Admin Portal
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Mobile menu trigger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-[#282522] hover:text-[#702C38] transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <button
              onClick={() => setIsSearchExpandedMobile(!isSearchExpandedMobile)}
              className="p-2 text-[#282522] hover:text-[#702C38] transition-colors md:hidden"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Brand Wordmark */}
          <div className="flex-1 lg:flex-initial text-center lg:text-left">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                setSelectedCategory('all');
                setSearchQuery('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-block group"
            >
              <div className="flex items-center gap-1.5 sm:gap-2 justify-center lg:justify-start">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-[#702C38] border border-[#D4B16A] flex items-center justify-center text-[#F7F0E5] font-serif font-bold text-xs sm:text-sm shadow-sm group-hover:bg-[#561E28] transition-colors shrink-0">
                  BVS
                </div>
                <div className="text-left">
                  <span className="block font-serif text-lg sm:text-2xl font-bold tracking-[0.12em] sm:tracking-[0.18em] text-[#702C38] group-hover:text-[#561E28] transition-colors leading-none">
                    BVS FASHIONS
                  </span>
                  <span className="block text-[8px] sm:text-[9px] uppercase tracking-[0.22em] sm:tracking-[0.28em] text-[#74685E] mt-1 font-medium">
                    Indian Ethnic Wear
                  </span>
                </div>
              </div>
            </a>
          </div>

          {/* Search bar (Desktop & Tablet) */}
          <div 
            ref={searchContainerRef}
            className="hidden md:flex flex-1 max-w-md mx-6 relative"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search sarees, kurtas, anarkalis, lehengas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full bg-[#FFFFFF] border border-[#EADBCA] text-[#282522] placeholder-[#74685E]/70 pl-10 pr-10 py-2.5 rounded-full text-sm focus:outline-none focus:border-[#702C38] focus:ring-1 focus:ring-[#702C38] shadow-sm transition-all"
              />
              <Search className="w-4 h-4 text-[#74685E] absolute left-3.5 top-3.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3 text-[#74685E] hover:text-[#282522]"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Live Search Suggestions Dropdown */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-[#EADBCA] overflow-hidden z-50 animate-fade-in">
                {searchQuery.trim() ? (
                  <div>
                    <div className="px-4 py-2.5 bg-[#FAF6EE] text-xs font-semibold text-[#74685E] uppercase tracking-wider border-b border-[#EADBCA]">
                      Search Results ({searchSuggestions.length})
                    </div>
                    {searchSuggestions.length > 0 ? (
                      <div className="divide-y divide-[#EADBCA]/50 max-h-72 overflow-y-auto">
                        {searchSuggestions.map((prod) => (
                          <div
                            key={prod.id}
                            onClick={() => handleSelectProduct(prod)}
                            className="flex items-center gap-3 p-3 hover:bg-[#FAF6EE] cursor-pointer transition-colors"
                          >
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-12 h-14 object-cover rounded border border-[#EADBCA]"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-[#702C38] font-medium">{prod.categoryLabel}</p>
                              <p className="text-sm font-medium text-[#282522] truncate">{prod.name}</p>
                              <p className="text-xs font-semibold text-[#282522]">₹{prod.price.toLocaleString('en-IN')}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-[#74685E] shrink-0" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-sm text-[#74685E]">
                        No matching ethnic wear found for "{searchQuery}".
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4">
                    <p className="text-xs font-semibold text-[#74685E] uppercase tracking-wider mb-2">
                      Popular Categories
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => handleSelectCategory(cat.id as CategoryId)}
                          className="text-xs bg-[#FAF6EE] hover:bg-[#702C38] hover:text-white px-3 py-1.5 rounded-full border border-[#EADBCA] transition-colors"
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

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Account Icon */}
            <button
              onClick={() => setIsAccountModalOpen(true)}
              className="flex items-center gap-1.5 p-2 text-[#282522] hover:text-[#702C38] transition-colors rounded-full hover:bg-[#EADBCA]/30"
              aria-label="User Account"
            >
              <User className="w-5 h-5" />
              <span className="hidden xl:inline text-xs font-medium tracking-wide">Account</span>
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-2 text-[#282522] hover:text-[#702C38] transition-colors rounded-full hover:bg-[#EADBCA]/30"
              aria-label={`Wishlist (${wishlistCount} items)`}
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#702C38] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#FAF6EE]">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Bag Icon */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3 py-2 bg-[#702C38] hover:bg-[#561E28] text-white rounded-full transition-all shadow-sm group"
              aria-label={`Shopping bag (${cartCount} items)`}
            >
              <ShoppingBag className="w-4 h-4 text-[#D4B16A]" />
              <span className="text-xs font-semibold tracking-wide">
                Bag
              </span>
              <span className="bg-[#D4B16A] text-[#702C38] text-xs font-bold px-1.5 py-0.2 rounded-full min-w-5 text-center">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Expandable Bar */}
        {isSearchExpandedMobile && (
          <div className="pb-3 md:hidden">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search sarees, kurtas, kids wear..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-[#FFFFFF] border border-[#EADBCA] text-[#282522] placeholder-[#74685E]/70 pl-10 pr-10 py-2 rounded-full text-sm focus:outline-none focus:border-[#702C38]"
              />
              <Search className="w-4 h-4 text-[#74685E] absolute left-3.5 top-2.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-2.5 text-[#74685E]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
