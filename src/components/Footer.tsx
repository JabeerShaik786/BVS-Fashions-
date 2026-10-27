import React from 'react';
import { useShop } from '../context/ShopContext';
import type { CategoryId } from '../types';
import { 
  Mail, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Lock
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setSelectedCategory, setSearchQuery, setActiveInfoModal, setViewMode } = useShop();

  const handleCategoryClick = (catId: CategoryId) => {
    setSelectedCategory(catId);
    setSearchQuery('');
    const el = document.getElementById('products-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#282522] text-[#F7F0E5] pt-16 sm:pt-20 pb-12 border-t-4 border-[#D4B16A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Columns matching Chenetha Sarees structure */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Wordmark & Narrative (4 cols) */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded bg-[#702C38] border border-[#D4B16A] flex items-center justify-center text-[#F7F0E5] font-serif font-bold text-sm">
                BVS
              </div>
              <span className="font-serif text-2xl font-bold tracking-[0.18em] text-[#F7F0E5]">
                BVS FASHIONS
              </span>
            </div>

            <p className="text-sm text-[#F7F0E5]/80 font-light leading-relaxed mb-6 max-w-sm">
              Thoughtfully selected ethnic wear that celebrates India's looms, artisans and enduring grace. Curated traditional sarees, kurtas, and celebratory family attire at honest, welcoming prices.
            </p>

            {/* WhatsApp Direct Ordering Card */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 max-w-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#25D366]/20 flex items-center justify-center text-[#25D366] shrink-0">
                  <MessageCircle className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-wider">WhatsApp Ordering & Enquiry</p>
                  <a 
                    href="https://wa.me/918639778188?text=Hello%20BVS%20Fashions!%20I%20would%20like%20to%20order%20from%20your%20collection." 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-[#D4B16A] hover:underline font-mono"
                  >
                    +91 8639778188
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Explore Links matching Chenetha Sarees (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="font-serif text-sm font-semibold tracking-[0.2em] uppercase text-[#D4B16A] mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F7F0E5]/75 font-light">
              <li>
                <button
                  onClick={() => scrollToSection('products-section')}
                  className="hover:text-white hover:underline transition-colors text-left cursor-pointer"
                >
                  All Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('collections-section')}
                  className="hover:text-white hover:underline transition-colors text-left cursor-pointer"
                >
                  Shop by Collection (Women, Men, Kids)
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('saree-wardrobe-section')}
                  className="hover:text-white hover:underline transition-colors text-left cursor-pointer"
                >
                  The Saree Wardrobe
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('kanchi-pattu')}
                  className="hover:text-white hover:underline transition-colors text-left cursor-pointer"
                >
                  Kanchi Pattu Sarees
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('banarasi')}
                  className="hover:text-white hover:underline transition-colors text-left cursor-pointer"
                >
                  Banarasi Brocades
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('brand-story-section')}
                  className="hover:text-white hover:underline transition-colors text-left cursor-pointer"
                >
                  From Loom to Legacy (Our Story)
                </button>
              </li>
            </ul>
          </div>

          {/* Visit & Connect matching Chenetha Sarees (4 cols) */}
          <div className="lg:col-span-4">
            <h4 className="font-serif text-sm font-semibold tracking-[0.2em] uppercase text-[#D4B16A] mb-4">
              Visit & connect
            </h4>
            
            <div className="space-y-3 text-xs text-[#F7F0E5]/80 font-light leading-relaxed">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4B16A] shrink-0 mt-0.5" />
                <span>Hyderabad, Telangana, India</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D4B16A] shrink-0" />
                <a href="tel:+918639778188" className="hover:text-[#D4B16A] transition-colors font-mono">
                  +91 8639778188
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D4B16A] shrink-0" />
                <a href="mailto:hello@bvsfashions.com" className="hover:text-[#D4B16A] transition-colors">
                  hello@bvsfashions.com
                </a>
              </div>

              {/* Follow Platforms */}
              <div className="pt-3">
                <p className="text-[10px] uppercase tracking-widest text-[#D4B16A] font-bold mb-2">Follow & Inquiries</p>
                <div className="flex items-center gap-2">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 text-[11px] rounded bg-white/5 border border-white/10 text-[#F7F0E5]/80 hover:text-[#D4B16A] transition-colors"
                  >
                    Instagram
                  </a>
                  <a
                    href="https://wa.me/918639778188"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 text-[11px] rounded bg-white/5 border border-white/10 text-[#F7F0E5]/80 hover:text-[#25D366] transition-colors"
                  >
                    WhatsApp Chat
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Management Portal Link */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F7F0E5]/60 font-light">
          <p>© 2026 BVS Fashions. All rights reserved. Handcrafted Indian Ethnic Wear.</p>
          
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveInfoModal('shipping')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Shipping & Delivery
            </button>
            <button
              onClick={() => setActiveInfoModal('returns')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Returns & Care
            </button>
            <button
              onClick={() => setViewMode('admin')}
              className="flex items-center gap-1.5 text-[#D4B16A] hover:underline font-semibold cursor-pointer"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
