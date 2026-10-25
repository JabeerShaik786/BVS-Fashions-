import React from 'react';
import { useShop } from '../context/ShopContext';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

export const WishlistDrawer: React.FC = () => {
  const {
    wishlistProducts,
    wishlistCount,
    isWishlistOpen,
    setIsWishlistOpen,
    toggleWishlist,
    addToCart,
    setSelectedCategory,
  } = useShop();

  if (!isWishlistOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-fade-in">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[#EADBCA]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#EADBCA] flex items-center justify-between bg-[#FAF6EE]">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#702C38] fill-[#702C38]" />
            <h3 className="font-serif text-lg font-semibold text-[#282522]">
              Saved Wishlist ({wishlistCount})
            </h3>
          </div>
          <button
            onClick={() => setIsWishlistOpen(false)}
            className="p-1.5 rounded-full text-[#74685E] hover:text-[#282522] hover:bg-[#EADBCA]/50 transition-colors"
            aria-label="Close wishlist"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wishlist Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {wishlistProducts.length > 0 ? (
            wishlistProducts.map((prod) => (
              <div
                key={prod.id}
                className="flex gap-4 p-3 rounded-xl border border-[#EADBCA] bg-[#FAF6EE]/30"
              >
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-20 h-24 object-cover rounded-lg border border-[#EADBCA] shrink-0"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-serif text-xs font-semibold text-[#282522] line-clamp-2 leading-tight">
                        {prod.name}
                      </h4>
                      <button
                        onClick={() => toggleWishlist(prod)}
                        className="text-[#74685E] hover:text-[#702C38] p-1"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-[11px] font-medium text-[#702C38] block mt-1">
                      {prod.categoryLabel}
                    </span>
                    <span className="font-serif text-sm font-bold text-[#282522] mt-1 block">
                      ₹{prod.price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      addToCart(prod);
                      toggleWishlist(prod);
                    }}
                    className="mt-2 w-full py-1.5 px-3 bg-[#702C38] hover:bg-[#561E28] text-white text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#D4B16A]" />
                    <span>Move to Bag</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-[#FAF6EE] flex items-center justify-center mx-auto text-[#702C38] mb-4 border border-[#EADBCA]">
                <Heart className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-lg text-[#282522] mb-1">Your wishlist is empty</h4>
              <p className="text-xs text-[#74685E] max-w-xs mx-auto mb-6">
                Click the heart icon on any saree, kurta, or outfit to save it for your next celebration.
              </p>
              <button
                onClick={() => {
                  setIsWishlistOpen(false);
                  setSelectedCategory('all');
                  const el = document.getElementById('products-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-2.5 bg-[#702C38] text-white text-xs font-semibold rounded-md hover:bg-[#561E28] transition-colors"
              >
                Explore Ethnic Wear
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#EADBCA] bg-[#FAF6EE] text-center">
          <p className="text-[11px] text-[#74685E]">
            Items in your wishlist are saved locally in your browser session.
          </p>
        </div>
      </div>
    </div>
  );
};
