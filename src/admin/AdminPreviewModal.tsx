import React, { useState } from 'react';
import type { DbProduct, DbCategory } from '../../server/db';
import { X, MessageCircle, ShieldCheck, Sparkles, Layers } from 'lucide-react';
import { generateWhatsAppOrderUrl } from '../utils/whatsapp';

interface AdminPreviewModalContentProps {
  product: DbProduct;
  categories: DbCategory[];
  onClose: () => void;
  onPublishToggle?: (id: string, current: boolean) => void;
}

const AdminPreviewModalContent: React.FC<AdminPreviewModalContentProps> = ({
  product,
  categories,
  onClose,
  onPublishToggle,
}) => {
  const [activeImage, setActiveImage] = useState(product.images[0] || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'Standard');
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || { name: 'Standard', hex: '#702C38' });

  const categoryName = categories.find((c) => c.id === product.category_id)?.name || product.category_id;

  const handleTestWhatsApp = () => {
    const url = generateWhatsAppOrderUrl({
      product: {
        id: product.id,
        sku: product.sku,
        name: product.name,
        category: product.category_id as any,
        categoryLabel: categoryName,
        price: product.sale_price || product.regular_price,
        originalPrice: product.sale_price ? product.regular_price : undefined,
        image: product.images[0] || '',
        colors: product.colors,
        sizes: product.sizes,
        fabric: product.fabric || '',
        occasion: product.occasion || '',
        description: product.description,
      },
      selectedSize,
      selectedColor,
      quantity: 1,
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#EADBCA] relative max-h-[90vh] flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Admin Bar */}
      <div className="bg-[#702C38] text-white px-6 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold uppercase tracking-wider text-[#D4B16A]">
            Live Customer Preview
          </span>
          <span className="text-white/60">•</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
            product.is_published ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
          }`}>
            {product.is_published ? 'Published on Site' : 'Draft (Admin Only)'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {onPublishToggle && (
            <button
              onClick={() => onPublishToggle(product.id, product.is_published)}
              className="text-xs text-[#D4B16A] hover:underline font-semibold"
            >
              {product.is_published ? 'Unpublish' : 'Publish Now'}
            </button>
          )}
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modal Content */}
      <div className="flex flex-col md:flex-row overflow-y-auto flex-1">
        {/* Left: Images */}
        <div className="md:w-1/2 bg-[#FAF6EE] p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#EADBCA]">
          <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-sm bg-white mb-4">
            <img
              src={activeImage || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-top"
            />
            {product.sale_price && (
              <span className="absolute top-3 left-3 bg-[#702C38] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow">
                {Math.round((1 - product.sale_price / product.regular_price) * 100)}% OFF
              </span>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 justify-center">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-12 h-14 rounded-md overflow-hidden border-2 shrink-0 ${
                    activeImage === img ? 'border-[#702C38]' : 'border-transparent opacity-70'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Customer View & WhatsApp Action */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#702C38]">
                {categoryName}
              </span>
              <span className="font-mono text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                SKU: {product.sku}
              </span>
            </div>

            <h3 className="font-serif text-2xl font-normal text-[#282522] leading-snug mb-2">
              {product.name}
            </h3>

            {/* Availability */}
            <div className="mb-4">
              {product.availability_status === 'out_of_stock' ? (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  Currently Out of Stock
                </span>
              ) : product.availability_status === 'made_to_order' ? (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  Made to Order
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  In Stock • Ready to Dispatch
                </span>
              )}
            </div>

            {/* Price Box */}
            <div className="flex items-baseline gap-3 mb-4 p-3 rounded-lg bg-[#FAF6EE] border border-[#EADBCA]">
              <span className="font-serif text-2xl font-bold text-[#702C38]">
                ₹{(product.sale_price || product.regular_price).toLocaleString('en-IN')}
              </span>
              {product.sale_price && (
                <span className="text-sm text-[#74685E] line-through">
                  ₹{product.regular_price.toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-[11px] text-[#74685E] ml-auto">
                Inclusive of all taxes
              </span>
            </div>

            <p className="text-xs text-[#74685E] leading-relaxed mb-4">
              {product.description}
            </p>

            {/* Fabric Details */}
            {(product.fabric || product.occasion) && (
              <div className="mb-4 p-3 rounded-lg bg-white border border-[#EADBCA] text-xs space-y-1">
                {product.fabric && (
                  <div className="flex items-center gap-2 text-[#282522]">
                    <Layers className="w-3.5 h-3.5 text-[#D4B16A]" />
                    <span className="font-semibold">Fabric:</span>
                    <span className="text-[#74685E]">{product.fabric}</span>
                  </div>
                )}
                {product.occasion && (
                  <div className="flex items-center gap-2 text-[#282522]">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4B16A]" />
                    <span className="font-semibold">Occasion:</span>
                    <span className="text-[#74685E]">{product.occasion}</span>
                  </div>
                )}
              </div>
            )}

            {/* Color picker */}
            {product.colors.length > 0 && (
              <div className="mb-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#282522] mb-1.5">
                  Shade: {selectedColor.name}
                </label>
                <div className="flex gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c)}
                      className={`w-6 h-6 rounded-full border-2 ${
                        selectedColor.name === c.name ? 'border-[#702C38] scale-110 ring-2 ring-[#702C38]/20' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size picker */}
            {product.sizes.length > 0 && (
              <div className="mb-5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#282522] mb-1.5">
                  Size: {selectedSize}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-2.5 py-1 text-xs rounded border ${
                        selectedSize === s
                          ? 'bg-[#702C38] text-white border-[#702C38]'
                          : 'bg-[#FAF6EE] text-[#282522] border-[#EADBCA]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* WhatsApp Button */}
          <div className="pt-4 border-t border-[#EADBCA] space-y-2">
            <button
              onClick={handleTestWhatsApp}
              className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold uppercase tracking-wider rounded-md transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Test WhatsApp Order Flow</span>
            </button>
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4B16A]" />
              <span>Opens WhatsApp click-to-chat with generated product payload</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export interface AdminPreviewModalProps {
  product: DbProduct | null;
  categories: DbCategory[];
  onClose: () => void;
  onPublishToggle?: (id: string, current: boolean) => void;
}

export const AdminPreviewModal: React.FC<AdminPreviewModalProps> = ({
  product,
  categories,
  onClose,
  onPublishToggle,
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <AdminPreviewModalContent
        product={product}
        categories={categories}
        onClose={onClose}
        onPublishToggle={onPublishToggle}
      />
    </div>
  );
};
