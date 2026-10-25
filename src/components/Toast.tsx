import React from 'react';
import { useShop } from '../context/ShopContext';
import { ShoppingBag, Heart, CheckCircle2 } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useShop();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-fade-in shadow-xl">
      <div className="flex items-center gap-3 bg-[#282522] text-[#F7F0E5] px-4 py-3.5 rounded-lg border border-[#D4B16A]/40 shadow-2xl">
        <div className="p-1.5 rounded-full bg-[#702C38] text-[#D4B16A] shrink-0">
          {toast.type === 'cart' && <ShoppingBag className="w-4 h-4" />}
          {toast.type === 'wishlist' && <Heart className="w-4 h-4 fill-[#D4B16A]" />}
          {toast.type === 'info' && <CheckCircle2 className="w-4 h-4" />}
        </div>
        <div className="text-sm font-medium tracking-wide leading-snug">
          {toast.message}
        </div>
      </div>
    </div>
  );
};
