import React from 'react';
import { useShop } from '../context/ShopContext';
import { SAREE_DRAPE_CATEGORIES } from '../data/products';
import type { CategoryId } from '../types';
import { Sparkles, ArrowRight } from 'lucide-react';

export const SareeWardrobe: React.FC = () => {
  const { setSelectedCategory, setSearchQuery } = useShop();

  const handleDrapeClick = (id: CategoryId) => {
    setSelectedCategory(id);
    setSearchQuery('');
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="saree-wardrobe-section" className="py-16 sm:py-24 bg-[#FAF6EE] border-b border-[#EADBCA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header matching Chenetha Sarees: "The saree wardrobe" / "Saree drape categories" */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#702C38] mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-[#D4B16A]" />
            <span>The Saree Wardrobe</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#282522] font-normal tracking-tight mb-4">
            Saree drape categories
          </h2>
          <div className="w-12 h-0.5 bg-[#D4B16A] mx-auto mb-4" />
          <p className="text-[#74685E] text-sm sm:text-base font-light leading-relaxed">
            Every region, loom, and thread tells a story. Explore our authentic handloom traditions, each curated for its signature weave, border grandeur, and ceremonial grace.
          </p>
        </div>

        {/* 8 Saree Drape Category Grid (2 cols on mobile, 4 on tablet/desktop) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {SAREE_DRAPE_CATEGORIES.map((drape) => (
            <div
              key={drape.id}
              onClick={() => handleDrapeClick(drape.id)}
              className="group cursor-pointer bg-white rounded-xl overflow-hidden border border-[#EADBCA] shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Image Frame with portrait ratio */}
              <div className="relative aspect-[3/4] overflow-hidden bg-[#F7F0E5]">
                <img
                  src={drape.image}
                  alt={drape.title}
                  className="w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-600 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#282522]/85 via-black/20 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

                {/* Subtitle / Weave tag */}
                <div className="absolute top-2.5 left-2.5">
                  <span className="text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 bg-white/95 text-[#702C38] rounded-full shadow-2xs backdrop-blur-xs">
                    {drape.tag}
                  </span>
                </div>

                {/* Category Title & Drape Subtitle on Image */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-serif text-base sm:text-lg font-medium tracking-wide leading-tight mb-0.5 text-white">
                    {drape.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-[#EADBCA] font-light">
                    {drape.subtitle}
                  </p>
                </div>
              </div>

              {/* Bottom Card Footer Action */}
              <div className="p-3 bg-[#FAF6EE] flex items-center justify-between border-t border-[#EADBCA] group-hover:bg-[#702C38] transition-colors">
                <span className="text-[11px] font-medium tracking-wider uppercase text-[#702C38] group-hover:text-white transition-colors">
                  View Drapes
                </span>
                <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[#702C38] group-hover:bg-[#D4B16A] group-hover:text-[#282522] transition-colors shrink-0">
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
