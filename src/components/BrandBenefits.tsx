import React from 'react';
import { Sparkles, Truck, MessageCircle, HeartHandshake } from 'lucide-react';

export const BrandBenefits: React.FC = () => {
  const benefits = [
    {
      icon: Sparkles,
      title: 'Authentic Handloom Weaves',
      description: 'Pure Kanchipuram and Banarasi silks woven with genuine zari by master artisan looms.',
    },
    {
      icon: HeartHandshake,
      title: 'Direct Weaver Value',
      description: 'By working directly with weaving communities, we offer wedding silks at honest family prices.',
    },
    {
      icon: Truck,
      title: 'Pan-India & Global Delivery',
      description: 'Carefully packaged in protective tissue, dispatched directly to your doorstep with tracking.',
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp Video Shopping',
      description: 'Inspect pallu details, silk luster, and drape weight over personal WhatsApp video calls (+91 8639778188).',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-[#EADBCA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header matching Chenetha Sarees: "The BVS promise" / "Craft deserves to be felt" */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#702C38] mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-[#D4B16A]" />
            <span>The BVS Promise</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#282522] font-normal tracking-tight mb-4">
            Craft deserves to be felt
          </h2>
          <div className="w-12 h-0.5 bg-[#D4B16A] mx-auto mb-4" />
          <p className="text-[#74685E] text-sm sm:text-base font-light leading-relaxed">
            Every motif, border and pallu carries the rhythm of skilled hands. We select pieces that respect that work and make it part of your family’s everyday celebrations.
          </p>
        </div>

        {/* 4 Trust Feature Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {benefits.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className="flex flex-col items-center sm:items-start text-center sm:text-left p-6 rounded-2xl bg-[#FAF6EE]/60 border border-[#EADBCA]/80 hover:border-[#D4B16A] hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-[#EADBCA] flex items-center justify-center text-[#702C38] mb-4 shadow-2xs">
                  <Icon className="w-5 h-5 text-[#702C38]" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#282522] mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#74685E] font-light leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
