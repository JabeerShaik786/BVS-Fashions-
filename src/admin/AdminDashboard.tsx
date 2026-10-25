import React, { useState, useEffect, useCallback } from 'react';
import { adminApi, getAdminUser } from './adminApi';
import type { DbProduct, DbCategory } from '../../server/db';
import { AdminOverview } from './AdminOverview';
import { AdminProductList } from './AdminProductList';
import { AdminProductForm } from './AdminProductForm';
import { AdminCategoryList } from './AdminCategoryList';
import { AdminPreviewModal } from './AdminPreviewModal';
import { AdminDeleteModal } from './AdminDeleteModal';
import { 
  ShoppingBag, 
  Layers, 
  LayoutDashboard, 
  PlusCircle, 
  LogOut, 
  ExternalLink, 
  User, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
  onViewPublicSite: () => void;
}

type AdminTab = 'overview' | 'products' | 'categories' | 'add-product';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onLogout,
  onViewPublicSite,
}) => {
  const adminUser = getAdminUser();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Data states
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals & Editing states
  const [editingProduct, setEditingProduct] = useState<DbProduct | null>(null);
  const [previewProduct, setPreviewProduct] = useState<DbProduct | null>(null);
  const [deleteProductTarget, setDeleteProductTarget] = useState<DbProduct | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Notifications
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showFeedback = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Load initial data
  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [overviewData, productData, categoryData] = await Promise.all([
        adminApi.getOverview().catch(() => null),
        adminApi.getProducts().catch(() => []),
        adminApi.getCategories().catch(() => []),
      ]);

      if (overviewData) setStats(overviewData);
      setProducts(productData);
      setCategories(categoryData);
    } catch (err: any) {
      showFeedback(err?.message || 'Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Product Actions
  const handleSaveProduct = async (productData: any) => {
    try {
      if (editingProduct) {
        const updated = await adminApi.updateProduct(editingProduct.id, productData);
        setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        showFeedback(`Product "${updated.name}" updated successfully.`);
      } else {
        const created = await adminApi.createProduct(productData);
        setProducts((prev) => [created, ...prev]);
        showFeedback(`Product "${created.name}" created and added to catalogue.`);
      }
      setActiveTab('products');
      setEditingProduct(null);
      // Refresh stats
      adminApi.getOverview().then(setStats).catch(() => {});
    } catch (err: any) {
      showFeedback(err?.message || 'Failed to save product.', 'error');
      throw err;
    }
  };

  const handleTogglePublish = async (id: string, newStatus: boolean) => {
    try {
      const updated = await adminApi.setPublishStatus(id, newStatus);
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      showFeedback(
        `Product ${newStatus ? 'published to customer website' : 'unpublished and set to draft'}.`
      );
      // Refresh stats
      adminApi.getOverview().then(setStats).catch(() => {});
    } catch (err: any) {
      showFeedback(err?.message || 'Failed to update publishing status', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteProductTarget) return;
    setIsDeleting(true);
    try {
      await adminApi.deleteProduct(deleteProductTarget.id);
      setProducts((prev) => prev.filter((p) => p.id !== deleteProductTarget.id));
      showFeedback(`Product "${deleteProductTarget.name}" deleted permanently.`);
      setDeleteProductTarget(null);
      // Refresh stats
      adminApi.getOverview().then(setStats).catch(() => {});
    } catch (err: any) {
      showFeedback(err?.message || 'Failed to delete product', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Category Actions
  const handleSaveCategory = async (catData: any, isEdit: boolean) => {
    try {
      if (isEdit) {
        const updated = await adminApi.updateCategory(catData.id, catData);
        setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        showFeedback(`Category "${updated.name}" updated.`);
      } else {
        const created = await adminApi.createCategory(catData);
        setCategories((prev) => [...prev, created]);
        showFeedback(`Category "${created.name}" created.`);
      }
    } catch (err: any) {
      showFeedback(err?.message || 'Failed to save category.', 'error');
      throw err;
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await adminApi.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      showFeedback(`Category deleted.`);
    } catch (err: any) {
      showFeedback(err?.message || 'Failed to delete category.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] flex flex-col text-[#282522]">
      
      {/* 1. Admin Top Navigation Header */}
      <header className="bg-white border-b border-[#EADBCA] sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          
          {/* Brand Wordmark & Tag */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#702C38] border border-[#D4B16A] flex items-center justify-center text-[#F7F0E5] font-serif font-bold text-sm shadow-xs">
              BVS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-bold tracking-[0.16em] text-[#702C38] leading-none">
                  BVS FASHIONS
                </span>
                <span className="px-2 py-0.5 rounded bg-[#FAF6EE] text-[9px] uppercase font-bold tracking-wider text-[#702C38] border border-[#EADBCA]">
                  Admin Dashboard
                </span>
              </div>
              <span className="text-[10px] text-[#74685E] block mt-0.5">
                WhatsApp Commerce & Product Catalog Management
              </span>
            </div>
          </div>

          {/* Right actions: User pill, View Site, Logout */}
          <div className="flex items-center gap-3">
            <button
              onClick={onViewPublicSite}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#FAF6EE] hover:bg-[#EADBCA]/50 border border-[#EADBCA] text-xs font-semibold text-[#702C38] transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </button>

            <div className="hidden md:flex items-center gap-2 pl-3 border-l border-[#EADBCA] text-xs text-[#74685E]">
              <div className="w-7 h-7 rounded-full bg-[#FAF6EE] border border-[#EADBCA] flex items-center justify-center text-[#702C38]">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium text-[11px] truncate max-w-[150px]">
                {adminUser?.email || 'admin@bvsfashions.com'}
              </span>
            </div>

            <button
              onClick={onLogout}
              className="p-2 sm:px-3 sm:py-1.5 rounded-md text-gray-500 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              title="Sign out of admin portal"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </div>

        {/* Tab Navigation Strip */}
        <div className="bg-[#FAF6EE] border-t border-[#EADBCA]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 sm:space-x-4 overflow-x-auto py-1">
            <button
              onClick={() => {
                setActiveTab('overview');
                setEditingProduct(null);
              }}
              className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#702C38] text-white shadow-xs'
                  : 'text-[#74685E] hover:text-[#282522] hover:bg-white/60'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('products');
                setEditingProduct(null);
              }}
              className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-[#702C38] text-white shadow-xs'
                  : 'text-[#74685E] hover:text-[#282522] hover:bg-white/60'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Products ({products.length})</span>
            </button>

            <button
              onClick={() => {
                setEditingProduct(null);
                setActiveTab('add-product');
              }}
              className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'add-product' && !editingProduct
                  ? 'bg-[#702C38] text-white shadow-xs'
                  : 'text-[#74685E] hover:text-[#282522] hover:bg-white/60'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('categories');
                setEditingProduct(null);
              }}
              className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-[#702C38] text-white shadow-xs'
                  : 'text-[#74685E] hover:text-[#282522] hover:bg-white/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Categories ({categories.length})</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Floating Feedback Notification */}
      {feedback && (
        <div className="fixed top-20 right-6 z-50 animate-fade-in max-w-sm">
          <div className={`p-4 rounded-xl shadow-xl border flex items-center gap-3 text-xs font-medium ${
            feedback.type === 'success'
              ? 'bg-[#282522] text-[#F7F0E5] border-[#D4B16A]/50'
              : 'bg-rose-900 text-white border-rose-700'
          }`}>
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-[#D4B16A] shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        </div>
      )}

      {/* 3. Main Dashboard Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {activeTab === 'overview' && (
          <AdminOverview
            stats={stats}
            loading={loading}
            onNavigateTab={(tab) => {
              if (tab === 'add-product') setEditingProduct(null);
              setActiveTab(tab);
            }}
            onViewPublicSite={onViewPublicSite}
          />
        )}

        {activeTab === 'products' && (
          <AdminProductList
            products={products}
            categories={categories}
            loading={loading}
            onAddNew={() => {
              setEditingProduct(null);
              setActiveTab('add-product');
            }}
            onEdit={(prod) => {
              setEditingProduct(prod);
              setActiveTab('add-product');
            }}
            onPreview={(prod) => setPreviewProduct(prod)}
            onDeleteRequest={(prod) => setDeleteProductTarget(prod)}
            onTogglePublish={handleTogglePublish}
          />
        )}

        {activeTab === 'add-product' && (
          <AdminProductForm
            initialProduct={editingProduct}
            categories={categories}
            onSave={handleSaveProduct}
            onCancel={() => {
              setEditingProduct(null);
              setActiveTab('products');
            }}
          />
        )}

        {activeTab === 'categories' && (
          <AdminCategoryList
            categories={categories}
            loading={loading}
            onSaveCategory={handleSaveCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        )}
      </main>

      {/* 4. Modals */}
      {previewProduct && (
        <AdminPreviewModal
          product={previewProduct}
          categories={categories}
          onClose={() => setPreviewProduct(null)}
          onPublishToggle={(id, current) => {
            handleTogglePublish(id, !current);
            setPreviewProduct(null);
          }}
        />
      )}

      {deleteProductTarget && (
        <AdminDeleteModal
          product={deleteProductTarget}
          loading={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteProductTarget(null)}
        />
      )}

    </div>
  );
};
