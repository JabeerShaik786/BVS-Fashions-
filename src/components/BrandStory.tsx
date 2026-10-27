import React from 'react';
import { HeartHandshake, Compass, Sparkles, ArrowRight } from 'lucide-react';

export const BrandStory: React.FC = () => {
  return (
    <section id="brand-story-section" className="py-16 sm:py-24 bg-[#F7F0E5] border-b border-[#EADBCA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Brand Values & Philosophy matching Chenetha Sarees: "From loom to legacy" */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#702C38] mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#D4B16A]" />
              <span>From loom to legacy</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#282522] font-normal tracking-tight mb-6 leading-tight">
              Made slowly. <br />
              <span className="italic text-[#702C38]">Loved for generations.</span>
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#74685E] leading-relaxed font-light">
              <p className="font-serif text-lg text-[#282522] font-normal italic">
                “We work with trusted weaving communities to bring you sarees with a soul—and the hand of their maker still visible.”
              </p>
              <p>
                In Indian families, clothing is never merely fabric; it is memory, blessing, and ceremony. Whether it is a grandmother presenting an auspicious Kanjeevaram to a bride, a father dressing his son in his first handloom kurta, or a daughter twirling in her festive pattu pavada, these threads hold life's most cherished milestones.
              </p>
              <p>
                BVS Fashions was born with a simple, noble conviction: authentic Indian handloom textiles and celebratory ethnic wear should be welcoming and accessible. By forging direct ties with master weavers across Kanchipuram, Varanasi, and regional clusters, we bring pure silks and genuine zari directly to your family at honest, fair pricing.
              </p>
            </div>

            {/* Value Highlights */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white border border-[#EADBCA] shadow-2xs">
                <HeartHandshake className="w-5 h-5 text-[#702C38] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif text-sm font-bold text-[#282522]">
                    Direct Weaver Partnerships
                  </h4>
                  <p className="text-xs text-[#74685E] mt-1 font-light leading-relaxed">
                    Fair compensation for artisans and transparent, accessible pricing for your family.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white border border-[#EADBCA] shadow-2xs">
                <Compass className="w-5 h-5 text-[#702C38] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif text-sm font-bold text-[#282522]">
                    Crafted for Celebrations
                  </h4>
                  <p className="text-xs text-[#74685E] mt-1 font-light leading-relaxed">
                    Pure silk fabrics, skin-gentle linings for children, and breathable comfort for long pujas.
                  </p>
                </div>
              </div>
            </div>

            {/* WhatsApp Link */}
            <div className="mt-8 flex items-center gap-4">
              <a
                href="https://wa.me/918639778188?text=Hello%20BVS%20Fashions!%20I%20love%20your%20story%20and%20would%20like%20to%20learn%20more%20about%20your%20handloom%20sarees."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#702C38] hover:text-[#561E28] pb-1 border-b border-[#702C38]"
              >
                <span>Connect with our family on WhatsApp</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

          {/* Right: Visual Editorial Collage */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-sm sm:max-w-md">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                <img
                  src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=85"
                  alt="Authentic Indian weaver craft with emerald silk and gold zari pallu"
                  className="w-full h-full object-cover hover:scale-104 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Inset Provenance Card */}
              <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-white p-4 rounded-2xl border border-[#EADBCA] shadow-xl max-w-[240px] hidden xs:block">
                <p className="text-[10px] uppercase tracking-widest text-[#D4B16A] font-bold">Loom Provenance</p>
                <p className="font-serif text-sm font-bold text-[#282522] mt-0.5">Authentic Handlooms</p>
                <p className="text-[11px] text-[#74685E] mt-0.5 font-light">Woven by 3rd-generation artisan families across India</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
