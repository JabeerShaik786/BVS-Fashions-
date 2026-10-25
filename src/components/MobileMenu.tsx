import React from 'react';
import { useShop } from '../context/ShopContext';
import { CATEGORIES } from '../data/products';
import type { CategoryId } from '../types';
import { X, Heart, ShoppingBag, User, Sparkles, ChevronRight } from 'lucide-react';

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
        className="w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between border-r border-[#EADBCA]"
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

          {/* Navigation Category List */}
          <div className="p-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#74685E] px-3 mb-2">
              Browse Categories
            </p>
            <ul className="space-y-1">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <li key={cat.id}>
                    <button
                      onClick={() => handleSelectCategory(cat.id as CategoryId)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                        isActive
                          ? 'bg-[#702C38] text-white'
                          : 'text-[#282522] hover:bg-[#FAF6EE] hover:text-[#702C38]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {cat.id === 'festive-wedding' && <Sparkles className="w-3.5 h-3.5 text-[#D4B16A]" />}
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
        <div className="p-5 border-t border-[#EADBCA] bg-[#FAF6EE]">
          <p className="text-xs font-serif font-bold text-[#702C38] mb-1">
            Traditions for Every Celebration
          </p>
          <p className="text-[11px] text-[#74685E] leading-relaxed">
            Accessible family ethnic wear crafted for weddings, festivals, and joyous family occasions.
          </p>
        </div>
      </div>
    </div>
  );
};
