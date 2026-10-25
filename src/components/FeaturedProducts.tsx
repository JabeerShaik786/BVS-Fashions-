import React from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';
import { CATEGORIES } from '../data/products';
import type { CategoryId } from '../types';
import { Sparkles, SlidersHorizontal, X } from 'lucide-react';

export const FeaturedProducts: React.FC = () => {
  const {
    filteredProducts,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
  } = useShop();

  // Tab filtering: New Arrivals vs Bestsellers vs Festive Favourites
  const displayProducts = filteredProducts.filter((p) => {
    if (searchQuery.trim()) return true; // If user searched, show all search matches
    if (activeTab === 'new-arrivals') return p.isNewArrival;
    if (activeTab === 'bestsellers') return p.isBestseller;
    if (activeTab === 'festive') return p.isFestive;
    return true;
  });

  return (
    <section id="products-section" className="py-14 sm:py-20 bg-white border-y border-[#EADBCA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header & Curated Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-[#EADBCA] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#702C38] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#D4B16A]" />
              <span>Authentic Handcrafted Fashion</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#282522] font-normal tracking-tight">
              Featured Collections
            </h2>
          </div>

          {/* Collection Tabs: New Arrivals | Bestsellers | Festive Favourites */}
          <div className="flex items-center gap-1 bg-[#FAF6EE] p-1.5 rounded-lg border border-[#EADBCA] self-start md:self-auto overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('new-arrivals')}
              className={`px-4 py-2 rounded-md text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${
                activeTab === 'new-arrivals'
                  ? 'bg-[#702C38] text-white shadow-sm'
                  : 'text-[#282522] hover:text-[#702C38]'
              }`}
            >
              New Arrivals
            </button>
            <button
              onClick={() => setActiveTab('bestsellers')}
              className={`px-4 py-2 rounded-md text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${
                activeTab === 'bestsellers'
                  ? 'bg-[#702C38] text-white shadow-sm'
                  : 'text-[#282522] hover:text-[#702C38]'
              }`}
            >
              Bestsellers
            </button>
            <button
              onClick={() => setActiveTab('festive')}
              className={`px-4 py-2 rounded-md text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${
                activeTab === 'festive'
                  ? 'bg-[#702C38] text-white shadow-sm'
                  : 'text-[#282522] hover:text-[#702C38]'
              }`}
            >
              Festive Favourites
            </button>
          </div>
        </div>

        {/* Filter Chips Bar (Category Selectors + Clear Filter) */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 max-w-full">
            <span className="text-xs font-semibold text-[#74685E] flex items-center gap-1 shrink-0 mr-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Category:
            </span>
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as CategoryId)}
                  className={`text-xs px-3.5 py-1.5 rounded-full border transition-all shrink-0 ${
                    isActive
                      ? 'bg-[#702C38] text-white border-[#702C38] shadow-xs'
                      : 'bg-[#FAF6EE] text-[#282522] border-[#EADBCA] hover:border-[#702C38]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Active Search & Filter feedback */}
          {(searchQuery || selectedCategory !== 'all') && (
            <div className="flex items-center gap-2 text-xs text-[#702C38] bg-[#FAF6EE] px-3 py-1.5 rounded-full border border-[#EADBCA]">
              <span>
                {searchQuery ? `Search: "${searchQuery}"` : ''}
                {searchQuery && selectedCategory !== 'all' ? ' • ' : ''}
                {selectedCategory !== 'all'
                  ? `Category: ${CATEGORIES.find((c) => c.id === selectedCategory)?.label}`
                  : ''}
              </span>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="hover:text-black font-semibold ml-1 p-0.5"
                title="Reset filters"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Product Grid: 2 cols on mobile, 3 on tablet, 4 on desktop */}
        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-[#FAF6EE] rounded-2xl border border-[#EADBCA]">
            <p className="font-serif text-xl text-[#282522] mb-2">No clothing items match your criteria</p>
            <p className="text-sm text-[#74685E] max-w-md mx-auto mb-6">
              Try adjusting your category filter or clearing the search terms to browse our full ethnic collection.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setActiveTab('new-arrivals');
              }}
              className="px-6 py-2.5 bg-[#702C38] text-white text-xs font-semibold rounded-md hover:bg-[#561E28] transition-colors"
            >
              View All Traditional Attire
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
