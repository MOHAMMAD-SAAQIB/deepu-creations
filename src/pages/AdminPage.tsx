import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Package,
  ShoppingBag,
  Sparkles,
  Settings,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  LogOut,
  Check,
  X,
  AlertCircle,
  Tag,
  Upload,
  Image as ImageIcon,
  FolderPlus,
  Star,
  ImageOff,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { Product, Category } from '../data/products';
import { processProductImageFile } from '../utils/imageStorage';
import { NeutralProductPlaceholder } from '../components/common/NeutralProductPlaceholder';

export const AdminPage: React.FC = () => {
  const {
    isAdminAuthenticated,
    logoutAdmin,
    businessSettings,
    updateBusinessSettings,
    updateContactSettings,
  } = useAdmin();

  const {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStock,
    updateProductPrice,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useProducts();

  const { orders, customRequests } = useAuth();
  const navigate = useNavigate();

  // Route guard: if not authenticated, redirect to /admin/login
  React.useEffect(() => {
    if (!isAdminAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAdminAuthenticated, navigate]);

  const [adminTab, setAdminTab] = useState<'overview' | 'products' | 'categories' | 'orders' | 'requests' | 'settings'>('overview');
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [priceDraft, setPriceDraft] = useState('');
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  // New Product Modal State
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    category: categories[0]?.slug || 'bouquets',
    price: 1299,
    shortDescription: '',
    description: '',
    images: [] as string[],
    inStock: true,
  });
  const [newProductImageError, setNewProductImageError] = useState<string | null>(null);

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editProductImageError, setEditProductImageError] = useState<string | null>(null);

  // Category Modal States
  const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryTagline, setNewCategoryTagline] = useState('');
  const [categoryModalError, setCategoryModalError] = useState<string | null>(null);

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editCategoryTagline, setEditCategoryTagline] = useState('');

  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [reassignCategorySlug, setReassignCategorySlug] = useState<string>('');
  const [deleteCategoryError, setDeleteCategoryError] = useState<string | null>(null);

  // Settings local form state
  const [settingsForm, setSettingsForm] = useState({
    brandName: businessSettings.brandName,
    slogan: businessSettings.slogan,
    whatsappNumber: businessSettings.contact.whatsappNumber,
    isWhatsappConfigured: businessSettings.contact.isWhatsappConfigured,
    instagramUrl: businessSettings.contact.instagramUrl,
    isInstagramConfigured: businessSettings.contact.isInstagramConfigured,
    email: businessSettings.contact.email,
  });

  if (!isAdminAuthenticated) {
    return null; // Redirects via useEffect
  }

  const handleSavePrice = (productId: string) => {
    const parsed = parseInt(priceDraft, 10);
    if (!isNaN(parsed) && parsed > 0) {
      updateProductPrice(productId, parsed);
    }
    setEditingPriceId(null);
  };

  // Image Upload Handlers
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const result = await processProductImageFile(files[i]);
      if (!result.success || !result.dataUrl) {
        if (isEdit) {
          setEditProductImageError(result.error || 'Failed to process image');
        } else {
          setNewProductImageError(result.error || 'Failed to process image');
        }
        continue;
      }

      if (isEdit) {
        setEditingProduct((prev) =>
          prev ? { ...prev, images: [...prev.images, result.dataUrl!] } : null
        );
        setEditProductImageError(null);
      } else {
        setNewProductForm((prev) => ({
          ...prev,
          images: [...prev.images, result.dataUrl!],
        }));
        setNewProductImageError(null);
      }
    }

    // Reset input value so same file can be re-uploaded if desired
    e.target.value = '';
  };

  const handleRemoveImage = (index: number, isEdit: boolean) => {
    if (isEdit) {
      setEditingProduct((prev) =>
        prev ? { ...prev, images: prev.images.filter((_, idx) => idx !== index) } : null
      );
    } else {
      setNewProductForm((prev) => ({
        ...prev,
        images: prev.images.filter((_, idx) => idx !== index),
      }));
    }
  };

  const handleSetPrimaryImage = (index: number, isEdit: boolean) => {
    if (index === 0) return;
    if (isEdit) {
      setEditingProduct((prev) => {
        if (!prev) return null;
        const newImages = [...prev.images];
        const [moved] = newImages.splice(index, 1);
        newImages.unshift(moved);
        return { ...prev, images: newImages };
      });
    } else {
      setNewProductForm((prev) => {
        const newImages = [...prev.images];
        const [moved] = newImages.splice(index, 1);
        newImages.unshift(moved);
        return { ...prev, images: newImages };
      });
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.name.trim()) return;

    const selectedCategory = categories.find((c) => c.slug === newProductForm.category);
    const categoryLabel = selectedCategory ? selectedCategory.name : newProductForm.category;

    addProduct({
      name: newProductForm.name.trim(),
      category: newProductForm.category,
      categoryLabel,
      price: Number(newProductForm.price),
      isPricePlaceholder: false,
      currencySymbol: '₹',
      shortDescription: newProductForm.shortDescription || 'Handcrafted crochet creation.',
      description: newProductForm.description || 'Carefully knitted with high-twist combed cotton yarn.',
      images: newProductForm.images,
      inStock: newProductForm.inStock,
      colors: [
        { name: 'Blush Pink', hex: '#F0C9CB' },
        { name: 'Warm Cream', hex: '#F6F0E7' },
        { name: 'Deep Burgundy', hex: '#6E3947' },
      ],
      materials: ['100% Combed Cotton Yarn', 'Artisanal Studio Knotting'],
      dimensions: 'Handcrafted standard size',
      craftingTime: 'Handmade in 2–4 days',
      careInstructions: ['Gently spot clean with damp cloth.'],
      shippingNotice: 'Packaged in protective box.',
      isDemoAsset: false,
    });

    setIsNewProductOpen(false);
    setNewProductForm({
      name: '',
      category: categories[0]?.slug || 'bouquets',
      price: 1299,
      shortDescription: '',
      description: '',
      images: [],
      inStock: true,
    });
    setNewProductImageError(null);
  };

  const handleUpdateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const selectedCategory = categories.find((c) => c.slug === editingProduct.category);
    const categoryLabel = selectedCategory ? selectedCategory.name : editingProduct.category;

    updateProduct(editingProduct.id, {
      name: editingProduct.name.trim(),
      price: Number(editingProduct.price),
      category: editingProduct.category,
      categoryLabel,
      shortDescription: editingProduct.shortDescription,
      images: editingProduct.images,
      inStock: editingProduct.inStock,
    });
    setEditingProduct(null);
    setEditProductImageError(null);
  };

  // Category Handlers
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    setCategoryModalError(null);
    const res = addCategory(newCategoryName, newCategoryTagline);
    if (!res.success) {
      setCategoryModalError(res.error || 'Failed to create category');
      return;
    }
    setIsNewCategoryOpen(false);
    setNewCategoryName('');
    setNewCategoryTagline('');
  };

  const handleUpdateCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    setCategoryModalError(null);
    const res = updateCategory(editingCategory.id, editCategoryName, editCategoryTagline);
    if (!res.success) {
      setCategoryModalError(res.error || 'Failed to update category');
      return;
    }
    setEditingCategory(null);
  };

  const handleDeleteCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletingCategory) return;
    setDeleteCategoryError(null);
    const res = deleteCategory(deletingCategory.id, reassignCategorySlug);
    if (!res.success) {
      setDeleteCategoryError(res.error || 'Failed to delete category');
      return;
    }
    setDeletingCategory(null);
    setReassignCategorySlug('');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessSettings({
      brandName: settingsForm.brandName,
      slogan: settingsForm.slogan,
      isSloganConfigured: !settingsForm.slogan.includes('['),
    });
    updateContactSettings({
      whatsappNumber: settingsForm.whatsappNumber,
      isWhatsappConfigured: settingsForm.isWhatsappConfigured,
      instagramUrl: settingsForm.instagramUrl,
      isInstagramConfigured: settingsForm.isInstagramConfigured,
      email: settingsForm.email,
    });
    setSettingsSavedToast(true);
    setTimeout(() => setSettingsSavedToast(false), 2500);
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  const totalProducts = products.length;
  const inStockProducts = products.filter((p) => p.inStock).length;
  const totalDraftOrders = orders.length;
  const totalCustomRequests = customRequests.length;

  return (
    <div className="min-h-screen bg-[#F6F0E7] bg-crochet-pattern py-8 sm:py-12 px-4 sm:px-6 lg:px-8 pb-24 md:pb-12">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Admin Header */}
        <div className="bg-[#321923] text-[#FAF6F0] rounded-3xl p-6 border border-[#6E3947] shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#522734] border border-[#F0C9CB]/20 flex items-center justify-center text-[#F0C9CB]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-serif text-xl sm:text-2xl font-semibold tracking-wide">
                Atelier Administration
              </h1>
              <p className="text-xs text-[#D99AA3]">
                {businessSettings.brandName} • Live Catalog, Categories, and Orders Operations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-full border border-[#F0C9CB]/30 text-xs font-medium text-[#F0C9CB] hover:bg-[#522734] flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock Portal</span>
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-[#E6D7CD]">
          {[
            { id: 'overview', label: 'Metrics Overview', icon: Sparkles },
            { id: 'products', label: 'Product Catalog', icon: Package, count: totalProducts },
            { id: 'categories', label: 'Categories', icon: Tag, count: categories.length },
            { id: 'orders', label: 'Registered Orders', icon: ShoppingBag, count: totalDraftOrders },
            { id: 'requests', label: 'Custom Commissions', icon: Sparkles, count: totalCustomRequests },
            { id: 'settings', label: 'Business Settings', icon: Settings },
          ].map((tab) => {
            const isActive = adminTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id as any)}
                className={`py-3 px-4 text-xs font-semibold whitespace-nowrap flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                  isActive
                    ? 'border-[#6E3947] text-[#6E3947]'
                    : 'border-transparent text-[#6B5B54] hover:text-[#321923]'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#FAF6F0] border border-[#E6D7CD]">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: Overview */}
        {adminTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-[#E6D7CD] shadow-xs">
                <span className="text-[11px] text-[#8E987E] uppercase tracking-wider block font-medium">
                  Total Catalog Items
                </span>
                <span className="font-serif text-3xl font-bold text-[#321923] mt-1 block">
                  {totalProducts}
                </span>
                <span className="text-[10px] text-[#78816A] mt-1 block">
                  {inStockProducts} ready to ship
                </span>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-[#E6D7CD] shadow-xs">
                <span className="text-[11px] text-[#8E987E] uppercase tracking-wider block font-medium">
                  Active Categories
                </span>
                <span className="font-serif text-3xl font-bold text-[#321923] mt-1 block">
                  {categories.length}
                </span>
                <span className="text-[10px] text-[#8E987E] mt-1 block">Custom managed</span>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-[#E6D7CD] shadow-xs">
                <span className="text-[11px] text-[#8E987E] uppercase tracking-wider block font-medium">
                  Registered Orders
                </span>
                <span className="font-serif text-3xl font-bold text-[#6E3947] mt-1 block">
                  {totalDraftOrders}
                </span>
                <span className="text-[10px] text-[#8E987E] mt-1 block">Customer submissions</span>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-[#E6D7CD] shadow-xs">
                <span className="text-[11px] text-[#8E987E] uppercase tracking-wider block font-medium">
                  Custom Inquiries
                </span>
                <span className="font-serif text-3xl font-bold text-[#321923] mt-1 block">
                  {totalCustomRequests}
                </span>
                <span className="text-[10px] text-[#8E987E] mt-1 block">Studio commissions</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E6D7CD] space-y-2 text-xs text-[#6B5B54]">
              <h3 className="font-serif text-base font-semibold text-[#321923]">
                Artisanal Business Rule Compliance
              </h3>
              <p>
                All statistics are derived from live persistent customer actions. Products and categories created or edited here persist directly in the application database and update the customer-facing storefront in real time.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: Products CRUD */}
        {adminTab === 'products' && (
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E6D7CD] shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F6F0E7] gap-3">
              <div>
                <h3 className="font-serif text-xl font-semibold text-[#321923]">
                  Product Catalog Management
                </h3>
                <p className="text-xs text-[#8E987E]">
                  Create, edit, upload device photos, toggle stock, or delete products.
                </p>
              </div>

              <button
                onClick={() => {
                  setNewProductForm({
                    name: '',
                    category: categories[0]?.slug || 'bouquets',
                    price: 1299,
                    shortDescription: '',
                    description: '',
                    images: [],
                    inStock: true,
                  });
                  setNewProductImageError(null);
                  setIsNewProductOpen(true);
                }}
                className="px-4 py-2.5 rounded-full bg-[#6E3947] hover:bg-[#522734] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Product</span>
              </button>
            </div>

            {/* Product List */}
            <div className="space-y-3">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-2xl border border-[#E6D7CD] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#FAF6F0]/70 hover:bg-[#FAF6F0] transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-[#E6D7CD] flex-shrink-0 flex items-center justify-center">
                      {p.images && p.images.length > 0 && p.images[0] ? (
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <NeutralProductPlaceholder size="sm" message="No image" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-serif text-base font-semibold text-[#321923]">{p.name}</h4>
                      <p className="text-[11px] text-[#8E987E]">
                        Category: <strong className="text-[#321923]">{p.categoryLabel || p.category}</strong> • {p.images ? p.images.length : 0} photo(s) uploaded
                      </p>

                      <div className="flex items-center gap-2 mt-1.5">
                        {editingPriceId === p.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={priceDraft}
                              onChange={(e) => setPriceDraft(e.target.value)}
                              className="w-24 px-2 py-0.5 text-xs rounded border border-[#6E3947] bg-white font-mono"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSavePrice(p.id)}
                              className="p-1 rounded bg-[#6E3947] text-white text-xs"
                              title="Confirm price"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingPriceId(null)}
                              className="p-1 rounded bg-gray-200 text-[#392923] text-xs"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingPriceId(p.id);
                              setPriceDraft(p.price.toString());
                            }}
                            className="font-serif text-xs font-bold text-[#6E3947] hover:underline flex items-center gap-1 cursor-pointer"
                            title="Click to edit price"
                          >
                            <span>₹{p.price.toLocaleString()}</span>
                            <Edit2 className="w-3 h-3 text-[#D99AA3]" />
                          </button>
                        )}

                        <span className="text-[#8E987E] text-[10px]">•</span>

                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          p.inStock ? 'bg-[#78816A]/15 text-[#78816A]' : 'bg-[#991B1B]/15 text-[#991B1B]'
                        }`}>
                          {p.inStock ? 'In Stock' : 'Made to Order'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-0 border-[#E6D7CD]">
                    <button
                      onClick={() => toggleProductStock(p.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                        p.inStock
                          ? 'bg-[#78816A] text-white hover:bg-[#68705B]'
                          : 'bg-[#991B1B] text-white hover:bg-[#7F1D1D]'
                      }`}
                    >
                      {p.inStock ? 'Set Made to Order' : 'Set In Stock'}
                    </button>

                    <button
                      onClick={() => {
                        setEditingProduct({
                          ...p,
                          images: p.images || [],
                        });
                        setEditProductImageError(null);
                      }}
                      className="p-2 rounded-full border border-[#D99AA3] text-[#6E3947] hover:bg-white transition-colors cursor-pointer"
                      title="Edit Product Details & Images"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Archive/Delete "${p.name}" from catalog?`)) {
                          deleteProduct(p.id);
                        }
                      }}
                      className="p-2 rounded-full border border-red-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Category Management */}
        {adminTab === 'categories' && (
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E6D7CD] shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F6F0E7] gap-3">
              <div>
                <h3 className="font-serif text-xl font-semibold text-[#321923]">
                  Product Category Management
                </h3>
                <p className="text-xs text-[#8E987E]">
                  Create, edit, and organize product categories. Newly added categories instantly appear in storefront filters.
                </p>
              </div>

              <button
                onClick={() => {
                  setNewCategoryName('');
                  setNewCategoryTagline('');
                  setCategoryModalError(null);
                  setIsNewCategoryOpen(true);
                }}
                className="px-4 py-2.5 rounded-full bg-[#6E3947] hover:bg-[#522734] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
              >
                <FolderPlus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>

            {/* Category Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => {
                const assignedCount = products.filter((p) => p.category === cat.slug).length;
                return (
                  <div
                    key={cat.id}
                    className="p-5 rounded-2xl border border-[#E6D7CD] bg-[#FAF6F0]/60 hover:bg-[#FAF6F0] transition-colors flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-lg font-semibold text-[#321923]">
                          {cat.name}
                        </span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white border border-[#E6D7CD] text-[#6E3947] font-semibold">
                          {assignedCount} {assignedCount === 1 ? 'item' : 'items'}
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-[#8E987E] mt-0.5">
                        Slug: <code>{cat.slug}</code>
                      </p>
                      <p className="text-xs text-[#6B5B54] mt-2 leading-relaxed">
                        {cat.tagline || 'Artisanal handcrafted creations'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#E6D7CD] flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingCategory(cat);
                          setEditCategoryName(cat.name);
                          setEditCategoryTagline(cat.tagline || '');
                          setCategoryModalError(null);
                        }}
                        className="p-2 rounded-full border border-[#D99AA3] text-[#6E3947] hover:bg-white text-xs flex items-center gap-1 transition-colors cursor-pointer"
                        title="Edit Category Name & Tagline"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-medium pr-1">Edit</span>
                      </button>

                      <button
                        onClick={() => {
                          setDeletingCategory(cat);
                          // Default reassign target to the first alternative category
                          const alt = categories.find((c) => c.id !== cat.id);
                          setReassignCategorySlug(alt ? alt.slug : '');
                          setDeleteCategoryError(null);
                        }}
                        className="p-2 rounded-full border border-red-200 text-red-600 hover:bg-red-50 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-medium pr-1">Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: Registered Orders */}
        {adminTab === 'orders' && (
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E6D7CD] shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#321923] pb-2 border-b border-[#F6F0E7]">
              Customer Order Requests ({orders.length})
            </h3>
            {orders.length === 0 ? (
              <p className="text-xs text-[#8E987E] py-4 text-center">No orders recorded yet.</p>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.orderId}
                    className="p-4 rounded-2xl border border-[#E6D7CD] bg-[#FAF6F0] space-y-2 text-xs"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-[#6E3947]">{ord.orderId}</span>
                      <span className="px-2 py-0.5 rounded bg-[#F0C9CB] text-[#6E3947] font-semibold">
                        {ord.status}
                      </span>
                    </div>
                    <div>
                      {ord.items.map((it, i) => (
                        <p key={i} className="text-[#321923]">
                          • {it.quantity}x {it.name} ({it.color}) — ₹{(it.price * it.quantity).toLocaleString()}
                        </p>
                      ))}
                    </div>
                    {ord.shippingAddress && (
                      <p className="text-[#8E987E] pt-1 border-t border-[#E6D7CD]/50">
                        Recipient: <strong>{ord.shippingAddress.fullName}</strong> • Phone: {ord.shippingAddress.phone} • {ord.shippingAddress.city}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: Custom Requests */}
        {adminTab === 'requests' && (
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E6D7CD] shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#321923] pb-2 border-b border-[#F6F0E7]">
              Custom Bespoke Commissions ({customRequests.length})
            </h3>
            {customRequests.length === 0 ? (
              <p className="text-xs text-[#8E987E] py-4 text-center">No custom requests yet.</p>
            ) : (
              <div className="space-y-4">
                {customRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-2xl border border-[#E6D7CD] bg-[#FAF6F0] space-y-2 text-xs"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-[#6E3947]">
                        {req.id} — {req.productType}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#F0C9CB] text-[#6E3947] font-semibold">
                        {req.status}
                      </span>
                    </div>
                    <p className="text-[#321923]">
                      Primary: <strong>{req.primaryColor}</strong> • Accent: <strong>{req.accentColor || 'None'}</strong> • Size: {req.size}
                    </p>
                    {req.customNotes && (
                      <p className="text-[#6B5B54] italic">"{req.customNotes}"</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: Settings */}
        {adminTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl p-5 sm:p-8 border border-[#E6D7CD] shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#F6F0E7]">
              <h3 className="font-serif text-lg font-semibold text-[#321923]">
                Business Information & Contact Parameters
              </h3>
              {settingsSavedToast && (
                <span className="text-xs text-[#78816A] font-semibold flex items-center gap-1 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4" />
                  Settings Updated!
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-[#321923] block mb-1">
                  Business Brand Name (Exact)
                </label>
                <input
                  type="text"
                  value={settingsForm.brandName}
                  disabled
                  className="w-full p-2.5 rounded-xl border border-[#E6D7CD] bg-[#FAF6F0] text-[#392923] font-serif"
                />
                <span className="text-[10px] text-[#8E987E]">Locked strictly to "Deepu Creations"</span>
              </div>

              <div>
                <label className="font-semibold text-[#321923] block mb-1">
                  Official Slogan (Placeholder if unconfirmed)
                </label>
                <input
                  type="text"
                  value={settingsForm.slogan}
                  onChange={(e) => setSettingsForm({ ...settingsForm, slogan: e.target.value })}
                  placeholder="[OFFICIAL_SLOGAN]"
                  className="w-full p-2.5 rounded-xl border border-[#E6D7CD] bg-white text-[#392923]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#321923] block mb-1">
                  WhatsApp Contact Number
                </label>
                <input
                  type="text"
                  value={settingsForm.whatsappNumber}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                  placeholder="[WHATSAPP_NUMBER]"
                  className="w-full p-2.5 rounded-xl border border-[#E6D7CD] bg-white text-[#392923]"
                />
                <label className="flex items-center gap-2 mt-1.5 cursor-pointer text-[11px] text-[#6B5B54]">
                  <input
                    type="checkbox"
                    checked={settingsForm.isWhatsappConfigured}
                    onChange={(e) => setSettingsForm({ ...settingsForm, isWhatsappConfigured: e.target.checked })}
                    className="rounded text-[#6E3947]"
                  />
                  <span>Mark as Official Confirmed Number</span>
                </label>
              </div>

              <div>
                <label className="font-semibold text-[#321923] block mb-1">
                  Official Instagram URL
                </label>
                <input
                  type="text"
                  value={settingsForm.instagramUrl}
                  onChange={(e) => setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })}
                  placeholder="[INSTAGRAM_URL]"
                  className="w-full p-2.5 rounded-xl border border-[#E6D7CD] bg-white text-[#392923]"
                />
                <label className="flex items-center gap-2 mt-1.5 cursor-pointer text-[11px] text-[#6B5B54]">
                  <input
                    type="checkbox"
                    checked={settingsForm.isInstagramConfigured}
                    onChange={(e) => setSettingsForm({ ...settingsForm, isInstagramConfigured: e.target.checked })}
                    className="rounded text-[#6E3947]"
                  />
                  <span>Mark as Official Confirmed Profile</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-[#F6F0E7] flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-[#6E3947] hover:bg-[#522734] text-white text-xs font-semibold shadow-md active:scale-95 cursor-pointer"
              >
                Save Business Settings
              </button>
            </div>
          </form>
        )}
      </div>

      {/* MODAL: Create New Product */}
      {isNewProductOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#E6D7CD] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6D7CD]">
              <h3 className="font-serif text-xl font-semibold text-[#321923]">
                Create New Catalog Product
              </h3>
              <button
                onClick={() => setIsNewProductOpen(false)}
                className="p-1 rounded-full text-[#8E987E] hover:text-[#321923]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-[#321923] block mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={newProductForm.name}
                  onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                  placeholder="e.g. Lavender Blossom Bouquet"
                  className="w-full p-2.5 rounded-xl border border-[#E6D7CD] focus:ring-2 focus:ring-[#6E3947]/30 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#321923] block mb-1">Category *</label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#E6D7CD] focus:outline-none bg-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#321923] block mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newProductForm.price}
                    onChange={(e) => setNewProductForm({ ...newProductForm, price: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-[#E6D7CD] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#321923] block mb-1">Short Description</label>
                <input
                  type="text"
                  value={newProductForm.shortDescription}
                  onChange={(e) => setNewProductForm({ ...newProductForm, shortDescription: e.target.value })}
                  placeholder="Single-sentence summary for catalog card..."
                  className="w-full p-2.5 rounded-xl border border-[#E6D7CD] focus:outline-none"
                />
              </div>

              {/* Manual Device Image Upload Section */}
              <div className="space-y-2 pt-1 border-t border-[#F6F0E7]">
                <label className="font-semibold text-[#321923] block flex items-center justify-between">
                  <span>Product Photos (Manual Upload from Device)</span>
                  <span className="text-[10px] text-[#8E987E] font-normal">Max 5MB • JPG, PNG, WEBP</span>
                </label>

                {newProductImageError && (
                  <p className="text-red-600 text-xs flex items-center gap-1 p-2 rounded-lg bg-red-50 border border-red-200">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{newProductImageError}</span>
                  </p>
                )}

                {/* Upload Button */}
                <label
                  htmlFor="new_product_image_input"
                  className="w-full py-4 border-2 border-dashed border-[#D99AA3] hover:border-[#6E3947] bg-[#FAF6F0] hover:bg-[#F0C9CB]/20 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors p-3 text-center"
                >
                  <Upload className="w-6 h-6 text-[#6E3947] mb-1" />
                  <span className="font-medium text-xs text-[#321923]">Choose photo files from your device</span>
                  <span className="text-[10px] text-[#8E987E] mt-0.5">Supports multi-image gallery uploads</span>
                  <input
                    type="file"
                    id="new_product_image_input"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    onChange={(e) => handleImageUpload(e, false)}
                    className="hidden"
                  />
                </label>

                {/* Image Previews */}
                {newProductForm.images.length > 0 ? (
                  <div className="space-y-1.5 pt-2">
                    <p className="text-[11px] text-[#8E987E] font-medium">
                      Uploaded Photos ({newProductForm.images.length}):
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {newProductForm.images.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-square rounded-xl overflow-hidden border border-[#E6D7CD] group bg-white shadow-xs"
                        >
                          <img src={imgUrl} alt="Preview" className="w-full h-full object-cover" />
                          
                          {idx === 0 && (
                            <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#6E3947] text-white flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-current" />
                              Primary
                            </span>
                          )}

                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                            {idx !== 0 && (
                              <button
                                type="button"
                                onClick={() => handleSetPrimaryImage(idx, false)}
                                className="p-1 rounded-full bg-white text-[#6E3947] hover:scale-110 transition-transform"
                                title="Set as Primary"
                              >
                                <Star className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx, false)}
                              className="p-1 rounded-full bg-white text-red-600 hover:scale-110 transition-transform"
                              title="Remove photo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-[#FAF6F0] border border-[#E6D7CD] flex items-center gap-2 text-[11px] text-[#8E987E]">
                    <ImageIcon className="w-4 h-4 text-[#D99AA3]" />
                    <span>No image uploaded yet. A neutral placeholder will be shown until you upload a photo.</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="inStockCheck"
                  checked={newProductForm.inStock}
                  onChange={(e) => setNewProductForm({ ...newProductForm, inStock: e.target.checked })}
                  className="rounded text-[#6E3947]"
                />
                <label htmlFor="inStockCheck" className="text-xs text-[#392923] cursor-pointer">
                  Ready to Ship (In Stock immediately)
                </label>
              </div>

              <div className="pt-3 border-t border-[#E6D7CD] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewProductOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#E6D7CD] text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#6E3947] text-white text-xs font-semibold shadow-md cursor-pointer hover:bg-[#522734]"
                >
                  Save & Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Edit Existing Product */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#E6D7CD] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6D7CD]">
              <h3 className="font-serif text-xl font-semibold text-[#321923]">
                Edit Product: {editingProduct.name}
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 rounded-full text-[#8E987E] hover:text-[#321923]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProductSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-[#321923] block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#E6D7CD]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#321923] block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-[#E6D7CD]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#321923] block mb-1">Category</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#E6D7CD] bg-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#321923] block mb-1">Short Description</label>
                <input
                  type="text"
                  value={editingProduct.shortDescription}
                  onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#E6D7CD]"
                />
              </div>

              {/* Manual Device Image Upload for Edit Modal */}
              <div className="space-y-2 pt-1 border-t border-[#F6F0E7]">
                <label className="font-semibold text-[#321923] block flex items-center justify-between">
                  <span>Product Photos ({editingProduct.images.length})</span>
                  <span className="text-[10px] text-[#8E987E] font-normal">Max 5MB each • Device files</span>
                </label>

                {editProductImageError && (
                  <p className="text-red-600 text-xs flex items-center gap-1 p-2 rounded-lg bg-red-50 border border-red-200">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{editProductImageError}</span>
                  </p>
                )}

                {/* Upload More Photos Control */}
                <label
                  htmlFor="edit_product_image_input"
                  className="w-full py-3.5 border-2 border-dashed border-[#D99AA3] hover:border-[#6E3947] bg-[#FAF6F0] hover:bg-[#F0C9CB]/20 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors p-3 text-center"
                >
                  <Upload className="w-5 h-5 text-[#6E3947] mb-1" />
                  <span className="font-medium text-xs text-[#321923]">Upload additional photos from your device</span>
                  <input
                    type="file"
                    id="edit_product_image_input"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    onChange={(e) => handleImageUpload(e, true)}
                    className="hidden"
                  />
                </label>

                {/* Gallery Thumbnails */}
                {editingProduct.images.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
                    {editingProduct.images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square rounded-xl overflow-hidden border border-[#E6D7CD] group bg-white shadow-xs"
                      >
                        <img src={imgUrl} alt="Product" className="w-full h-full object-cover" />
                        
                        {idx === 0 && (
                          <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#6E3947] text-white flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 fill-current" />
                            Primary
                          </span>
                        )}

                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                          {idx !== 0 && (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(idx, true)}
                              className="p-1 rounded-full bg-white text-[#6E3947] hover:scale-110 transition-transform"
                              title="Set as Primary"
                            >
                              <Star className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx, true)}
                            className="p-1 rounded-full bg-white text-red-600 hover:scale-110 transition-transform"
                            title="Remove photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-[#FAF6F0] border border-[#E6D7CD] flex items-center gap-2 text-[11px] text-[#8E987E]">
                    <ImageOff className="w-4 h-4 text-[#D99AA3]" />
                    <span>No image uploaded. Storefront will display a neutral crochet placeholder.</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="editStockCheck"
                  checked={editingProduct.inStock}
                  onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                  className="rounded text-[#6E3947]"
                />
                <label htmlFor="editStockCheck" className="text-xs text-[#392923] cursor-pointer">
                  In Stock (Ready to dispatch)
                </label>
              </div>

              <div className="pt-3 border-t border-[#E6D7CD] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-full border border-[#E6D7CD] text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#6E3947] text-white text-xs font-semibold shadow-md cursor-pointer hover:bg-[#522734]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Create New Category */}
      {isNewCategoryOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#E6D7CD] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6D7CD]">
              <h3 className="font-serif text-xl font-semibold text-[#321923]">
                Create Category
              </h3>
              <button
                onClick={() => setIsNewCategoryOpen(false)}
                className="p-1 rounded-full text-[#8E987E] hover:text-[#321923]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {categoryModalError && (
              <p className="text-red-600 text-xs flex items-center gap-1 p-2 rounded-lg bg-red-50 border border-red-200">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{categoryModalError}</span>
              </p>
            )}

            <form onSubmit={handleCreateCategory} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-[#321923] block mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Keychains & Charms"
                  className="w-full p-2.5 rounded-xl border border-[#E6D7CD] focus:ring-2 focus:ring-[#6E3947]/30 focus:outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="font-semibold text-[#321923] block mb-1">Tagline or Description</label>
                <input
                  type="text"
                  value={newCategoryTagline}
                  onChange={(e) => setNewCategoryTagline(e.target.value)}
                  placeholder="e.g. Miniature keepsake charms and key holders"
                  className="w-full p-2.5 rounded-xl border border-[#E6D7CD] focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-[#E6D7CD] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewCategoryOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#E6D7CD] text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#6E3947] text-white text-xs font-semibold shadow-md hover:bg-[#522734]"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Edit Category */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#E6D7CD] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6D7CD]">
              <h3 className="font-serif text-xl font-semibold text-[#321923]">
                Edit Category: {editingCategory.name}
              </h3>
              <button
                onClick={() => setEditingCategory(null)}
                className="p-1 rounded-full text-[#8E987E] hover:text-[#321923]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {categoryModalError && (
              <p className="text-red-600 text-xs flex items-center gap-1 p-2 rounded-lg bg-red-50 border border-red-200">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{categoryModalError}</span>
              </p>
            )}

            <form onSubmit={handleUpdateCategorySubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-[#321923] block mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={editCategoryName}
                  onChange={(e) => setEditCategoryName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E6D7CD] focus:ring-2 focus:ring-[#6E3947]/30 focus:outline-none"
                />
                <p className="text-[10px] text-[#8E987E] mt-1">
                  Updating this name automatically updates all assigned products in the catalog.
                </p>
              </div>

              <div>
                <label className="font-semibold text-[#321923] block mb-1">Tagline or Description</label>
                <input
                  type="text"
                  value={editCategoryTagline}
                  onChange={(e) => setEditCategoryTagline(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E6D7CD] focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-[#E6D7CD] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 rounded-full border border-[#E6D7CD] text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#6E3947] text-white text-xs font-semibold shadow-md hover:bg-[#522734]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Delete Category Safeguard */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#E6D7CD] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6D7CD]">
              <h3 className="font-serif text-xl font-semibold text-red-700 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span>Delete Category</span>
              </h3>
              <button
                onClick={() => setDeletingCategory(null)}
                className="p-1 rounded-full text-[#8E987E] hover:text-[#321923]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {deleteCategoryError && (
              <p className="text-red-600 text-xs flex items-center gap-1 p-2 rounded-lg bg-red-50 border border-red-200">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{deleteCategoryError}</span>
              </p>
            )}

            {(() => {
              const assigned = products.filter((p) => p.category === deletingCategory.slug);
              const otherCategories = categories.filter((c) => c.id !== deletingCategory.id);

              return (
                <form onSubmit={handleDeleteCategorySubmit} className="space-y-4 text-xs">
                  <p className="text-[#321923]">
                    Are you sure you want to delete category <strong>"{deletingCategory.name}"</strong>?
                  </p>

                  {assigned.length > 0 ? (
                    <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
                      <p className="font-semibold text-xs flex items-center gap-1 text-amber-800">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>Safeguard Requirement</span>
                      </p>
                      <p className="leading-relaxed">
                        There are currently <strong>{assigned.length}</strong> product(s) assigned to this category. To protect these products from breaking, please select a replacement category to reassign them to:
                      </p>

                      <div className="pt-1">
                        <label className="font-semibold text-amber-950 block mb-1">
                          Reassign Products To: *
                        </label>
                        <select
                          required
                          value={reassignCategorySlug}
                          onChange={(e) => setReassignCategorySlug(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-xs focus:outline-none"
                        >
                          <option value="">Select target category...</option>
                          {otherCategories.map((c) => (
                            <option key={c.id} value={c.slug}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-[#8E987E]">
                      No products are currently assigned to this category. It will be removed permanently.
                    </p>
                  )}

                  <div className="pt-3 border-t border-[#E6D7CD] flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setDeletingCategory(null)}
                      className="px-4 py-2 rounded-full border border-[#E6D7CD] text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-md cursor-pointer"
                    >
                      {assigned.length > 0 ? 'Reassign & Delete' : 'Confirm Delete'}
                    </button>
                  </div>
                </form>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
