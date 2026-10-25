import React from 'react';
import { useShop } from '../context/ShopContext';
import { X, Trash2, ShoppingBag, ShieldCheck, MessageCircle } from 'lucide-react';
import { generateCartWhatsAppOrderUrl } from '../utils/whatsapp';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartCount,
    cartSubtotal,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    setSelectedCategory,
  } = useShop();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-fade-in">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[#EADBCA] transform transition-transform"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#EADBCA] flex items-center justify-between bg-[#FAF6EE]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#702C38]" />
            <h3 className="font-serif text-lg font-semibold text-[#282522]">
              Shopping Bag ({cartCount})
            </h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-full text-[#74685E] hover:text-[#282522] hover:bg-[#EADBCA]/50 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length > 0 ? (
            cart.map((item, idx) => (
              <div
                key={`${item.product.id}-${item.selectedSize}-${idx}`}
                className="flex gap-4 p-3 rounded-xl border border-[#EADBCA] bg-[#FAF6EE]/30"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-24 object-cover rounded-lg border border-[#EADBCA] shrink-0"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-serif text-xs font-semibold text-[#282522] line-clamp-2 leading-tight">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                        className="text-[#74685E] hover:text-[#702C38] p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-[11px] text-[#74685E]">
                      <span>Size: <strong className="text-[#282522]">{item.selectedSize}</strong></span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        Shade:
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block border border-gray-300"
                          style={{ backgroundColor: item.selectedColor.hex }}
                        />
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#EADBCA]/50">
                    <div className="flex items-center border border-[#EADBCA] rounded bg-white">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.selectedSize, -1)}
                        className="px-2 py-0.5 text-xs text-[#282522] hover:bg-[#FAF6EE] font-bold"
                        title="Decrease"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 text-xs font-semibold text-[#282522] min-w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.selectedSize, 1)}
                        className="px-2 py-0.5 text-xs text-[#282522] hover:bg-[#FAF6EE] font-bold"
                        title="Increase"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="font-serif text-sm font-bold text-[#702C38]">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-[#FAF6EE] flex items-center justify-center mx-auto text-[#702C38] mb-4 border border-[#EADBCA]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-lg text-[#282522] mb-1">Your bag is empty</h4>
              <p className="text-xs text-[#74685E] max-w-xs mx-auto mb-6">
                Explore our festive sarees, kurtas, and traditional clothing for the family.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setSelectedCategory('all');
                  const el = document.getElementById('products-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-2.5 bg-[#702C38] text-white text-xs font-semibold rounded-md hover:bg-[#561E28] transition-colors"
              >
                Browse Traditional Wear
              </button>
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout Action */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-[#EADBCA] bg-[#FAF6EE]">
            <div className="space-y-2 mb-4 text-xs">
              <div className="flex justify-between text-[#74685E]">
                <span>Items Subtotal</span>
                <span>₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#74685E]">
                <span>Taxes & GST</span>
                <span className="italic">Included in product price</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#282522] pt-2 border-t border-[#EADBCA]">
                <span className="font-serif">Estimated Total</span>
                <span className="font-serif text-[#702C38]">
                  ₹{cartSubtotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                const url = generateCartWhatsAppOrderUrl(cart, cartSubtotal);
                window.open(url, '_blank', 'noopener,noreferrer');
              }}
              className="w-full py-3.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold uppercase tracking-wider rounded-md transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Order Shopping Bag on WhatsApp</span>
            </button>

            <div className="mt-2.5 p-2.5 bg-white rounded-lg border border-[#EADBCA] text-[11px] text-[#74685E] flex items-start gap-2 leading-relaxed">
              <ShieldCheck className="w-3.5 h-3.5 text-[#25D366] shrink-0 mt-0.5" />
              <span>
                Clicking opens WhatsApp with your bag items listed. Send the prefilled message to confirm availability, tailoring options, and delivery directly with BVS Fashions.
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-[#74685E]">
              <button
                onClick={clearCart}
                className="hover:text-[#702C38] underline cursor-pointer"
              >
                Empty Bag
              </button>
              <span className="flex items-center gap-1 font-medium text-[#702C38]">
                BVS Fashions • Direct WhatsApp Commerce
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
