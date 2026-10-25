import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, Heart, ShoppingBag, Check, ShieldCheck, Sparkles, Layers } from 'lucide-react';
import type { Product, ProductColor } from '../types';
import { WhatsAppOrderButton } from './WhatsAppOrderButton';

interface ProductModalContentProps {
  product: Product;
  onClose: () => void;
}

const ProductModalContent: React.FC<ProductModalContentProps> = ({ product, onClose }) => {
  const { addToCart, isInWishlist, toggleWishlist } = useShop();

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'Standard');
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImage, setActiveImage] = useState<string>(product.image);

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    onClose();
  };

  return (
    <div 
      className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#EADBCA] relative max-h-[92vh] flex flex-col md:flex-row my-auto"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-8 h-8 rounded-full bg-white/95 text-[#282522] hover:text-[#702C38] flex items-center justify-center shadow-md transition-colors"
        aria-label="Close product view"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Left Column: Image Viewer */}
      <div className="md:w-1/2 bg-[#FAF6EE] p-4 sm:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#EADBCA] shrink-0">
        <div className="relative aspect-[3/4] max-h-[280px] sm:max-h-[380px] md:max-h-none rounded-xl overflow-hidden shadow-sm bg-white mb-3 sm:mb-4 mx-auto w-full">
          <img
            src={activeImage}
            alt={product.name}
            className="w-full h-full object-cover object-top"
          />
          {product.discountPercent && (
            <span className="absolute top-3 left-3 bg-[#702C38] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow">
              {product.discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Alternate Image Thumbnails */}
        {product.secondaryImage && (
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setActiveImage(product.image)}
              className={`w-14 h-16 rounded-md overflow-hidden border-2 transition-all ${
                activeImage === product.image ? 'border-[#702C38]' : 'border-transparent opacity-70'
              }`}
            >
              <img src={product.image} alt="Main view" className="w-full h-full object-cover" />
            </button>
            <button
              onClick={() => setActiveImage(product.secondaryImage!)}
              className={`w-14 h-16 rounded-md overflow-hidden border-2 transition-all ${
                activeImage === product.secondaryImage ? 'border-[#702C38]' : 'border-transparent opacity-70'
              }`}
            >
              <img src={product.secondaryImage} alt="Alternate view" className="w-full h-full object-cover" />
            </button>
          </div>
        )}
      </div>

      {/* Right Column: Customization & Add to Cart */}
      <div className="md:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#702C38]">
                {product.categoryLabel}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-xs text-[#74685E]">{product.occasion}</span>
            </div>
            {product.sku && (
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">
                SKU: {product.sku}
              </span>
            )}
          </div>

          <h3 className="font-serif text-2xl font-normal text-[#282522] leading-snug mb-2">
            {product.name}
          </h3>

          {/* Availability Status Indicator */}
          <div className="mb-3">
            {product.availability_status === 'out_of_stock' ? (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                Currently Out of Stock
              </span>
            ) : product.availability_status === 'made_to_order' ? (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Made to Order (Handcrafted upon request)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                In Stock • Ready to Dispatch
              </span>
            )}
          </div>

          {/* Price Box */}
          <div className="flex items-baseline gap-3 mb-5 p-3 rounded-lg bg-[#FAF6EE] border border-[#EADBCA]">
            <span className="font-serif text-2xl font-bold text-[#702C38]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-[#74685E] line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
            <span className="text-[11px] text-[#74685E] ml-auto">
              Inclusive of all taxes
            </span>
          </div>

          {/* Description */}
          <p className="text-xs text-[#74685E] leading-relaxed mb-5">
            {product.description}
          </p>

          {/* Fabric Details */}
          <div className="mb-5 p-3 rounded-lg bg-white border border-[#EADBCA] text-xs space-y-1.5">
            <div className="flex items-center gap-2 text-[#282522]">
              <Layers className="w-3.5 h-3.5 text-[#D4B16A]" />
              <span className="font-semibold">Fabric:</span>
              <span className="text-[#74685E]">{product.fabric}</span>
            </div>
            <div className="flex items-center gap-2 text-[#282522]">
              <Sparkles className="w-3.5 h-3.5 text-[#D4B16A]" />
              <span className="font-semibold">Occasion:</span>
              <span className="text-[#74685E]">{product.occasion}</span>
            </div>
          </div>

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-5">
              <label className="block text-xs font-semibold text-[#282522] uppercase tracking-wider mb-2">
                Select Shade: <span className="font-normal text-[#74685E]">{selectedColor.name}</span>
              </label>
              <div className="flex items-center gap-2.5">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c)}
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedColor.name === c.name
                        ? 'border-[#702C38] scale-110 shadow-sm ring-2 ring-[#702C38]/20'
                        : 'border-gray-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {selectedColor.name === c.name && (
                      <Check className="w-3.5 h-3.5 text-white drop-shadow-xs" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <label className="block text-xs font-semibold text-[#282522] uppercase tracking-wider mb-2">
                Select Size
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-3 py-1.5 text-xs rounded-md border font-medium transition-all ${
                      selectedSize === s
                        ? 'bg-[#702C38] text-white border-[#702C38] shadow-xs'
                        : 'bg-[#FAF6EE] text-[#282522] border-[#EADBCA] hover:border-[#702C38]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Stepper */}
          <div className="mb-6 flex items-center gap-4">
            <label className="text-xs font-semibold text-[#282522] uppercase tracking-wider">
              Quantity
            </label>
            <div className="inline-flex items-center border border-[#EADBCA] rounded-md bg-[#FAF6EE]">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-1 text-sm text-[#282522] hover:bg-[#EADBCA]/50 font-bold"
              >
                -
              </button>
              <span className="px-3 py-1 text-xs font-semibold text-[#282522] min-w-8 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-1 text-sm text-[#282522] hover:bg-[#EADBCA]/50 font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-[#EADBCA] space-y-2.5">
          {/* Primary Action: Order on WhatsApp */}
          <WhatsAppOrderButton
            product={product}
            selectedSize={selectedSize}
            selectedColor={selectedColor}
            quantity={quantity}
            variant="primary"
            showHelpText={true}
          />

          {/* Secondary Actions: Add to Bag & Wishlist */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleAddToCart}
              disabled={product.availability_status === 'out_of_stock'}
              className="flex-1 py-2.5 px-4 bg-[#702C38] hover:bg-[#561E28] disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-wider rounded-md transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-[#D4B16A]" />
              <span>Add to Bag</span>
            </button>

            <button
              onClick={() => toggleWishlist(product)}
              className={`p-2.5 rounded-md border transition-all ${
                isFavorited
                  ? 'bg-[#702C38] text-[#D4B16A] border-[#702C38]'
                  : 'bg-[#FAF6EE] text-[#74685E] border-[#EADBCA] hover:text-[#702C38]'
              }`}
              title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-[#D4B16A]' : ''}`} />
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-[11px] text-[#74685E]">
          <ShieldCheck className="w-4 h-4 text-[#D4B16A]" />
          <span>Traditional handloom & powerloom authentic fabrics verified.</span>
        </div>

      </div>
    </div>
  );
};

export const ProductModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct } = useShop();

  if (!quickViewProduct) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <ProductModalContent 
        product={quickViewProduct} 
        onClose={() => setQuickViewProduct(null)} 
      />
    </div>
  );
};
