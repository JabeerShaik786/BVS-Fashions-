import React from 'react';
import { useShop } from '../context/ShopContext';
import { SHOP_COLLECTIONS } from '../data/products';
import type { CategoryId } from '../types';
import { ArrowRight, Sparkles } from 'lucide-react';

export const CategoryGrid: React.FC = () => {
  const { setSelectedCategory, setSearchQuery } = useShop();

  const handleCardClick = (id: CategoryId) => {
    setSelectedCategory(id);
    setSearchQuery('');
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewAll = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="collections-section" className="py-16 sm:py-24 bg-[#F7F0E5] border-b border-[#EADBCA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header matching Chenetha Sarees: "Shop by collection" + "View all collections" */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-14">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#702C38] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#D4B16A]" />
              <span>Family Ethnic Wear</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#282522] font-normal tracking-tight">
              Shop by collection
            </h2>
          </div>

          <button
            onClick={handleViewAll}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#702C38] hover:text-[#561E28] transition-colors pb-1 border-b border-[#702C38]/40 hover:border-[#702C38] self-start sm:self-auto cursor-pointer"
          >
            <span>View all collections</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3 Editorial Portrait Cards (Women, Men, Kids) matching Chenetha Sarees layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {SHOP_COLLECTIONS.map((col) => (
            <div
              key={col.id}
              onClick={() => handleCardClick(col.id)}
              className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-[#EADBCA] shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col relative"
            >
              {/* Image Container with 4:5 aspect ratio */}
              <div className="relative aspect-[4/5] overflow-hidden bg-[#FAF6EE]">
                <img
                  src={col.image}
                  alt={col.title}
                  className="w-full h-full object-cover object-top group-hover:scale-106 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#282522]/85 via-black/25 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />
                
                {/* Tag Badge */}
                <div className="absolute top-4 left-4">
                  <span className="text-[10px] font-semibold tracking-[0.2em] uppercase px-3 py-1 bg-white/95 text-[#702C38] rounded-full shadow-xs backdrop-blur-xs">
                    {col.tag}
                  </span>
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h3 className="font-serif text-2xl sm:text-3xl font-medium tracking-wide mb-1 text-white">
                    {col.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/80 font-light mb-4 line-clamp-2">
                    {col.subtitle}
                  </p>

                  <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#D4B16A] group-hover:text-white transition-colors">
                    <span>Shop collection</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
