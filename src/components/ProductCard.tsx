import React from 'react';
import type { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { Heart, Eye, Sparkles, MessageCircle, ShoppingBag } from 'lucide-react';
import { generateWhatsAppOrderUrl } from '../utils/whatsapp';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    isInWishlist, 
    toggleWishlist, 
    addToCart, 
    setQuickViewProduct 
  } = useShop();

  const isFavorited = isInWishlist(product.id);

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = generateWhatsAppOrderUrl({ product });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const primaryColor = product.colors && product.colors.length > 0 ? product.colors[0] : null;

  return (
    <div 
      className="group bg-white rounded-xl overflow-hidden border border-[#EADBCA] shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
    >
      {/* 1. Image Frame with Badges, Secondary Image Hover & Wishlist */}
      <div 
        className="relative aspect-[3/4] overflow-hidden bg-[#FAF6EE] cursor-pointer"
        onClick={() => setQuickViewProduct(product)}
      >
        {/* Main Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover object-top transition-all duration-700 ease-out ${
            product.secondaryImage ? 'group-hover:opacity-0' : 'group-hover:scale-105'
          }`}
          loading="lazy"
        />

        {/* Alternate Hover Image if present */}
        {product.secondaryImage && (
          <img
            src={product.secondaryImage}
            alt={`${product.name} alternate view`}
            className="absolute inset-0 w-full h-full object-cover object-top opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
            loading="lazy"
          />
        )}

        {/* Discount / Festive Badge */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.discountPercent && (
            <span className="bg-[#702C38] text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-2xs">
              {product.discountPercent}% OFF
            </span>
          )}
          {product.isFestive && (
            <span className="bg-[#D4B16A] text-[#282522] text-[8px] sm:text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shadow-2xs flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              Festive
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 shadow-2xs cursor-pointer ${
            isFavorited
              ? 'bg-[#702C38] text-[#D4B16A]'
              : 'bg-white/90 text-[#74685E] hover:text-[#702C38] hover:bg-white'
          }`}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-[#D4B16A]' : ''}`} />
        </button>

        {/* Quick View Hover Strip (Desktop) */}
        <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="flex-1 py-1.5 px-3 bg-white hover:bg-[#FAF6EE] text-[#282522] text-xs font-semibold rounded shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#702C38]" />
            <span>Quick View</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="py-1.5 px-3 bg-[#702C38] hover:bg-[#561E28] text-white text-xs font-semibold rounded shadow-xs flex items-center justify-center transition-colors cursor-pointer"
            title="Add to shopping bag"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#D4B16A]" />
          </button>
        </div>
      </div>

      {/* 2. Product Details matching Chenetha Sarees layout */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Drape / Category Label */}
          <div className="flex items-center justify-between text-xs text-[#74685E] mb-1">
            <span className="uppercase tracking-[0.16em] font-bold text-[9px] sm:text-[10px] text-[#702C38]">
              {product.categoryLabel}
            </span>
            {primaryColor && (
              <span className="text-[10px] text-[#74685E] flex items-center gap-1 font-medium">
                <span 
                  className="w-2.5 h-2.5 rounded-full border border-gray-300 inline-block shrink-0" 
                  style={{ backgroundColor: primaryColor.hex }}
                />
                <span className="truncate max-w-[80px]">{primaryColor.name}</span>
              </span>
            )}
          </div>

          {/* Product Title in refined Serif font */}
          <h3 
            onClick={() => setQuickViewProduct(product)}
            className="font-serif text-sm sm:text-base font-medium text-[#282522] hover:text-[#702C38] cursor-pointer transition-colors leading-snug line-clamp-2 mb-2"
          >
            {product.name}
          </h3>
        </div>

        <div>
          {/* Price Row */}
          <div className="flex items-baseline gap-2 pt-2 border-t border-[#EADBCA]/60 mb-3">
            <span className="font-serif text-base sm:text-lg font-bold text-[#702C38]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span className="text-[11px] sm:text-xs text-[#74685E] line-through font-light">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Action Buttons: View Details & WhatsApp Order (Matching Chenetha Sarees) */}
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            <button
              onClick={() => setQuickViewProduct(product)}
              className="py-2 px-2 bg-[#FAF6EE] hover:bg-[#EADBCA]/50 text-[#702C38] border border-[#EADBCA] text-[10px] sm:text-xs font-semibold uppercase tracking-wider rounded-md transition-colors text-center cursor-pointer"
            >
              View details
            </button>

            <button
              onClick={handleWhatsAppOrder}
              className="py-2 px-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-md transition-colors flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
              title="Order on WhatsApp with prefilled product and price"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
