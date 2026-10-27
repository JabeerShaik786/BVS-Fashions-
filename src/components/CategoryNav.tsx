import React from 'react';
import { useShop } from '../context/ShopContext';
import { CATEGORIES } from '../data/products';
import type { CategoryId } from '../types';

export const CategoryNav: React.FC = () => {
  const { selectedCategory, setSelectedCategory, setSearchQuery } = useShop();

  const handleSelect = (id: CategoryId) => {
    setSelectedCategory(id);
    setSearchQuery('');
    const element = document.getElementById('products-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-[#FAF6EE] border-b border-[#EADBCA] overflow-x-auto scrollbar-none py-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex items-center justify-start lg:justify-center space-x-1 sm:space-x-2 whitespace-nowrap min-w-max">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <li key={cat.id}>
                <button
                  onClick={() => handleSelect(cat.id as CategoryId)}
                  className={`px-3 sm:px-4 py-2 text-[11px] sm:text-xs uppercase tracking-[0.16em] font-medium transition-all relative cursor-pointer ${
                    isActive
                      ? 'text-[#702C38] font-bold'
                      : 'text-[#282522]/80 hover:text-[#702C38]'
                  }`}
                >
                  {cat.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 sm:left-4 sm:right-4 h-[2px] bg-[#702C38] rounded-full" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};
