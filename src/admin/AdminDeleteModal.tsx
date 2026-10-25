import type { DbProduct } from '../../server/db';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface AdminDeleteModalProps {
  product: DbProduct | null;
  loading: boolean;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export const AdminDeleteModal: React.FC<AdminDeleteModalProps> = ({
  product,
  loading,
  onConfirm,
  onCancel,
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#EADBCA] text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="font-serif text-lg font-bold text-[#282522] mb-1">
          Delete Product Permanently?
        </h3>

        <p className="text-xs text-[#74685E] leading-relaxed mb-4">
          Are you sure you want to delete <strong>"{product.name}"</strong> (<span className="font-mono">{product.sku}</span>)? This action will remove the outfit from the database and cannot be undone.
        </p>

        <div className="p-3 bg-rose-50 rounded-lg border border-rose-100 text-[11px] text-rose-800 text-left mb-6">
          <p>• SKU: <strong>{product.sku}</strong></p>
          <p>• Category: <strong>{product.category_id}</strong></p>
          <p>• Status: <strong>{product.is_published ? 'Currently Published Online' : 'Draft'}</strong></p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 border border-[#EADBCA] text-xs font-semibold text-[#74685E] hover:text-[#282522] rounded-md transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-wider rounded-md transition-all shadow flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>{loading ? 'Deleting...' : 'Yes, Delete'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
