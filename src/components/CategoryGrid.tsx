import React from 'react';
import { useShop } from '../context/ShopContext';
import { CATEGORY_CARDS } from '../data/products';
import type { CategoryId } from '../types';
import { ArrowRight } from 'lucide-react';

export const CategoryGrid: React.FC = () => {
  const { setSelectedCategory, setSearchQuery } = useShop();

  const handleCardClick = (id: string) => {
    setSelectedCategory(id as CategoryId);
    setSearchQuery('');
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-14 sm:py-20 bg-[#F7F0E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#702C38] mb-2">
            Curated Collections
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#282522] font-normal tracking-tight">
            Shop by Category
          </h2>
          <div className="w-12 h-0.5 bg-[#D4B16A] mx-auto mt-3 mb-3" />
          <p className="text-[#74685E] text-sm sm:text-base">
            Handcrafted sarees, tailored kurtas, and joyful kids’ outfits designed for every Indian celebration.
          </p>
        </div>

        {/* Responsive Grid: 2 cols on mobile, 3 on tablet, 5 on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5">
          {CATEGORY_CARDS.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCardClick(category.id)}
              className="group cursor-pointer bg-white rounded-xl overflow-hidden border border-[#EADBCA] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Category Image */}
              <div className="relative aspect-[3/4] overflow-hidden bg-[#FAF6EE]">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />
                
                {/* Category Tag */}
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                  <span className="text-[9px] sm:text-[10px] font-medium tracking-wide uppercase px-1.5 sm:px-2 py-0.5 bg-white/95 text-[#702C38] rounded-full backdrop-blur-xs">
                    {category.tag}
                  </span>
                </div>

                {/* Card Title on Image */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3 text-white">
                  <h3 className="font-serif text-sm sm:text-lg font-medium tracking-wide leading-snug line-clamp-2">
                    {category.name}
                  </h3>
                </div>
              </div>

              {/* Bottom Card Action */}
              <div className="p-2.5 sm:p-3.5 bg-[#FAF6EE] flex items-center justify-between border-t border-[#EADBCA] group-hover:bg-[#702C38] transition-colors">
                <span className="text-[11px] sm:text-xs font-medium text-[#702C38] group-hover:text-white transition-colors truncate mr-1">
                  Explore
                </span>
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white flex items-center justify-center text-[#702C38] group-hover:bg-[#D4B16A] group-hover:text-[#282522] transition-colors shrink-0">
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
