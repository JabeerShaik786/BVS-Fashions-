import React from 'react';
import { HeartHandshake, Compass, Sparkles } from 'lucide-react';

export const BrandStory: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-[#FAF6EE] border-b border-[#EADBCA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left: Brand Values & Philosophy */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#702C38] mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#D4B16A]" />
              <span>Rooted in Family & Culture</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl text-[#282522] font-normal tracking-tight mb-6">
              The Story Behind <span className="italic text-[#702C38]">BVS Fashions</span>
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#74685E] leading-relaxed">
              <p>
                In Indian culture, clothing is never merely fabric; it is memory, blessing, and celebration. Whether it is an elder bestowing a silk saree during a housewarming, a father selecting his boy’s first kurta, or a daughter twirling in her festive lehenga, our clothes mark life’s sacred moments.
              </p>
              <p>
                BVS Fashions was established with a singular, humble vision: to make authentic Indian ethnic wear accessible to real families. We believe that fine handloom borders, vibrant dyes, and ceremonial attire should be honest in their pricing without sacrificing dignity, comfort, or quality.
              </p>
              <p>
                We collaborate with regional weaving clusters, focusing on durable fabrics, comfortable cotton linings for children, and timeless designs that can be worn across generations with pride.
              </p>
            </div>

            {/* Highlights */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3.5 rounded-lg bg-white border border-[#EADBCA]">
                <HeartHandshake className="w-5 h-5 text-[#702C38] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#282522] uppercase tracking-wide">
                    Approachable & Family-Centric
                  </h4>
                  <p className="text-xs text-[#74685E] mt-0.5">
                    Thoughtfully designed so every family member finds an outfit they love.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-lg bg-white border border-[#EADBCA]">
                <Compass className="w-5 h-5 text-[#702C38] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#282522] uppercase tracking-wide">
                    Crafted for Comfort
                  </h4>
                  <p className="text-xs text-[#74685E] mt-0.5">
                    Breathable weaves and skin-friendly linings for long celebrations.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right: Visual Storytelling Collage */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-sm sm:max-w-md">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-white">
                <img
                  src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80"
                  alt="Traditional Indian weaver craft and saree pallu embroidery"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Story badge */}
              <div className="absolute -bottom-4 -right-4 sm:-right-6 bg-white p-4 rounded-xl shadow-lg border border-[#EADBCA] max-w-[210px] text-center">
                <p className="font-serif text-2xl font-bold text-[#702C38]">100%</p>
                <p className="text-[11px] font-medium text-[#282522] uppercase tracking-wider">
                  Honest Indian Fashion
                </p>
                <p className="text-[10px] text-[#74685E] mt-0.5">
                  Dressing celebrations with trust
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
