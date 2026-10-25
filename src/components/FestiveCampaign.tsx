import React from 'react';
import { useShop } from '../context/ShopContext';
import { Sparkles, ArrowRight } from 'lucide-react';

export const FestiveCampaign: React.FC = () => {
  const { setSelectedCategory, setActiveTab } = useShop();

  const handleExplore = () => {
    setSelectedCategory('festive-wedding');
    setActiveTab('festive');
    const el = document.getElementById('products-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-14 sm:py-20 bg-[#FAF6EE] overflow-hidden border-b border-[#EADBCA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden bg-[#702C38] text-[#F7F0E5] shadow-xl border border-[#D4B16A]/30">
          
          {/* Background Motif / Subtle Texture */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#D4B16A_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Content Column */}
            <div className="p-8 sm:p-12 lg:p-16 lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#561E28] border border-[#D4B16A]/40 text-[#D4B16A] text-xs font-semibold uppercase tracking-wider mb-5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Wedding & Festive Campaign</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-[1.15] mb-5">
                Celebrate Every <br />
                <span className="italic font-normal text-[#D4B16A]">Tradition.</span>
              </h2>

              <p className="text-[#F7F0E5]/80 text-sm sm:text-base leading-relaxed max-w-xl mb-8">
                From auspicious morning temple poojas to vibrant sangeet nights and sacred wedding mandaps, BVS Fashions brings coordinated family ensembles crafted with authentic Indian weaving traditions at honest prices.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={handleExplore}
                  className="px-8 py-3.5 bg-[#D4B16A] hover:bg-[#E9D29E] text-[#282522] font-semibold text-sm rounded-md tracking-wide transition-all shadow-md flex items-center justify-center gap-2 group"
                >
                  <span>Explore the Collection</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
                <div className="text-xs text-[#F7F0E5]/70 flex items-center justify-center sm:justify-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D4B16A]" />
                  <span>Sarees • Lehengas • Men's Kurtas • Kids Sets</span>
                </div>
              </div>
            </div>

            {/* Campaign Visual Showcase */}
            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-0 lg:pr-8">
              <div className="relative mx-auto max-w-sm rounded-xl overflow-hidden shadow-2xl border-2 border-[#D4B16A]/50 aspect-[4/5]">
                <img
                  src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80"
                  alt="Traditional Indian wedding and festive ethnic wear by BVS Fashions"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-center sm:text-left">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4B16A]">
                    Heritage Edition
                  </span>
                  <p className="font-serif text-base text-white font-medium">
                    Grand Brocades & Pure Zari Craftsmanship
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
