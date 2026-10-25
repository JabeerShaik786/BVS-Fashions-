import React, { useState } from 'react';
import { MessageCircle, CheckCircle, AlertCircle } from 'lucide-react';
import type { Product, ProductColor } from '../types';
import { generateWhatsAppOrderUrl, getWhatsAppBusinessNumber } from '../utils/whatsapp';

export interface WhatsAppOrderButtonProps {
  product: Product;
  selectedSize?: string;
  selectedColor?: ProductColor | string;
  quantity?: number;
  className?: string;
  variant?: 'primary' | 'compact' | 'outline' | 'card';
  showHelpText?: boolean;
  onBeforeOrder?: () => boolean | void;
}

/**
 * Reusable WhatsApp Order Button for BVS Fashions.
 * Formats order inquiries and directs customers to official WhatsApp click-to-chat.
 * Displays clear information that order confirmation is finalized via WhatsApp chat.
 */
export const WhatsAppOrderButton: React.FC<WhatsAppOrderButtonProps> = ({
  product,
  selectedSize,
  selectedColor,
  quantity = 1,
  className = '',
  variant = 'primary',
  showHelpText = true,
  onBeforeOrder,
}) => {
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const isOutOfStock = product.availability_status === 'out_of_stock';
  const whatsappNumber = getWhatsAppBusinessNumber();

  const handleOrder = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isOutOfStock) return;

    if (onBeforeOrder) {
      const allowed = onBeforeOrder();
      if (allowed === false) return;
    }

    // Validation: if product specifies sizes and none chosen, default to first available
    const effectiveSize = selectedSize || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined);
    const effectiveColor = selectedColor || (product.colors && product.colors.length > 0 ? product.colors[0] : undefined);

    const url = generateWhatsAppOrderUrl({
      product,
      selectedSize: effectiveSize,
      selectedColor: effectiveColor,
      quantity,
    });

    try {
      window.open(url, '_blank', 'noopener,noreferrer');
      setErrorNotice(null);
    } catch {
      setErrorNotice('Could not open WhatsApp. Please check your browser popup settings.');
    }
  };

  // Base styling variants
  let buttonClasses = '';
  if (variant === 'primary') {
    buttonClasses =
      'w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';
  } else if (variant === 'compact') {
    buttonClasses =
      'py-2 px-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold rounded-md shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50';
  } else if (variant === 'card') {
    buttonClasses =
      'w-full py-2 px-2.5 bg-[#25D366]/10 hover:bg-[#25D366] text-[#1E7E34] hover:text-white border border-[#25D366]/30 text-[11px] sm:text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer';
  } else {
    buttonClasses =
      'w-full py-2.5 px-4 bg-transparent border-2 border-[#25D366] text-[#1E7E34] hover:bg-[#25D366] hover:text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer';
  }

  return (
    <div className="w-full flex flex-col gap-1.5">
      <button
        onClick={handleOrder}
        disabled={isOutOfStock}
        className={`${buttonClasses} ${className}`}
        aria-label={`Order ${product.name} on WhatsApp`}
        title={`Click to chat with BVS Fashions on WhatsApp (+${whatsappNumber})`}
      >
        <MessageCircle className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current shrink-0" />
        <span>{isOutOfStock ? 'Currently Out of Stock' : 'Order on WhatsApp'}</span>
      </button>

      {/* Customer Transparency Note */}
      {showHelpText && variant === 'primary' && !isOutOfStock && (
        <div className="text-[11px] text-[#74685E] bg-[#FAF6EE] p-2.5 rounded-md border border-[#EADBCA] flex items-start gap-2 leading-relaxed">
          <CheckCircle className="w-3.5 h-3.5 text-[#25D366] shrink-0 mt-0.5" />
          <span>
            Opens your WhatsApp app or web chat with prefilled order details. Send the message to confirm outfit availability, personalized sizing, and payment options directly with BVS Fashions.
          </span>
        </div>
      )}

      {errorNotice && (
        <div className="text-[11px] text-rose-700 bg-rose-50 p-2 rounded border border-rose-200 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorNotice}</span>
        </div>
      )}
    </div>
  );
};
