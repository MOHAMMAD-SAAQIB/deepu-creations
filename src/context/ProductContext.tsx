import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS, CATEGORIES, Product, Category } from '../data/products';

interface ProductContextType {
  products: Product[];
  categories: Category[];
  addProduct: (product: Omit<Product, 'id' | 'slug'>) => Product;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductStock: (id: string) => void;
  updateProductPrice: (id: string, newPrice: number) => void;
  getProductBySlug: (slug: string) => Product | undefined;
  addCategory: (name: string, tagline?: string) => { success: boolean; error?: string; category?: Category };
  updateCategory: (id: string, name: string, tagline?: string) => { success: boolean; error?: string };
  deleteCategory: (id: string, reassignToSlug?: string) => { success: boolean; error?: string };
  getCategoryBySlug: (slug: string) => Category | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const PRODUCTS_STORAGE_KEY = 'deepu_creations_live_catalog_v2';
const CATEGORIES_STORAGE_KEY = 'deepu_creations_categories_v2';

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : PRODUCTS;
    } catch {
      return PRODUCTS;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const stored = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
      return CATEGORIES;
    } catch {
      return CATEGORIES;
    }
  });

  // Calculate dynamic category counts based on current products
  const categoriesWithCounts = React.useMemo(() => {
    return categories.map((cat) => ({
      ...cat,
      count: products.filter((p) => p.category === cat.slug).length,
    }));
  }, [categories, products]);

  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.warn('Failed to persist products:', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    } catch (e) {
      console.warn('Failed to persist categories:', e);
    }
  }, [categories]);

  const addProduct = (data: Omit<Product, 'id' | 'slug'>): Product => {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newProd: Product = {
      ...data,
      id: `prod-${Date.now()}`,
      slug,
      isDemoAsset: false,
    };
    setProducts((prev) => [newProd, ...prev]);
    return newProd;
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const newSlug = updated.name
          ? updated.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
          : p.slug;
        return {
          ...p,
          ...updated,
          slug: newSlug,
        };
      })
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleProductStock = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p))
    );
  };

  const updateProductPrice = (id: string, newPrice: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, price: newPrice, isPricePlaceholder: false } : p))
    );
  };

  const getProductBySlug = (slug: string) => {
    return products.find((p) => p.slug === slug);
  };

  const getCategoryBySlug = (slug: string) => {
    return categoriesWithCounts.find((c) => c.slug === slug);
  };

  // Category Management
  const addCategory = (name: string, tagline?: string): { success: boolean; error?: string; category?: Category } => {
    const trimmed = name.trim();
    if (!trimmed) {
      return { success: false, error: 'Category name cannot be empty.' };
    }

    const duplicate = categories.some(
      (c) => c.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (duplicate) {
      return { success: false, error: `A category named "${trimmed}" already exists.` };
    }

    let slug = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (!slug) slug = `cat-${Date.now()}`;

    // Ensure slug uniqueness
    if (categories.some((c) => c.slug === slug)) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      slug,
      name: trimmed,
      tagline: tagline?.trim() || 'Artisanal handcrafted creations',
      count: 0,
    };

    setCategories((prev) => [...prev, newCategory]);
    return { success: true, category: newCategory };
  };

  const updateCategory = (id: string, name: string, tagline?: string): { success: boolean; error?: string } => {
    const trimmed = name.trim();
    if (!trimmed) {
      return { success: false, error: 'Category name cannot be empty.' };
    }

    const duplicate = categories.some(
      (c) => c.id !== id && c.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (duplicate) {
      return { success: false, error: `Another category named "${trimmed}" already exists.` };
    }

    const existingCat = categories.find((c) => c.id === id);
    if (!existingCat) {
      return { success: false, error: 'Category not found.' };
    }

    const oldSlug = existingCat.slug;
    let newSlug = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (!newSlug) newSlug = existingCat.slug;

    // Update categories
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              name: trimmed,
              slug: newSlug,
              tagline: tagline !== undefined ? tagline.trim() : c.tagline,
            }
          : c
      )
    );

    // If slug or name changed, update assigned products
    if (oldSlug !== newSlug || existingCat.name !== trimmed) {
      setProducts((prev) =>
        prev.map((p) =>
          p.category === oldSlug
            ? {
                ...p,
                category: newSlug,
                categoryLabel: trimmed,
              }
            : p
        )
      );
    }

    return { success: true };
  };

  const deleteCategory = (id: string, reassignToSlug?: string): { success: boolean; error?: string } => {
    const categoryToDelete = categories.find((c) => c.id === id);
    if (!categoryToDelete) {
      return { success: false, error: 'Category not found.' };
    }

    if (categories.length <= 1) {
      return { success: false, error: 'At least one category must remain in the catalog.' };
    }

    const assignedProducts = products.filter((p) => p.category === categoryToDelete.slug);

    if (assignedProducts.length > 0) {
      if (!reassignToSlug) {
        return {
          success: false,
          error: `Cannot delete "${categoryToDelete.name}" because ${assignedProducts.length} product(s) are assigned to it. Please select a category to reassign them to.`,
        };
      }

      const targetCategory = categories.find((c) => c.slug === reassignToSlug && c.id !== id);
      if (!targetCategory) {
        return { success: false, error: 'Reassignment target category not found.' };
      }

      // Reassign products to the target category
      setProducts((prev) =>
        prev.map((p) =>
          p.category === categoryToDelete.slug
            ? {
                ...p,
                category: targetCategory.slug,
                categoryLabel: targetCategory.name,
              }
            : p
        )
      );
    }

    // Remove category
    setCategories((prev) => prev.filter((c) => c.id !== id));
    return { success: true };
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories: categoriesWithCounts,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductStock,
        updateProductPrice,
        getProductBySlug,
        addCategory,
        updateCategory,
        deleteCategory,
        getCategoryBySlug,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
