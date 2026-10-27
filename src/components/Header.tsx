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

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF6EE]/95 backdrop-blur-md border-b border-[#EADBCA] transition-all">
      {/* 1. Refined Announcement Bar matching Chenetha Sarees editorial tone */}
      <div className="bg-[#702C38] text-[#F7F0E5] text-xs py-2 px-4 border-b border-[#D4B16A]/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <Sparkles className="w-3.5 h-3.5 text-[#D4B16A]" />
            <span className="font-serif tracking-wider font-light text-[11px] sm:text-xs">
              The Wedding Edit · 2026 · Pure Handloom Weaves & Family Ethnic Attire
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-5 text-[11px] tracking-wider text-[#F7F0E5]/80">
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
              className="text-[#F7F0E5]/80 hover:text-[#D4B16A] transition-colors cursor-pointer"
            >
              Admin Portal
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Header Row with editorial typography & minimal layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Mobile menu & search trigger */}
          <div className="flex items-center gap-1 lg:hidden">
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

          {/* Brand Wordmark with luxury serif aesthetic */}
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
              <div className="flex items-center gap-2.5 justify-center lg:justify-start">
                <div className="w-8 h-8 rounded-lg bg-[#702C38] border border-[#D4B16A] flex items-center justify-center text-[#F7F0E5] font-serif font-bold text-xs sm:text-sm shadow-sm group-hover:bg-[#561E28] transition-colors shrink-0">
                  BVS
                </div>
                <div className="text-left">
                  <span className="block font-serif text-xl sm:text-2xl font-bold tracking-[0.16em] sm:tracking-[0.2em] text-[#702C38] group-hover:text-[#561E28] transition-colors leading-none">
                    BVS FASHIONS
                  </span>
                  <span className="block text-[8px] sm:text-[9px] uppercase tracking-[0.3em] text-[#74685E] mt-1 font-medium">
                    Handloom & Ethnic Atelier
                  </span>
                </div>
              </div>
            </a>
          </div>

          {/* Center Navigation Links (matching Chenetha Sarees structure) */}
          <nav className="hidden xl:flex items-center space-x-7 text-xs uppercase tracking-[0.18em] font-medium text-[#282522]">
            <button 
              onClick={() => scrollToSection('hero-section')} 
              className="hover:text-[#702C38] transition-colors cursor-pointer"
            >
              The Wedding Edit
            </button>
            <button 
              onClick={() => scrollToSection('collections-section')} 
              className="hover:text-[#702C38] transition-colors cursor-pointer"
            >
              Collections
            </button>
            <button 
              onClick={() => scrollToSection('saree-wardrobe-section')} 
              className="hover:text-[#702C38] transition-colors cursor-pointer text-[#702C38] font-bold"
            >
              The Saree Wardrobe
            </button>
            <button 
              onClick={() => scrollToSection('products-section')} 
              className="hover:text-[#702C38] transition-colors cursor-pointer"
            >
              All Products
            </button>
            <button 
              onClick={() => scrollToSection('brand-story-section')} 
              className="hover:text-[#702C38] transition-colors cursor-pointer"
            >
              Our Story
            </button>
          </nav>

          {/* Search bar (Desktop & Tablet) */}
          <div 
            ref={searchContainerRef}
            className="hidden md:flex flex-1 max-w-xs lg:max-w-sm xl:max-w-xs relative ml-4"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search Kanchi, Banarasi, Kurtas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full bg-[#FFFFFF] border border-[#EADBCA] text-[#282522] placeholder-[#74685E]/70 pl-9 pr-9 py-2 rounded-full text-xs focus:outline-none focus:border-[#702C38] focus:ring-1 focus:ring-[#702C38] shadow-2xs transition-all"
              />
              <Search className="w-3.5 h-3.5 text-[#74685E] absolute left-3 top-2.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2 text-[#74685E] hover:text-[#282522]"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Live Search Suggestions Dropdown */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-[#EADBCA] overflow-hidden z-50 animate-fade-in">
                {searchQuery.trim() ? (
                  <div>
                    <div className="px-4 py-2 bg-[#FAF6EE] text-[10px] font-semibold text-[#74685E] uppercase tracking-wider border-b border-[#EADBCA]">
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
                              className="w-10 h-12 object-cover rounded border border-[#EADBCA]"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] text-[#702C38] font-bold uppercase">{prod.categoryLabel}</p>
                              <p className="text-xs font-serif font-medium text-[#282522] truncate">{prod.name}</p>
                              <p className="text-xs font-bold text-[#702C38]">₹{prod.price.toLocaleString('en-IN')}</p>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-[#74685E] shrink-0" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-5 text-center text-xs text-[#74685E]">
                        No matching ethnic wear found for "{searchQuery}".
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4">
                    <p className="text-[10px] font-semibold text-[#74685E] uppercase tracking-wider mb-2">
                      Saree Drape Categories
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {CATEGORIES.slice(1, 6).map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => handleSelectCategory(cat.id as CategoryId)}
                          className="text-[11px] bg-[#FAF6EE] hover:bg-[#702C38] hover:text-white px-2.5 py-1 rounded-full border border-[#EADBCA] transition-colors"
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

          {/* Right Action Icons & WhatsApp Order Shortcut */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* WhatsApp Quick Order button */}
            <a
              href="https://wa.me/918639778188?text=Hello%20BVS%20Fashions!%20I%20would%20like%20to%20place%20an%20order%20inquiry."
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 py-1.5 px-3 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] border border-[#25D366]/30 rounded-full text-xs font-semibold tracking-wide transition-colors"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-[#25D366] text-[#25D366]" />
              <span>WhatsApp Order</span>
            </a>

            {/* Account Icon */}
            <button
              onClick={() => setIsAccountModalOpen(true)}
              className="p-2 text-[#282522] hover:text-[#702C38] transition-colors rounded-full hover:bg-[#EADBCA]/30"
              aria-label="User Account"
            >
              <User className="w-5 h-5" />
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

            {/* Shopping Bag / Inquiry Drawer */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2 bg-[#702C38] hover:bg-[#561E28] text-white rounded-full transition-all shadow-sm group"
              aria-label={`Shopping bag (${cartCount} items)`}
            >
              <ShoppingBag className="w-4 h-4 text-[#D4B16A]" />
              <span className="text-xs font-semibold tracking-wide hidden sm:inline">
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
                placeholder="Search Kanchi, Banarasi, Sarees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-[#FFFFFF] border border-[#EADBCA] text-[#282522] placeholder-[#74685E]/70 pl-10 pr-10 py-2 rounded-full text-xs focus:outline-none focus:border-[#702C38]"
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
