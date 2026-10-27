import React from 'react';
import { ArrowRight, Truck, ShieldCheck, RotateCcw, Award } from 'lucide-react';
import heroBanner from '../assets/hero-banner.png';

export const Hero: React.FC = () => {
  const handleExploreCollection = () => {
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero-section" className="relative w-full overflow-hidden bg-[#F7F0E5]">
      {/* 1. Full-Width Edge-to-Edge Hero Banner */}
      <div className="relative w-full min-h-[540px] h-[620px] lg:h-[675px] xl:h-[720px] overflow-hidden flex items-center">
        {/* Background Photograph: Indian woman in deep-maroon Kanchipuram silk saree */}
        <img
          src={heroBanner}
          alt="Indian woman wearing deep-maroon Kanchipuram silk saree with antique-gold zari border"
          className="absolute inset-0 w-full h-full object-cover object-[58%_top] sm:object-[62%_top] lg:object-[65%_top] xl:object-[58%_top] select-none"
          loading="eager"
        />

        {/* Soft heritage wall gradient blend - preserves model crispness while maximizing text readability */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-[#F7F0E5]/95 via-[#F7F0E5]/75 via-40% to-transparent to-70% pointer-events-none hidden sm:block" 
          aria-hidden="true" 
        />
        <div 
          className="absolute inset-0 bg-gradient-to-t from-[#F7F0E5] via-[#F7F0E5]/85 via-50% to-[#F7F0E5]/40 pointer-events-none sm:hidden" 
          aria-hidden="true" 
        />

        {/* Left-Side Editorial Text Block: ~11% from left edge on wide screens */}
        <div className="relative z-10 w-full h-full flex flex-col justify-center">
          <div className="w-full max-w-[1920px] mx-auto px-6 sm:px-10 lg:pl-[11%] lg:pr-10 py-8 lg:py-0">
            <div className="max-w-[620px] lg:max-w-[760px] xl:max-w-none">
              
              {/* Eyebrow Label */}
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[3px] text-[#B98136] mb-3 sm:mb-4 lg:mb-5 block">
                THE WEDDING EDIT · 2026
              </p>

              {/* Main Heading */}
              <h1 className="font-serif text-[40px] sm:text-6xl md:text-7xl lg:text-[84px] xl:text-[92px] text-[#261C1B] font-medium tracking-[-0.03em] leading-[1.04] mb-4 sm:mb-5 lg:mb-6 xl:whitespace-nowrap">
                Tradition, woven for your story.
              </h1>

              {/* Description */}
              <p className="text-[#665550] text-base sm:text-lg lg:text-[20px] max-w-[570px] leading-[1.7] mb-7 sm:mb-8 lg:mb-10 font-normal">
                Timeless handloom sarees, chosen for the moments you'll remember forever.
              </p>

              {/* Primary CTA Button */}
              <button
                onClick={handleExploreCollection}
                className="w-full sm:w-[276px] h-[54px] sm:h-[59px] bg-[#701522] hover:bg-[#561019] text-white text-[13px] sm:text-[14px] font-semibold tracking-[0.04em] flex items-center justify-center gap-3 transition-all duration-200 shadow-sm cursor-pointer rounded-[2px] group"
              >
                <span>Explore the collection</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* 2. Full-Width Deep-Maroon Benefits Strip (Directly touching hero bottom edge) */}
      <div className="w-full bg-[#701522] min-h-[72px] lg:h-[88px] flex items-center border-t border-white/10">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 py-3 lg:py-0">
          <div className="grid grid-cols-2 lg:grid-cols-4 items-center divide-y lg:divide-y-0 lg:divide-x divide-white/15">
            
            {/* 1. Free shipping */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 py-3 lg:py-0 px-2 sm:px-4">
              <Truck className="w-[18px] h-[18px] text-[#D4B16A] shrink-0 stroke-[1.8]" />
              <span className="text-white text-xs sm:text-[14px] lg:text-[15px] font-medium tracking-wide text-center">
                Free shipping over ₹2,999
              </span>
            </div>

            {/* 2. Authenticity assured */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 py-3 lg:py-0 px-2 sm:px-4">
              <ShieldCheck className="w-[18px] h-[18px] text-[#D4B16A] shrink-0 stroke-[1.8]" />
              <span className="text-white text-xs sm:text-[14px] lg:text-[15px] font-medium tracking-wide text-center">
                Authenticity assured
              </span>
            </div>

            {/* 3. 7 day easy returns */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 py-3 lg:py-0 px-2 sm:px-4">
              <RotateCcw className="w-[18px] h-[18px] text-[#D4B16A] shrink-0 stroke-[1.8]" />
              <span className="text-white text-xs sm:text-[14px] lg:text-[15px] font-medium tracking-wide text-center">
                7 day easy returns
              </span>
            </div>

            {/* 4. Curated handlooms */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 py-3 lg:py-0 px-2 sm:px-4">
              <Award className="w-[18px] h-[18px] text-[#D4B16A] shrink-0 stroke-[1.8]" />
              <span className="text-white text-xs sm:text-[14px] lg:text-[15px] font-medium tracking-wide text-center">
                Curated handlooms
              </span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
