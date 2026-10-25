import React from 'react';
import { useShop } from '../context/ShopContext';
import { ArrowRight, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  const { setSelectedCategory, setActiveTab } = useShop();

  const handleShopCollections = () => {
    setSelectedCategory('all');
    const el = document.getElementById('products-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleExploreNewArrivals = () => {
    setActiveTab('new-arrivals');
    setSelectedCategory('all');
    const el = document.getElementById('products-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative bg-[#FAF6EE] overflow-hidden border-b border-[#EADBCA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Editorial Headline & Copy */}
          <div className="lg:col-span-6 z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EADBCA]/60 border border-[#D4B16A]/50 text-[#702C38] text-xs font-semibold uppercase tracking-wider mb-5">
              <Sparkles className="w-3.5 h-3.5 text-[#D4B16A]" />
              <span>Authentic Indian Ethnic Wear</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#282522] font-normal tracking-tight leading-[1.15] mb-5">
              Traditions for <br />
              <span className="italic font-normal text-[#702C38]">Every Celebration.</span>
            </h1>

            <p className="text-[#74685E] text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8 font-normal">
              Discover traditional styles for every generation, every occasion, and every special moment. Curated sarees, kurtas, and festive ensembles made to feel welcoming and affordable.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <button
                onClick={handleShopCollections}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#702C38] hover:bg-[#561E28] text-white text-sm font-semibold tracking-wide rounded-md transition-all shadow-md flex items-center justify-center gap-2 group"
              >
                <span>Shop Collections</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={handleExploreNewArrivals}
                className="w-full sm:w-auto px-7 py-3.5 bg-transparent hover:bg-[#EADBCA]/40 text-[#702C38] border border-[#702C38] text-sm font-semibold tracking-wide rounded-md transition-all"
              >
                Explore New Arrivals
              </button>
            </div>

            {/* Trust points for Indian family shoppers */}
            <div className="mt-8 sm:mt-10 pt-5 sm:pt-6 border-t border-[#EADBCA] grid grid-cols-3 gap-2 sm:gap-4 text-center lg:text-left">
              <div>
                <p className="font-serif text-sm sm:text-lg font-bold text-[#702C38]">3 Generations</p>
                <p className="text-[10px] sm:text-xs text-[#74685E] mt-0.5">Kids, Men & Women</p>
              </div>
              <div>
                <p className="font-serif text-sm sm:text-lg font-bold text-[#702C38]">Handpicked</p>
                <p className="text-[10px] sm:text-xs text-[#74685E] mt-0.5">Authentic Weaves</p>
              </div>
              <div>
                <p className="font-serif text-sm sm:text-lg font-bold text-[#702C38]">Honest Value</p>
                <p className="text-[10px] sm:text-xs text-[#74685E] mt-0.5">Festive Pricing</p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Composition with Ethnic Fashion Photography */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Editorial Hero Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] sm:aspect-[4/5] bg-[#EADBCA]/30">
                <img
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85"
                  alt="Indian traditional saree and ethnic clothing for festive celebrations"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#282522]/60 via-transparent to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="inline-block text-[11px] font-semibold tracking-widest uppercase bg-[#D4B16A] text-[#282522] px-2.5 py-0.5 rounded mb-2">
                    Festive 2026 Collection
                  </span>
                  <p className="font-serif text-xl sm:text-2xl font-medium leading-snug">
                    Banarasi, Kanjeevaram & Family Celebration Attire
                  </p>
                </div>
              </div>

              {/* Inset Complementary Card showing Family / Men's / Kids ethnic wear */}
              <div className="hidden sm:flex absolute -bottom-6 -left-8 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-[#EADBCA] shadow-xl items-center gap-3.5 max-w-xs">
                <img
                  src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=200&q=80"
                  alt="Men's Kurta & Traditional Attire"
                  className="w-14 h-16 object-cover rounded-lg border border-[#EADBCA]"
                />
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#702C38] tracking-wider">
                    Family Matching Sets
                  </span>
                  <p className="text-xs font-semibold text-[#282522] leading-tight mt-0.5">
                    Coordinated Festive Colors for Weddings & Pujas
                  </p>
                  <p className="text-[11px] text-[#74685E] mt-1">Starting from ₹1,399</p>
                </div>
              </div>

              {/* Decorative Subtle Gold Accent Frame */}
              <div className="absolute -top-3 -right-3 w-32 h-32 border-2 border-[#D4B16A]/40 rounded-2xl -z-10 hidden sm:block" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
