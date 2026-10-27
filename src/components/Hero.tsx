import React from 'react';
import { useShop } from '../context/ShopContext';
import { ArrowRight, Sparkles, MessageCircle } from 'lucide-react';

export const Hero: React.FC = () => {
  const { setSelectedCategory } = useShop();

  const handleShopCollections = () => {
    setSelectedCategory('sarees');
    const el = document.getElementById('products-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero-section" className="relative bg-[#FAF6EE] overflow-hidden border-b border-[#EADBCA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Editorial Headline & Copy matching Chenetha Sarees */}
          <div className="lg:col-span-7 z-10 text-center lg:text-left">
            
            {/* The Wedding Edit · 2026 Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EADBCA]/70 border border-[#D4B16A]/60 text-[#702C38] text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] mb-6 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#D4B16A]" />
              <span>The Wedding Edit · 2026</span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#282522] font-normal tracking-tight leading-[1.12] mb-6">
              Timeless handloom sarees, <br className="hidden sm:inline" />
              <span className="italic font-normal text-[#702C38]">chosen for the moments</span> <br className="hidden sm:inline" />
              you'll remember forever.
            </h1>

            {/* Editorial Description */}
            <p className="text-[#74685E] text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8 font-light">
              Crafted slowly by India's master weaving communities. Pure Kanchi Pattu, heirloom Banarasi brocades, and luminous zari silks tailored for auspicious weddings, sacred rituals, and joyful family celebrations.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <button
                onClick={handleShopCollections}
                className="w-full sm:w-auto px-8 py-4 bg-[#702C38] hover:bg-[#561E28] text-white text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] rounded-md transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Explore the Collection</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href="https://wa.me/918639778188?text=Hello%20BVS%20Fashions!%20I%20would%20like%20to%20request%20a%20personal%20WhatsApp%20consultation%20for%20sarees%20and%20wedding%20wear."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-4 bg-white hover:bg-[#FAF6EE] text-[#702C38] border border-[#EADBCA] hover:border-[#702C38] text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] rounded-md transition-all shadow-2xs flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366] fill-[#25D366]" />
                <span>WhatsApp Consultation</span>
              </a>
            </div>

            {/* Trust points & craft provenance */}
            <div className="mt-10 pt-8 border-t border-[#EADBCA] grid grid-cols-3 gap-3 sm:gap-6 text-center lg:text-left">
              <div>
                <p className="font-serif text-base sm:text-xl font-bold text-[#702C38]">Pure Weaves</p>
                <p className="text-[10px] sm:text-xs text-[#74685E] mt-0.5 tracking-wide">Certified Silk & Zari</p>
              </div>
              <div>
                <p className="font-serif text-base sm:text-xl font-bold text-[#702C38]">From the Loom</p>
                <p className="text-[10px] sm:text-xs text-[#74685E] mt-0.5 tracking-wide">Master Weaver Craft</p>
              </div>
              <div>
                <p className="font-serif text-base sm:text-xl font-bold text-[#702C38]">Honest Value</p>
                <p className="text-[10px] sm:text-xs text-[#74685E] mt-0.5 tracking-wide">Direct Family Pricing</p>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Composition with High-Fashion Saree Photography */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none">
              
              {/* Main Editorial Hero Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white aspect-[3/4] bg-[#EADBCA]/30">
                <img
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85"
                  alt="Traditional Indian crimson Kanchi pattu saree with gold zari border"
                  className="w-full h-full object-cover object-top hover:scale-104 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#282522]/75 via-black/10 to-transparent" />
                
                {/* Floating Image Label */}
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="inline-block text-[10px] font-semibold tracking-[0.2em] uppercase bg-[#D4B16A] text-[#282522] px-2.5 py-1 rounded mb-2 shadow-xs">
                    Temple Heritage Weave
                  </span>
                  <p className="font-serif text-xl sm:text-2xl font-medium leading-snug">
                    Aruna Crimson Kanchi Pattu
                  </p>
                  <p className="text-xs text-white/80 font-light mt-1">
                    Handwoven with pure gold weft border · ₹4,999
                  </p>
                </div>
              </div>

              {/* Floating Craft Badge (Bottom-Left) */}
              <div className="hidden sm:flex absolute -bottom-5 -left-6 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-[#EADBCA] shadow-xl items-center gap-3 max-w-xs animate-fade-in">
                <div className="w-10 h-10 rounded-full bg-[#FAF6EE] border border-[#D4B16A] flex items-center justify-center text-[#702C38] shrink-0">
                  <Sparkles className="w-5 h-5 text-[#D4B16A]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#282522] font-serif">Made Slowly. Loved for Generations.</p>
                  <p className="text-[10px] text-[#74685E]">Woven on traditional Indian handlooms</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
