import React, { useState } from 'react';
import type { DbProduct, DbCategory, DbProductColor } from '../../server/db';
import { adminApi } from './adminApi';
import { 
  ArrowLeft, 
  UploadCloud, 
  Trash2, 
  Plus, 
  Sparkles, 
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';

interface AdminProductFormProps {
  initialProduct?: DbProduct | null;
  categories: DbCategory[];
  onSave: (product: any) => Promise<void>;
  onCancel: () => void;
}

const COMMON_SIZES = [
  'Free Size (6.3m with Blouse)',
  'Semi-Stitched (Fits up to 44 waist)',
  'XS', 'S', 'M', 'L', 'XL', 'XXL',
  '38 (S)', '40 (M)', '42 (L)', '44 (XL)', '46 (XXL)',
  '1-2 Yrs', '2-3 Yrs', '4-5 Yrs', '6-7 Yrs', '8-9 Yrs', '10-12 Yrs'
];

export const AdminProductForm: React.FC<AdminProductFormProps> = ({
  initialProduct,
  categories,
  onSave,
  onCancel,
}) => {
  const isEditing = Boolean(initialProduct);

  // Form State
  const [sku, setSku] = useState(initialProduct?.sku || '');
  const [name, setName] = useState(initialProduct?.name || '');
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [categoryId, setCategoryId] = useState(initialProduct?.category_id || categories[0]?.id || 'sarees');
  const [regularPrice, setRegularPrice] = useState<string>(initialProduct?.regular_price ? String(initialProduct.regular_price) : '');
  const [salePrice, setSalePrice] = useState<string>(initialProduct?.sale_price ? String(initialProduct.sale_price) : '');
  const [fabric, setFabric] = useState(initialProduct?.fabric || '');
  const [occasion, setOccasion] = useState(initialProduct?.occasion || '');
  const [availabilityStatus, setAvailabilityStatus] = useState<string>(initialProduct?.availability_status || 'in_stock');
  const [isPublished, setIsPublished] = useState(initialProduct?.is_published ?? true);
  const [isNewArrival, setIsNewArrival] = useState(initialProduct?.is_new_arrival ?? true);
  const [isBestseller, setIsBestseller] = useState(initialProduct?.is_bestseller ?? false);
  const [isFestive, setIsFestive] = useState(initialProduct?.is_festive ?? true);

  // Images state
  const [images, setImages] = useState<string[]>(initialProduct?.images || [
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
  ]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Sizes state
  const [sizes, setSizes] = useState<string[]>(initialProduct?.sizes || ['Free Size (6.3m with Blouse)']);
  const [customSizeInput, setCustomSizeInput] = useState('');

  // Colors state
  const [colors, setColors] = useState<DbProductColor[]>(initialProduct?.colors || [
    { name: 'Deep Maroon', hex: '#702C38' },
    { name: 'Antique Gold', hex: '#D4B16A' },
  ]);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#702C38');

  // Submit state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add Image URL
  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      setImages([...images, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  };

  // Remove Image
  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, idx) => idx !== index));
  };

  // Upload image file
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError(null);

    try {
      const publicUrl = await adminApi.uploadImage(file);
      setImages((prev) => [...prev, publicUrl]);
    } catch (err: any) {
      setError(err?.message || 'Failed to upload image.');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  // Toggle standard size
  const toggleSize = (sizeStr: string) => {
    if (sizes.includes(sizeStr)) {
      setSizes(sizes.filter((s) => s !== sizeStr));
    } else {
      setSizes([...sizes, sizeStr]);
    }
  };

  // Add custom size
  const handleAddCustomSize = () => {
    if (customSizeInput.trim() && !sizes.includes(customSizeInput.trim())) {
      setSizes([...sizes, customSizeInput.trim()]);
      setCustomSizeInput('');
    }
  };

  // Add color
  const handleAddColor = () => {
    if (newColorName.trim()) {
      setColors([...colors, { name: newColorName.trim(), hex: newColorHex }]);
      setNewColorName('');
    }
  };

  // Remove color
  const handleRemoveColor = (idx: number) => {
    setColors(colors.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Frontend validation
    if (!sku.trim()) {
      setError('Please provide a product SKU (e.g. BVS-SAR-001).');
      return;
    }
    if (!name.trim()) {
      setError('Please provide a product name.');
      return;
    }
    const numRegularPrice = Number(regularPrice);
    if (isNaN(numRegularPrice) || numRegularPrice <= 0) {
      setError('Please provide a valid regular price greater than zero.');
      return;
    }
    const numSalePrice = salePrice ? Number(salePrice) : null;
    if (numSalePrice !== null && (isNaN(numSalePrice) || numSalePrice <= 0)) {
      setError('Sale price must be a valid number.');
      return;
    }
    if (numSalePrice && numSalePrice > numRegularPrice) {
      setError('Sale price cannot exceed the regular price.');
      return;
    }
    if (images.length === 0) {
      setError('At least one product image is required.');
      return;
    }
    if (sizes.length === 0) {
      setError('Please select at least one available size or fit.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        sku: sku.trim().toUpperCase(),
        name: name.trim(),
        description: description.trim(),
        category_id: categoryId,
        regular_price: numRegularPrice,
        sale_price: numSalePrice,
        images,
        sizes,
        colors,
        fabric: fabric.trim() || undefined,
        occasion: occasion.trim() || undefined,
        availability_status: availabilityStatus,
        is_published: isPublished,
        is_new_arrival: isNewArrival,
        is_bestseller: isBestseller,
        is_festive: isFestive,
      };

      await onSave(payload);
    } catch (err: any) {
      setError(err?.message || 'Failed to save product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#EADBCA] shadow-sm overflow-hidden">
      
      {/* Top Banner */}
      <div className="p-4 sm:p-6 border-b border-[#EADBCA] bg-[#FAF6EE] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-1.5 rounded-full text-gray-500 hover:text-[#702C38] hover:bg-white transition-colors"
            title="Cancel"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-serif text-xl font-bold text-[#282522]">
              {isEditing ? `Edit Product: ${initialProduct?.sku}` : 'Add New Ethnic Wear Product'}
            </h2>
            <p className="text-xs text-[#74685E] mt-0.5">
              Fill in all product details, images, sizes, and publishing settings.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#74685E] hover:text-[#282522] rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2.5 bg-[#702C38] hover:bg-[#561E28] disabled:opacity-60 text-white text-xs font-semibold uppercase tracking-wider rounded-md transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-[#D4B16A]" />
            <span>{loading ? 'Saving...' : isEditing ? 'Update Product' : 'Save Product'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="m-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form Fields */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
        
        {/* Row 1: SKU & Name */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#282522] mb-1.5">
              Product SKU / Code *
            </label>
            <input
              type="text"
              required
              value={sku}
              onChange={(e) => setSku(e.target.value.toUpperCase())}
              placeholder="e.g. BVS-SAR-015"
              className="w-full bg-[#FAF6EE]/50 border border-[#EADBCA] rounded-md px-3.5 py-2.5 text-xs font-mono font-bold text-[#702C38] focus:outline-none focus:border-[#702C38]"
            />
            <p className="text-[10px] text-gray-500 mt-1">Unique item identifier used in WhatsApp orders</p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#282522] mb-1.5">
              Product Title / Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Peacock Blue Banarasi Silk Saree with Meenakari Pallu"
              className="w-full bg-[#FAF6EE]/50 border border-[#EADBCA] rounded-md px-3.5 py-2.5 text-xs text-[#282522] focus:outline-none focus:border-[#702C38]"
            />
          </div>
        </div>

        {/* Row 2: Category, Prices, Availability */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#282522] mb-1.5">
              Category *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-[#FAF6EE]/50 border border-[#EADBCA] rounded-md px-3.5 py-2.5 text-xs text-[#282522] focus:outline-none focus:border-[#702C38]"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#282522] mb-1.5">
              Regular Price (₹ INR) *
            </label>
            <input
              type="number"
              required
              min="1"
              value={regularPrice}
              onChange={(e) => setRegularPrice(e.target.value)}
              placeholder="e.g. 4999"
              className="w-full bg-[#FAF6EE]/50 border border-[#EADBCA] rounded-md px-3.5 py-2.5 text-xs text-[#282522] focus:outline-none focus:border-[#702C38]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#282522] mb-1.5">
              Offer / Sale Price (Optional)
            </label>
            <input
              type="number"
              min="0"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
              placeholder="e.g. 3499"
              className="w-full bg-[#FAF6EE]/50 border border-[#EADBCA] rounded-md px-3.5 py-2.5 text-xs text-[#282522] focus:outline-none focus:border-[#702C38]"
            />
            {regularPrice && salePrice && Number(salePrice) < Number(regularPrice) && (
              <span className="text-[10px] text-emerald-700 font-semibold block mt-1">
                Discount: {Math.round((1 - Number(salePrice) / Number(regularPrice)) * 100)}% OFF
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#282522] mb-1.5">
              Stock Availability *
            </label>
            <select
              value={availabilityStatus}
              onChange={(e) => setAvailabilityStatus(e.target.value)}
              className="w-full bg-[#FAF6EE]/50 border border-[#EADBCA] rounded-md px-3.5 py-2.5 text-xs text-[#282522] focus:outline-none focus:border-[#702C38]"
            >
              <option value="in_stock">In Stock (Immediate Dispatch)</option>
              <option value="made_to_order">Made to Order (Handcrafted)</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Row 3: Fabric & Occasion */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#282522] mb-1.5">
              Fabric & Weave Details
            </label>
            <input
              type="text"
              value={fabric}
              onChange={(e) => setFabric(e.target.value)}
              placeholder="e.g. Pure Kanjeevaram Art Silk with Gold Weft"
              className="w-full bg-[#FAF6EE]/50 border border-[#EADBCA] rounded-md px-3.5 py-2.5 text-xs text-[#282522] focus:outline-none focus:border-[#702C38]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#282522] mb-1.5">
              Occasion Recommendation
            </label>
            <input
              type="text"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              placeholder="e.g. Weddings, Sangeet & Festive Pujas"
              className="w-full bg-[#FAF6EE]/50 border border-[#EADBCA] rounded-md px-3.5 py-2.5 text-xs text-[#282522] focus:outline-none focus:border-[#702C38]"
            />
          </div>
        </div>

        {/* Row 4: Description */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#282522] mb-1.5">
            Full Product Description *
          </label>
          <textarea
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed description of weave, drape, border, blouse material, and traditional craftsmanship..."
            className="w-full bg-[#FAF6EE]/50 border border-[#EADBCA] rounded-md px-3.5 py-2.5 text-xs text-[#282522] focus:outline-none focus:border-[#702C38]"
          />
        </div>

        {/* Row 5: Product Images (Multi-image management & Upload) */}
        <div className="p-5 rounded-xl border border-[#EADBCA] bg-[#FAF6EE]/30 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-serif text-sm font-bold text-[#702C38] flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-[#D4B16A]" />
              <span>Product Photography ({images.length} images)</span>
            </h4>
            <span className="text-[10px] text-gray-500">First image is used as primary card cover</span>
          </div>

          {/* Current Images Preview Grid */}
          <div className="flex flex-wrap gap-4">
            {images.map((imgUrl, idx) => (
              <div key={idx} className="relative w-24 h-28 rounded-lg overflow-hidden border-2 border-[#EADBCA] shadow-sm bg-white group">
                <img src={imgUrl} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                {idx === 0 && (
                  <span className="absolute bottom-0 inset-x-0 bg-[#702C38] text-white text-[8px] font-bold uppercase text-center py-0.5">
                    Cover
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}

            {/* Upload Box */}
            <label className="w-24 h-28 rounded-lg border-2 border-dashed border-[#D4B16A] hover:bg-white flex flex-col items-center justify-center cursor-pointer transition-colors text-center p-2">
              <UploadCloud className="w-5 h-5 text-[#702C38] mb-1" />
              <span className="text-[10px] font-semibold text-[#702C38]">
                {uploadingImage ? 'Uploading...' : 'Upload File'}
              </span>
              <span className="text-[8px] text-gray-400">JPG, PNG, WEBP</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                disabled={uploadingImage}
                onChange={handleFileUpload}
              />
            </label>
          </div>

          {/* Add image by URL */}
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="Or paste image URL (https://...)"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              className="flex-1 bg-white border border-[#EADBCA] rounded-md px-3 py-2 text-xs text-[#282522] focus:outline-none focus:border-[#702C38]"
            />
            <button
              type="button"
              onClick={handleAddImageUrl}
              className="px-4 py-2 bg-[#FAF6EE] border border-[#EADBCA] text-[#702C38] hover:bg-[#702C38] hover:text-white text-xs font-semibold rounded-md transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add URL</span>
            </button>
          </div>
        </div>

        {/* Row 6: Sizes & Color Swatches */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Sizes */}
          <div className="p-5 rounded-xl border border-[#EADBCA] bg-[#FAF6EE]/30 space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#282522]">
              Available Sizes / Saree Drape Lengths
            </label>
            
            <div className="flex flex-wrap gap-1.5">
              {COMMON_SIZES.map((sz) => {
                const isSelected = sizes.includes(sz);
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => toggleSize(sz)}
                    className={`px-2.5 py-1 text-[11px] rounded border transition-colors ${
                      isSelected
                        ? 'bg-[#702C38] text-white border-[#702C38]'
                        : 'bg-white text-gray-700 border-[#EADBCA] hover:border-[#702C38]'
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Custom size (e.g. 36 (XS) or 6.5m)"
                value={customSizeInput}
                onChange={(e) => setCustomSizeInput(e.target.value)}
                className="flex-1 bg-white border border-[#EADBCA] rounded-md px-3 py-1.5 text-xs text-[#282522]"
              />
              <button
                type="button"
                onClick={handleAddCustomSize}
                className="px-3 py-1.5 bg-white border border-[#EADBCA] text-[#702C38] text-xs font-semibold rounded-md hover:bg-[#702C38] hover:text-white transition-colors"
              >
                Add Size
              </button>
            </div>
          </div>

          {/* Color Swatches */}
          <div className="p-5 rounded-xl border border-[#EADBCA] bg-[#FAF6EE]/30 space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#282522]">
              Available Shades / Color Variants
            </label>

            <div className="flex flex-wrap gap-2">
              {colors.map((c, idx) => (
                <div key={idx} className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full border border-[#EADBCA]">
                  <span className="w-3.5 h-3.5 rounded-full border border-gray-300" style={{ backgroundColor: c.hex }} />
                  <span className="text-[11px] font-medium text-[#282522]">{c.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(idx)}
                    className="text-gray-400 hover:text-rose-600 ml-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="color"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                className="w-8 h-8 rounded border border-gray-300 cursor-pointer p-0.5 bg-white shrink-0"
              />
              <input
                type="text"
                placeholder="Shade Name (e.g. Royal Indigo)"
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                className="flex-1 bg-white border border-[#EADBCA] rounded-md px-3 py-1.5 text-xs text-[#282522]"
              />
              <button
                type="button"
                onClick={handleAddColor}
                className="px-3 py-1.5 bg-white border border-[#EADBCA] text-[#702C38] text-xs font-semibold rounded-md hover:bg-[#702C38] hover:text-white transition-colors"
              >
                Add Color
              </button>
            </div>
          </div>
        </div>

        {/* Row 7: Flags & Publishing Settings */}
        <div className="p-5 rounded-xl border border-[#EADBCA] bg-[#FAF6EE] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-4 h-4 text-[#702C38] rounded accent-[#702C38]"
            />
            <span className="text-xs font-bold text-[#282522]">
              Publish to Customer Store
            </span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isNewArrival}
              onChange={(e) => setIsNewArrival(e.target.checked)}
              className="w-4 h-4 text-[#702C38] rounded accent-[#702C38]"
            />
            <span className="text-xs font-medium text-[#282522]">
              Mark as New Arrival
            </span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isBestseller}
              onChange={(e) => setIsBestseller(e.target.checked)}
              className="w-4 h-4 text-[#702C38] rounded accent-[#702C38]"
            />
            <span className="text-xs font-medium text-[#282522]">
              Mark as Bestseller
            </span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isFestive}
              onChange={(e) => setIsFestive(e.target.checked)}
              className="w-4 h-4 text-[#702C38] rounded accent-[#702C38]"
            />
            <span className="text-xs font-medium text-[#282522] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#D4B16A]" />
              Festive Favourite
            </span>
          </label>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-[#EADBCA] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 border border-[#EADBCA] bg-white text-[#74685E] hover:text-[#282522] text-xs font-semibold uppercase tracking-wider rounded-md transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-[#702C38] hover:bg-[#561E28] disabled:opacity-60 text-white text-xs font-semibold uppercase tracking-wider rounded-md transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-[#D4B16A]" />
            <span>{loading ? 'Saving...' : isEditing ? 'Update & Publish' : 'Create & Save Product'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
