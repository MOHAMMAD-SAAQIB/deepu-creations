import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../data/products';

export interface CartItem {
  id: string; // unique item id = productId-color-size
  productId: string;
  name: string;
  image: string;
  price: number;
  isPricePlaceholder: boolean;
  currencySymbol: string;
  color: string;
  colorHex?: string;
  size?: string;
  quantity: number;
  customNote?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, options?: { color?: string; colorHex?: string; size?: string; quantity?: number; customNote?: string }) => void;
  updateQuantity: (itemId: string, newQty: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'deepu_creations_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to persist cart:', e);
    }
  }, [cart]);

  const addToCart = (
    product: Product,
    options?: { color?: string; colorHex?: string; size?: string; quantity?: number; customNote?: string }
  ) => {
    const selectedColor = options?.color || (product.colors[0] ? product.colors[0].name : 'Standard');
    const selectedColorHex = options?.colorHex || (product.colors[0] ? product.colors[0].hex : undefined);
    const selectedSize = options?.size || (product.sizes ? product.sizes[0] : 'Standard');
    const quantityToAdd = options?.quantity || 1;
    const itemId = `${product.id}-${selectedColor}-${selectedSize}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + quantityToAdd } : item
        );
      }
      const newItem: CartItem = {
        id: itemId,
        productId: product.id,
        name: product.name,
        image: product.images[0] || '/images/tulip_bouquet.jpg',
        price: product.price,
        isPricePlaceholder: product.isPricePlaceholder,
        currencySymbol: product.currencySymbol,
        color: selectedColor,
        colorHex: selectedColorHex,
        size: selectedSize,
        quantity: quantityToAdd,
        customNote: options?.customNote,
      };
      return [...prev, newItem];
    });

    setIsCartDrawerOpen(true);
  };

  const updateQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: newQty } : item))
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        itemCount,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
