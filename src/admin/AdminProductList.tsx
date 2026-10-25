import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Eye, 
  Edit3, 
  Trash2, 
  Sparkles, 
  SlidersHorizontal,
  Check,
  X
} from 'lucide-react';
import type { DbProduct, DbCategory } from '../../server/db';

interface AdminProductListProps {
  products: DbProduct[];
  categories: DbCategory[];
  loading: boolean;
  onAddNew: () => void;
  onEdit: (product: DbProduct) => void;
  onPreview: (product: DbProduct) => void;
  onDeleteRequest: (product: DbProduct) => void;
  onTogglePublish: (id: string, currentStatus: boolean) => Promise<void>;
}

export const AdminProductList: React.FC<AdminProductListProps> = ({
  products,
  categories,
  loading,
  onAddNew,
  onEdit,
  onPreview,
  onDeleteRequest,
  onTogglePublish,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [selectedPublished, setSelectedPublished] = useState<'all' | 'published' | 'draft'>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Client filtering
  const filteredProducts = products.filter((p) => {
    if (selectedCat !== 'all' && p.category_id !== selectedCat) return false;
    if (selectedPublished === 'published' && !p.is_published) return false;
    if (selectedPublished === 'draft' && p.is_published) return false;
    if (selectedStatus !== 'all' && p.availability_status !== selectedStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const matchName = p.name.toLowerCase().includes(q);
      const matchSku = p.sku.toLowerCase().includes(q);
      const matchFabric = p.fabric?.toLowerCase().includes(q);
      if (!matchName && !matchSku && !matchFabric) return false;
    }
    return true;
  });

  const handlePublishToggle = async (id: string, currentStatus: boolean) => {
    setTogglingId(id);
    try {
      await onTogglePublish(id, !currentStatus);
    } finally {
      setTogglingId(null);
    }
  };

  const getCategoryName = (catId: string) => {
    return categories.find((c) => c.id === catId)?.name || catId;
  };

  return (
    <div className="bg-white rounded-2xl border border-[#EADBCA] shadow-sm overflow-hidden">
      
      {/* Top Header & Actions */}
      <div className="p-6 border-b border-[#EADBCA] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FAF6EE]/50">
        <div>
          <h2 className="font-serif text-xl font-bold text-[#282522]">
            Product Catalogue ({filteredProducts.length} items)
          </h2>
          <p className="text-xs text-[#74685E] mt-0.5">
            Manage your clothing inventory, publishing status, and prices.
          </p>
        </div>

        <button
          onClick={onAddNew}
          className="px-4 py-2.5 bg-[#702C38] hover:bg-[#561E28] text-white text-xs font-semibold uppercase tracking-wider rounded-md transition-all shadow-md flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 border-b border-[#EADBCA] bg-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, SKU, fabric..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#FAF6EE]/40 border border-[#EADBCA] rounded-md py-2 pl-9 pr-3 text-xs text-[#282522] placeholder-gray-400 focus:outline-none focus:border-[#702C38]"
          />
          <Search className="w-4 h-4 text-[#74685E] absolute left-3 top-2.5" />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-2.5 text-[#74685E] hover:text-[#282522]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="w-full bg-[#FAF6EE]/40 border border-[#EADBCA] rounded-md py-2 px-3 text-xs text-[#282522] focus:outline-none focus:border-[#702C38]"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Published Filter */}
        <div>
          <select
            value={selectedPublished}
            onChange={(e) => setSelectedPublished(e.target.value as any)}
            className="w-full bg-[#FAF6EE]/40 border border-[#EADBCA] rounded-md py-2 px-3 text-xs text-[#282522] focus:outline-none focus:border-[#702C38]"
          >
            <option value="all">All Status (Published & Draft)</option>
            <option value="published">Published Online</option>
            <option value="draft">Drafts Only</option>
          </select>
        </div>

        {/* Stock Filter */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-[#FAF6EE]/40 border border-[#EADBCA] rounded-md py-2 px-3 text-xs text-[#282522] focus:outline-none focus:border-[#702C38]"
          >
            <option value="all">All Stock Statuses</option>
            <option value="in_stock">In Stock</option>
            <option value="made_to_order">Made to Order</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Table & Cards */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#74685E]">
          Loading products from database...
        </div>
      ) : filteredProducts.length > 0 ? (
        <>
          {/* Mobile Card List (Visible on screens < md) */}
          <div className="block md:hidden divide-y divide-[#EADBCA]/60">
            {filteredProducts.map((product) => (
              <div key={product.id} className="p-4 space-y-3 bg-white">
                <div className="flex gap-3">
                  <img
                    src={product.images[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=150&q=80'}
                    alt={product.name}
                    className="w-16 h-20 object-cover rounded-lg border border-[#EADBCA] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-mono text-[10px] font-bold text-[#702C38]">
                        {product.sku}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#FAF6EE] border border-[#EADBCA] text-[9px] font-semibold text-[#702C38]">
                        {getCategoryName(product.category_id)}
                      </span>
                    </div>
                    <h4 className="font-serif text-sm font-semibold text-[#282522] line-clamp-2 leading-tight">
                      {product.name}
                    </h4>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-serif font-bold text-[#702C38] text-sm">
                        ₹{(product.sale_price || product.regular_price).toLocaleString('en-IN')}
                      </span>
                      {product.sale_price && (
                        <span className="text-[10px] text-gray-400 line-through">
                          ₹{product.regular_price.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <div className="mt-1">
                      {product.availability_status === 'out_of_stock' ? (
                        <span className="text-[10px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          Out of Stock
                        </span>
                      ) : product.availability_status === 'made_to_order' ? (
                        <span className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                          Made to Order
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          In Stock
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mobile Actions: Publish/Draft Toggle + Preview/Edit/Delete */}
                <div className="flex items-center justify-between pt-2.5 border-t border-[#EADBCA]/40">
                  <button
                    onClick={() => handlePublishToggle(product.id, product.is_published)}
                    disabled={togglingId === product.id}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                      product.is_published
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                  >
                    {product.is_published ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-700" />
                        <span>Published</span>
                      </>
                    ) : (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                        <span>Draft</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onPreview(product)}
                      className="p-1.5 rounded text-gray-600 hover:text-[#702C38] hover:bg-[#FAF6EE]"
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(product)}
                      className="p-1.5 rounded text-gray-600 hover:text-[#702C38] hover:bg-[#FAF6EE]"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteRequest(product)}
                      className="p-1.5 rounded text-gray-600 hover:text-rose-700 hover:bg-rose-50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table (Hidden on screens < md) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF6EE] text-[#74685E] uppercase tracking-wider font-semibold border-b border-[#EADBCA]">
                <th className="py-3 px-4">Product Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price (INR)</th>
                <th className="py-3 px-4">Availability</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EADBCA]/60">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-[#FAF6EE]/30 transition-colors">
                  {/* Image & Name & SKU */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=150&q=80'}
                        alt={product.name}
                        className="w-12 h-14 object-cover rounded-md border border-[#EADBCA] shrink-0"
                      />
                      <div>
                        <span className="font-mono text-[10px] font-semibold text-[#702C38] block">
                          {product.sku}
                        </span>
                        <h4 className="font-serif text-sm font-semibold text-[#282522] line-clamp-1 max-w-xs">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-[#74685E] mt-0.5">
                          {product.fabric && <span>{product.fabric.split(' ')[0]} {product.fabric.split(' ')[1] || ''}</span>}
                          {product.is_festive && (
                            <span className="text-[#D4B16A] font-semibold flex items-center gap-0.5">
                              <Sparkles className="w-2.5 h-2.5" />
                              Festive
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full bg-[#FAF6EE] border border-[#EADBCA] text-[10px] font-medium text-[#702C38] whitespace-nowrap">
                      {getCategoryName(product.category_id)}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div>
                      {product.sale_price ? (
                        <>
                          <span className="font-serif font-bold text-[#702C38] text-sm">
                            ₹{product.sale_price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[11px] text-gray-400 line-through ml-1.5">
                            ₹{product.regular_price.toLocaleString('en-IN')}
                          </span>
                        </>
                      ) : (
                        <span className="font-serif font-bold text-[#282522] text-sm">
                          ₹{product.regular_price.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Availability */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {product.availability_status === 'out_of_stock' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        Out of Stock
                      </span>
                    ) : product.availability_status === 'made_to_order' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        Made to Order
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        In Stock
                      </span>
                    )}
                  </td>

                  {/* Publish / Draft Toggle */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => handlePublishToggle(product.id, product.is_published)}
                      disabled={togglingId === product.id}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-all shadow-2xs ${
                        product.is_published
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                          : 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300'
                      }`}
                      title={product.is_published ? 'Click to unpublish from customer website' : 'Click to publish to customer website'}
                    >
                      {product.is_published ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-700" />
                          <span>Published</span>
                        </>
                      ) : (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                          <span>Draft</span>
                        </>
                      )}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onPreview(product)}
                        className="p-1.5 rounded text-gray-500 hover:text-[#702C38] hover:bg-[#FAF6EE] transition-colors"
                        title="Live Customer Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(product)}
                        className="p-1.5 rounded text-gray-500 hover:text-[#702C38] hover:bg-[#FAF6EE] transition-colors"
                        title="Edit Product Details"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteRequest(product)}
                        className="p-1.5 rounded text-gray-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
      ) : (
        <div className="p-16 text-center">
          <div className="w-12 h-12 rounded-full bg-[#FAF6EE] flex items-center justify-center mx-auto text-[#702C38] mb-3">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-base font-bold text-[#282522]">No products found</h3>
          <p className="text-xs text-[#74685E] mt-1 max-w-sm mx-auto">
            Try adjusting your search query, category filter, or add a new traditional clothing item.
          </p>
          <button
            onClick={onAddNew}
            className="mt-4 px-4 py-2 bg-[#702C38] text-white text-xs font-semibold rounded-md hover:bg-[#561E28] transition-colors"
          >
            Add New Product
          </button>
        </div>
      )}

    </div>
  );
};
