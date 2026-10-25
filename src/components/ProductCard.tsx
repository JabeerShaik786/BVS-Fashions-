import React from 'react';
import type { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { Heart, ShoppingBag, Eye, Sparkles, MessageCircle } from 'lucide-react';
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

  return (
    <div className="group bg-white rounded-xl overflow-hidden border border-[#EADBCA] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col relative">
      
      {/* Image Container with Badges & Actions */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#FAF6EE] cursor-pointer" onClick={() => setQuickViewProduct(product)}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Discount / New Badge */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.discountPercent && (
            <span className="bg-[#702C38] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
              {product.discountPercent}% OFF
            </span>
          )}
          {product.isFestive && (
            <span className="bg-[#D4B16A] text-[#282522] text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shadow-sm flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              Festive
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 shadow-sm ${
            isFavorited
              ? 'bg-[#702C38] text-[#D4B16A]'
              : 'bg-white/90 text-[#74685E] hover:text-[#702C38] hover:bg-white'
          }`}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-[#D4B16A]' : ''}`} />
        </button>

        {/* Hover Action Overlay (Desktop) */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="flex-1 py-2 px-3 bg-white text-[#282522] hover:bg-[#FAF6EE] text-xs font-semibold rounded-md shadow flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-[#702C38]" />
            <span>Quick View</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="py-2 px-3 bg-[#702C38] text-white hover:bg-[#561E28] text-xs font-semibold rounded-md shadow flex items-center justify-center gap-1.5 transition-colors"
            title="Quick add to bag"
            aria-label="Quick add to bag"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#D4B16A]" />
          </button>
        </div>
      </div>

      {/* Content Details */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-[#74685E] mb-1">
            <span className="uppercase tracking-wider font-medium text-[9px] sm:text-[10px] text-[#702C38]">
              {product.categoryLabel}
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono font-medium text-gray-500">
              {product.sku || (product.fabric ? product.fabric.split(' ')[0] : '')}
            </span>
          </div>

          <h3 
            onClick={() => setQuickViewProduct(product)}
            className="font-serif text-xs sm:text-sm font-semibold text-[#282522] line-clamp-2 hover:text-[#702C38] cursor-pointer transition-colors leading-snug mb-1.5"
          >
            {product.name}
          </h3>
        </div>

        <div>
          {/* Color Swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1 sm:gap-1.5 mb-2">
              {product.colors.slice(0, 3).map((color, idx) => (
                <span
                  key={idx}
                  title={color.name}
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border border-gray-300 shadow-2xs inline-block"
                  style={{ backgroundColor: color.hex }}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="text-[9px] text-[#74685E]">+{product.colors.length - 3}</span>
              )}
              <span className="text-[9px] sm:text-[10px] text-[#74685E] ml-1 hidden xs:inline">
                {product.colors.length} {product.colors.length === 1 ? 'shade' : 'shades'}
              </span>
            </div>
          )}

          {/* Pricing Row */}
          <div className="flex items-baseline gap-1.5 sm:gap-2 pt-1.5 sm:pt-2 border-t border-[#EADBCA]/60">
            <span className="font-serif text-sm sm:text-lg font-bold text-[#702C38]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span className="text-[10px] sm:text-xs text-[#74685E] line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Mobile Quick Actions: WhatsApp Inquiry & Add to Bag */}
          <div className="mt-2.5 sm:hidden grid grid-cols-2 gap-1.5">
            <button
              onClick={() => addToCart(product)}
              className="py-2 px-1.5 bg-[#FAF6EE] text-[#702C38] border border-[#EADBCA] hover:bg-[#EADBCA]/40 text-[11px] font-semibold rounded flex items-center justify-center gap-1"
              aria-label="Add to Bag"
            >
              <ShoppingBag className="w-3 h-3 text-[#D4B16A]" />
              <span>Bag</span>
            </button>
            <button
              onClick={() => {
                const url = generateWhatsAppOrderUrl({ product });
                window.open(url, '_blank', 'noopener,noreferrer');
              }}
              className="py-2 px-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-[11px] font-bold rounded flex items-center justify-center gap-1 shadow-2xs"
              aria-label="Order on WhatsApp"
            >
              <MessageCircle className="w-3 h-3 fill-white" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
