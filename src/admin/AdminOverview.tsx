import React from 'react';
import { 
  ShoppingBag, 
  Eye, 
  FileEdit, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';

interface OverviewStats {
  totalProducts: number;
  publishedProducts: number;
  draftProducts: number;
  inStockProducts: number;
  outOfStockProducts: number;
  madeToOrderProducts: number;
  totalCategories: number;
}

interface AdminOverviewProps {
  stats: OverviewStats | null;
  loading: boolean;
  onNavigateTab: (tab: 'products' | 'categories' | 'add-product') => void;
  onViewPublicSite: () => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  stats,
  loading,
  onNavigateTab,
  onViewPublicSite,
}) => {
  if (loading || !stats) {
    return (
      <div className="p-8 text-center text-sm text-[#74685E]">
        Loading dashboard metrics...
      </div>
    );
  }

  const metricCards = [
    {
      title: 'Total Catalog',
      value: stats.totalProducts,
      sub: `${stats.totalCategories} active categories`,
      icon: ShoppingBag,
      color: 'text-[#702C38]',
      bg: 'bg-[#FAF6EE]',
      action: () => onNavigateTab('products'),
    },
    {
      title: 'Published Online',
      value: stats.publishedProducts,
      sub: 'Visible on customer website',
      icon: Eye,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
      action: () => onNavigateTab('products'),
    },
    {
      title: 'Draft Products',
      value: stats.draftProducts,
      sub: 'Hidden from public store',
      icon: FileEdit,
      color: 'text-amber-800',
      bg: 'bg-amber-50',
      action: () => onNavigateTab('products'),
    },
    {
      title: 'In Stock Outfits',
      value: stats.inStockProducts,
      sub: 'Ready for WhatsApp orders',
      icon: CheckCircle2,
      color: 'text-blue-700',
      bg: 'bg-blue-50',
      action: () => onNavigateTab('products'),
    },
    {
      title: 'Made to Order',
      value: stats.madeToOrderProducts,
      sub: 'Crafted upon customer order',
      icon: Layers,
      color: 'text-purple-700',
      bg: 'bg-purple-50',
      action: () => onNavigateTab('products'),
    },
    {
      title: 'Out of Stock',
      value: stats.outOfStockProducts,
      sub: stats.outOfStockProducts === 0 ? 'All outfits available' : 'Needs inventory restock',
      icon: AlertTriangle,
      color: stats.outOfStockProducts > 0 ? 'text-rose-700' : 'text-gray-500',
      bg: stats.outOfStockProducts > 0 ? 'bg-rose-50' : 'bg-gray-50',
      action: () => onNavigateTab('products'),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#702C38] to-[#561E28] text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#D4B16A]">
            BVS Fashions • Admin Dashboard
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight mt-1 text-white">
            Traditional Clothing Catalogue Management
          </h2>
          <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-xl">
            Add ethnic wear, manage Banarasi and Kanjeevaram weaves, toggle draft/published status, and receive orders via WhatsApp.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigateTab('add-product')}
            className="px-4 py-2.5 bg-[#D4B16A] hover:bg-[#E9D29E] text-[#282522] text-xs font-bold uppercase tracking-wider rounded-md transition-all shadow flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>

          <button
            onClick={onViewPublicSite}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold uppercase tracking-wider rounded-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Public Store</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {metricCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={card.action}
              className="bg-white p-5 rounded-xl border border-[#EADBCA] shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#74685E]">
                  {card.title}
                </p>
                <p className="font-serif text-3xl font-bold text-[#282522] mt-1">
                  {card.value}
                </p>
                <p className="text-[11px] text-[#74685E] mt-0.5">
                  {card.sub}
                </p>
              </div>

              <div className={`w-12 h-12 rounded-xl ${card.bg} ${card.color} flex items-center justify-center group-hover:scale-105 transition-transform shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Admin Workflow Guide Card */}
      <div className="bg-[#FAF6EE] p-6 rounded-2xl border border-[#EADBCA] shadow-2xs">
        <h3 className="font-serif text-lg font-bold text-[#702C38] mb-3 flex items-center gap-2">
          <span>Admin Publishing & WhatsApp Workflow</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#74685E]">
          <div className="p-3.5 bg-white rounded-lg border border-[#EADBCA]">
            <span className="font-bold text-[#282522] block mb-1">1. Add or Edit Product</span>
            Enter product name, SKU, price, fabric, sizes, and multiple high-res photos. Set initial status as <em>Draft</em> or <em>Published</em>.
          </div>
          <div className="p-3.5 bg-white rounded-lg border border-[#EADBCA]">
            <span className="font-bold text-[#282522] block mb-1">2. Preview & Publish</span>
            Use the <strong>Live Customer Preview</strong> to inspect how the card appears on the public website, then toggle publish status.
          </div>
          <div className="p-3.5 bg-white rounded-lg border border-[#EADBCA]">
            <span className="font-bold text-[#282522] block mb-1">3. Receive WhatsApp Orders</span>
            Customers click "Order on WhatsApp", generating a prefilled message with SKU, chosen size, color, and price directly to your WhatsApp.
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#EADBCA] flex justify-between items-center text-xs">
          <button
            onClick={() => onNavigateTab('products')}
            className="text-[#702C38] hover:text-[#561E28] font-semibold flex items-center gap-1"
          >
            <span>Manage All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onNavigateTab('categories')}
            className="text-[#702C38] hover:text-[#561E28] font-semibold flex items-center gap-1"
          >
            <span>Manage Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
