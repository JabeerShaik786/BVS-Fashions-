import React from 'react';
import { useShop } from '../context/ShopContext';
import { Sparkles, ArrowRight, MessageCircle } from 'lucide-react';

export const FestiveCampaign: React.FC = () => {
  const { setSelectedCategory, setActiveTab } = useShop();

  const handleExplore = () => {
    setSelectedCategory('festive-wedding');
    setActiveTab('festive');
    const el = document.getElementById('products-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-16 sm:py-24 bg-[#FAF6EE] overflow-hidden border-b border-[#EADBCA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-[#702C38] text-[#F7F0E5] shadow-2xl border border-[#D4B16A]/40">
          
          {/* Background Subtle Motif */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#D4B16A_1px,transparent_1px)] [background-size:20px_20px]" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            
            {/* Content Column */}
            <div className="p-8 sm:p-12 lg:p-16 lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#561E28] border border-[#D4B16A]/40 text-[#D4B16A] text-xs font-semibold uppercase tracking-[0.2em] mb-6 shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Wedding Edit · 2026</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-[1.14] mb-6">
                Celebrate every <br />
                <span className="italic font-normal text-[#D4B16A]">sacred tradition.</span>
              </h2>

              <p className="text-[#F7F0E5]/80 text-sm sm:text-base leading-relaxed max-w-xl mb-8 font-light">
                From morning temple muhurthams to vibrant sangeet evenings and reception grand entrances, BVS Fashions weaves authentic handlooms into your family's most precious memories.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={handleExplore}
                  className="px-8 py-4 bg-[#D4B16A] hover:bg-[#E9D29E] text-[#282522] font-semibold text-xs sm:text-sm uppercase tracking-[0.16em] rounded-md transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Explore the Collection</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                <a
                  href="https://wa.me/918639778188?text=Hello%20BVS%20Fashions!%20I%20would%20like%20to%20schedule%20a%20WhatsApp%20video%20call%20to%20view%20sarees%20live."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] rounded-md transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366] fill-[#25D366]" />
                  <span>Video Call Consultation</span>
                </a>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs text-[#F7F0E5]/70">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4B16A]" />
                  Pure Kanchipuram Silks
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4B16A]" />
                  Banarasi Katan Brocades
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4B16A]" />
                  Coordinated Family Sets
                </span>
              </div>
            </div>

            {/* Visual Column */}
            <div className="lg:col-span-5 p-6 sm:p-10 lg:p-0 lg:pr-12">
              <div className="relative mx-auto max-w-sm rounded-2xl overflow-hidden shadow-2xl border-2 border-[#D4B16A]/50 aspect-[4/5] bg-black/20">
                <img
                  src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=85"
                  alt="Indian bridal brocade lehenga and silk saree celebration"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="text-[10px] font-mono tracking-wider uppercase text-[#D4B16A] block mb-1">
                    Brocade & Zardozi
                  </span>
                  <p className="font-serif text-lg font-medium">
                    Royal Heritage Bridal Edit
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
