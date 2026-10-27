import React from 'react';
import { useShop } from '../context/ShopContext';
import { CATEGORIES } from '../data/products';
import type { CategoryId } from '../types';
import { X, Heart, ShoppingBag, User, Sparkles, ChevronRight, MessageCircle, Lock } from 'lucide-react';

export const MobileMenu: React.FC = () => {
  const {
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    selectedCategory,
    setSelectedCategory,
    setSearchQuery,
    wishlistCount,
    cartCount,
    setIsWishlistOpen,
    setIsCartOpen,
    setIsAccountModalOpen,
    setActiveInfoModal,
    setViewMode,
  } = useShop();

  if (!isMobileMenuOpen) return null;

  const handleSelectCategory = (catId: CategoryId) => {
    setSelectedCategory(catId);
    setSearchQuery('');
    setIsMobileMenuOpen(false);
    const el = document.getElementById('products-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex animate-fade-in lg:hidden">
      <div 
        className="w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between border-r border-[#EADBCA] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div>
          <div className="p-5 border-b border-[#EADBCA] flex items-center justify-between bg-[#FAF6EE]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-[#702C38] border border-[#D4B16A] flex items-center justify-center text-[#F7F0E5] font-serif font-bold text-xs">
                BVS
              </div>
              <span className="font-serif text-lg font-bold tracking-wider text-[#702C38]">
                BVS FASHIONS
              </span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1.5 rounded-full text-[#74685E] hover:text-[#282522] hover:bg-[#EADBCA]/50"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Account / Wishlist / Cart Bar */}
          <div className="grid grid-cols-3 border-b border-[#EADBCA] bg-[#FAF6EE]/50 divide-x divide-[#EADBCA]">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsAccountModalOpen(true);
              }}
              className="py-3 px-2 flex flex-col items-center text-xs text-[#282522] hover:text-[#702C38]"
            >
              <User className="w-4 h-4 mb-1" />
              <span>Account</span>
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsWishlistOpen(true);
              }}
              className="py-3 px-2 flex flex-col items-center text-xs text-[#282522] hover:text-[#702C38] relative"
            >
              <Heart className="w-4 h-4 mb-1" />
              <span>Wishlist ({wishlistCount})</span>
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsCartOpen(true);
              }}
              className="py-3 px-2 flex flex-col items-center text-xs text-[#282522] hover:text-[#702C38]"
            >
              <ShoppingBag className="w-4 h-4 mb-1 text-[#702C38]" />
              <span className="font-semibold text-[#702C38]">Bag ({cartCount})</span>
            </button>
          </div>

          {/* Direct WhatsApp Callout in mobile drawer */}
          <div className="p-4 border-b border-[#EADBCA] bg-[#25D366]/5">
            <a
              href="https://wa.me/918639778188?text=Hello%20BVS%20Fashions!%20I%20would%20like%20to%20order%20from%20your%20collection."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-[#25D366] text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-2xs"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Order on WhatsApp</span>
            </a>
          </div>

          {/* Main Navigation Links */}
          <div className="p-4 border-b border-[#EADBCA] bg-[#FAF6EE]/40">
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold uppercase tracking-wider">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setIsMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="py-2.5 px-3 bg-white border border-[#EADBCA] rounded-lg text-left text-[#282522] hover:text-[#702C38] hover:border-[#702C38] transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  const el = document.getElementById('products-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="py-2.5 px-3 bg-white border border-[#EADBCA] rounded-lg text-left text-[#282522] hover:text-[#702C38] hover:border-[#702C38] transition-colors"
              >
                Products
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  const el = document.getElementById('saree-wardrobe-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="py-2.5 px-3 bg-white border border-[#EADBCA] rounded-lg text-left text-[#282522] hover:text-[#702C38] hover:border-[#702C38] transition-colors"
              >
                Categories
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  const el = document.getElementById('brand-story-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="py-2.5 px-3 bg-white border border-[#EADBCA] rounded-lg text-left text-[#282522] hover:text-[#702C38] hover:border-[#702C38] transition-colors"
              >
                About Us
              </button>
            </div>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setActiveInfoModal('tracking');
              }}
              className="mt-2 w-full py-2.5 px-3 bg-[#702C38]/10 border border-[#702C38]/30 rounded-lg text-center text-xs font-semibold uppercase tracking-wider text-[#702C38] hover:bg-[#702C38] hover:text-white transition-colors"
            >
              Track Order Status
            </button>
          </div>

          {/* Navigation Category List */}
          <div className="p-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#74685E] px-3 mb-2">
              The Saree Wardrobe & Collections
            </p>
            <ul className="space-y-1">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <li key={cat.id}>
                    <button
                      onClick={() => handleSelectCategory(cat.id as CategoryId)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#702C38] text-white'
                          : 'text-[#282522] hover:bg-[#FAF6EE] hover:text-[#702C38]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {cat.id === 'sarees' && <Sparkles className="w-3.5 h-3.5 text-[#D4B16A]" />}
                        {cat.label}
                      </span>
                      <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#74685E]'}`} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="p-5 border-t border-[#EADBCA] bg-[#FAF6EE] flex items-center justify-between">
          <div>
            <p className="text-xs font-serif font-bold text-[#702C38] mb-0.5">
              The Wedding Edit · 2026
            </p>
            <p className="text-[10px] text-[#74685E]">
              Authentic handlooms for the whole family
            </p>
          </div>

          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              setViewMode('admin');
            }}
            className="flex items-center gap-1 text-[11px] text-[#702C38] hover:underline font-semibold"
          >
            <Lock className="w-3 h-3" />
            <span>Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
};
