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
    loadingProducts,
  } = useShop();

  // Tab filtering: New Arrivals vs Bestsellers vs Festive Favourites
  const displayProducts = filteredProducts.filter((p) => {
    if (searchQuery.trim()) return true; // If user searched, show all search matches
    if (activeTab === 'new-arrivals') return p.isNewArrival;
    if (activeTab === 'bestsellers') return p.isBestseller;
    if (activeTab === 'festive') return p.isFestive;
    return true;
  });

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
  };

  return (
    <section id="products-section" className="py-16 sm:py-24 bg-white border-b border-[#EADBCA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header matching Chenetha Sarees: "The complete collection" + "Browse with filters" */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-[#EADBCA] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#702C38] mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D4B16A]" />
              <span>Authentic Handloom Catalogue</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#282522] font-normal tracking-tight">
              The complete collection
            </h2>
          </div>

          {/* Curation Tabs: New Arrivals | Bestsellers | Festive Edit */}
          <div className="flex items-center gap-1 bg-[#FAF6EE] p-1.5 rounded-lg border border-[#EADBCA] self-start md:self-auto overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('new-arrivals')}
              className={`px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'new-arrivals'
                  ? 'bg-[#702C38] text-white shadow-xs'
                  : 'text-[#282522]/80 hover:text-[#702C38]'
              }`}
            >
              New Arrivals
            </button>
            <button
              onClick={() => setActiveTab('bestsellers')}
              className={`px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'bestsellers'
                  ? 'bg-[#702C38] text-white shadow-xs'
                  : 'text-[#282522]/80 hover:text-[#702C38]'
              }`}
            >
              Bestsellers
            </button>
            <button
              onClick={() => setActiveTab('festive')}
              className={`px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'festive'
                  ? 'bg-[#702C38] text-white shadow-xs'
                  : 'text-[#282522]/80 hover:text-[#702C38]'
              }`}
            >
              Wedding Edit
            </button>
          </div>
        </div>

        {/* Filter Chips Bar (Category Selectors + Clear Filter) */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-10">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 max-w-full">
            <span className="text-xs font-semibold text-[#74685E] flex items-center gap-1.5 shrink-0 mr-1 uppercase tracking-wider">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filter:
            </span>
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as CategoryId)}
                  className={`text-xs px-3.5 py-1.5 rounded-full border transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#702C38] text-white border-[#702C38] shadow-2xs font-semibold'
                      : 'bg-[#FAF6EE] text-[#282522]/80 border-[#EADBCA] hover:border-[#702C38]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {(selectedCategory !== 'all' || searchQuery.trim()) && (
            <button
              onClick={handleClearFilters}
              className="text-xs text-[#702C38] hover:text-[#561E28] font-semibold flex items-center gap-1 shrink-0 ml-auto cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Active Filter Summary */}
        {searchQuery.trim() && (
          <div className="mb-6 p-3 bg-[#FAF6EE] rounded-lg border border-[#EADBCA] flex items-center justify-between text-xs text-[#74685E]">
            <span>
              Showing results matching "<strong>{searchQuery}</strong>" ({displayProducts.length} items found)
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-[#702C38] font-bold underline"
            >
              Clear
            </button>
          </div>
        )}

        {/* Products Grid: 2 cols on mobile, 3 on tablet, 4 on desktop */}
        {loadingProducts ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-3 border-[#702C38] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="font-serif text-lg text-[#74685E]">Loading authentic handlooms...</p>
          </div>
        ) : displayProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center max-w-md mx-auto bg-[#FAF6EE] rounded-2xl border border-[#EADBCA] p-8">
            <p className="font-serif text-xl font-bold text-[#282522] mb-2">No matching pieces found</p>
            <p className="text-xs text-[#74685E] mb-6">
              We update our handloom catalog frequently with master weavers across Kanchipuram and Varanasi.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-6 py-2.5 bg-[#702C38] hover:bg-[#561E28] text-white text-xs font-semibold uppercase tracking-wider rounded-md transition-colors"
            >
              View Full Collection
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
