import React, { useState } from 'react';
import type { DbCategory } from '../../server/db';
import { Plus, Edit2, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AdminCategoryListProps {
  categories: DbCategory[];
  loading: boolean;
  onSaveCategory: (cat: any, isEdit: boolean) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
}

export const AdminCategoryList: React.FC<AdminCategoryListProps> = ({
  categories,
  loading,
  onSaveCategory,
  onDeleteCategory,
}) => {
  const [editingCategory, setEditingCategory] = useState<DbCategory | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form state
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState('0');
  const [imageUrl, setImageUrl] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const startAddNew = () => {
    setEditingCategory(null);
    setId('');
    setName('');
    setDescription('');
    setDisplayOrder(String(categories.length + 1));
    setImageUrl('https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80');
    setFormError(null);
    setIsAddingNew(true);
  };

  const startEdit = (cat: DbCategory) => {
    setEditingCategory(cat);
    setId(cat.id);
    setName(cat.name);
    setDescription(cat.description || '');
    setDisplayOrder(String(cat.display_order || 0));
    setImageUrl(cat.image_url || '');
    setFormError(null);
    setIsAddingNew(true);
  };

  const cancelForm = () => {
    setIsAddingNew(false);
    setEditingCategory(null);
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!id.trim() || !name.trim()) {
      setFormError('Category ID and Name are required.');
      return;
    }

    setSubmitting(true);
    try {
      await onSaveCategory(
        {
          id: id.trim().toLowerCase(),
          name: name.trim(),
          description: description.trim(),
          display_order: Number(displayOrder) || 0,
          image_url: imageUrl.trim(),
        },
        Boolean(editingCategory)
      );
      cancelForm();
    } catch (err: any) {
      setFormError(err?.message || 'Failed to save category.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#EADBCA] shadow-sm overflow-hidden">
      
      {/* Header */}
      <div className="p-6 border-b border-[#EADBCA] bg-[#FAF6EE]/50 flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl font-bold text-[#282522]">
            Category Management ({categories.length})
          </h2>
          <p className="text-xs text-[#74685E] mt-0.5">
            Organize ethnic clothing departments (Sarees, Lehengas, Kurtas, Kids Wear).
          </p>
        </div>

        {!isAddingNew && (
          <button
            onClick={startAddNew}
            className="px-4 py-2.5 bg-[#702C38] hover:bg-[#561E28] text-white text-xs font-semibold uppercase tracking-wider rounded-md transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        )}
      </div>

      {/* Add / Edit Form Modal or Inset */}
      {isAddingNew && (
        <div className="p-6 bg-[#FAF6EE] border-b border-[#EADBCA]">
          <h3 className="font-serif text-base font-bold text-[#702C38] mb-4">
            {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Create New Category'}
          </h3>

          {formError && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#282522] mb-1">
                Category Slug / ID *
              </label>
              <input
                type="text"
                required
                disabled={Boolean(editingCategory)}
                value={id}
                onChange={(e) => setId(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                placeholder="e.g. festive-lehengas"
                className="w-full bg-white border border-[#EADBCA] rounded-md px-3 py-2 text-xs focus:outline-none focus:border-[#702C38] disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#282522] mb-1">
                Category Display Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Festive & Wedding Lehengas"
                className="w-full bg-white border border-[#EADBCA] rounded-md px-3 py-2 text-xs focus:outline-none focus:border-[#702C38]"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#282522] mb-1">
                Display Order
              </label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                className="w-full bg-white border border-[#EADBCA] rounded-md px-3 py-2 text-xs focus:outline-none focus:border-[#702C38]"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#282522] mb-1">
                Card Cover Image URL
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-white border border-[#EADBCA] rounded-md px-3 py-2 text-xs focus:outline-none focus:border-[#702C38]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold uppercase tracking-wider text-[#282522] mb-1">
                Description / Subtitle
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description displayed on category cards"
                className="w-full bg-white border border-[#EADBCA] rounded-md px-3 py-2 text-xs focus:outline-none focus:border-[#702C38]"
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={cancelForm}
                className="px-4 py-2 border border-[#EADBCA] bg-white text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-[#702C38] hover:bg-[#561E28] text-white font-semibold rounded-md transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-[#D4B16A]" />
                <span>{submitting ? 'Saving...' : 'Save Category'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Table */}
      {loading ? (
        <div className="p-8 text-center text-xs text-[#74685E]">
          Loading categories...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF6EE] text-[#74685E] uppercase tracking-wider font-semibold border-b border-[#EADBCA]">
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Category Name</th>
                <th className="py-3 px-4">ID / Slug</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-center">Order</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EADBCA]/60">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-[#FAF6EE]/30">
                  <td className="py-3 px-4">
                    <img
                      src={cat.image_url || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=100&q=80'}
                      alt={cat.name}
                      className="w-10 h-10 object-cover rounded-md border border-[#EADBCA]"
                    />
                  </td>
                  <td className="py-3 px-4 font-serif font-bold text-[#282522]">
                    {cat.name}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#702C38]">
                    {cat.id}
                  </td>
                  <td className="py-3 px-4 text-gray-500 max-w-xs truncate">
                    {cat.description || '—'}
                  </td>
                  <td className="py-3 px-4 text-center font-medium text-gray-600">
                    {cat.display_order}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => startEdit(cat)}
                      className="p-1.5 text-gray-500 hover:text-[#702C38] transition-colors"
                      title="Edit Category"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteCategory(cat.id)}
                      className="p-1.5 text-gray-500 hover:text-rose-700 transition-colors ml-1"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
