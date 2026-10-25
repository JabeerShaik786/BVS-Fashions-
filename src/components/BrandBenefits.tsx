import React from 'react';
import { Users, Wallet, CalendarDays, Headphones } from 'lucide-react';

export const BrandBenefits: React.FC = () => {
  const benefits = [
    {
      icon: Users,
      title: 'Styles for the Whole Family',
      description: 'Coordinated ethnic attire for women, men, and children under one welcoming roof.',
    },
    {
      icon: Wallet,
      title: 'Choices for Every Budget',
      description: 'Thoughtful pricing options spanning everyday pooja cottons to grand wedding silks.',
    },
    {
      icon: CalendarDays,
      title: 'Variety for All Occasions',
      description: 'Drapes and ensembles curated for festivals, sangeet ceremonies, rituals, and family gatherings.',
    },
    {
      icon: Headphones,
      title: 'Helpful Customer Support',
      description: 'Friendly assistance to help you select sizing, fabric care, and outfit matching.',
    },
  ];

  return (
    <section className="py-14 sm:py-16 bg-white border-b border-[#EADBCA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Benefit Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className="flex flex-col items-center sm:items-start text-center sm:text-left p-4 rounded-xl bg-[#FAF6EE]/50 border border-[#EADBCA]/60 hover:border-[#D4B16A] transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-[#FAF6EE] border border-[#EADBCA] flex items-center justify-center text-[#702C38] mb-4 shadow-2xs">
                  <Icon className="w-6 h-6 text-[#702C38]" />
                </div>
                <h3 className="font-serif text-base font-semibold text-[#282522] mb-1.5">
                  {item.title}
                </h3>
                <p className="text-xs text-[#74685E] leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Transparent Brand Positioning Note */}
        <div className="mt-8 text-center">
          <p className="text-[11px] text-[#74685E]/70 max-w-xl mx-auto italic">
            * These pillars represent BVS Fashions’ intended brand positioning. Store policies, order inquiries, and fabric details can be tailored directly with our customer care team.
          </p>
        </div>

      </div>
    </section>
  );
};
