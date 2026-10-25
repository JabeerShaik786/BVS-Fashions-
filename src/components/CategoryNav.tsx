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
    <nav className="bg-[#FAF6EE] border-b border-[#EADBCA] hidden lg:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex items-center justify-center space-x-1 py-1 overflow-x-auto scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <li key={cat.id}>
                <button
                  onClick={() => handleSelect(cat.id as CategoryId)}
                  className={`px-4 py-2 text-xs uppercase tracking-[0.16em] font-medium transition-all relative ${
                    isActive
                      ? 'text-[#702C38] font-bold'
                      : 'text-[#282522] hover:text-[#702C38]'
                  }`}
                >
                  {cat.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#702C38] rounded-full" />
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
