import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CustomerAddress {
  id: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
}

export interface CustomerOrder {
  orderId: string;
  createdAt: string;
  status: 'Draft Request' | 'Confirmed' | 'In Crafting' | 'Dispatched' | 'Delivered';
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    color: string;
    size?: string;
    image: string;
  }>;
  subtotal: number;
  customerNotes?: string;
  shippingAddress?: CustomerAddress;
  isDraft: boolean; // clearly indicates payment gateway deferred
}

export interface CustomOrderSubmission {
  id: string;
  submittedAt: string;
  productType: string;
  primaryColor: string;
  primaryColorHex: string;
  accentColor?: string;
  accentColorHex?: string;
  size: string;
  customNotes: string;
  status: 'Under Review' | 'Crafting' | 'Ready to Dispatch';
  estimatedCraftDays: number;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  addresses: CustomerAddress[];
  isDemoCustomer: boolean;
}

interface AuthContextType {
  user: CustomerUser | null;
  orders: CustomerOrder[];
  customRequests: CustomOrderSubmission[];
  isGoogleAuthConfigured: boolean;
  googleClientId: string | null;
  googleAuthError: string | null;
  isGoogleLoading: boolean;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  clearGoogleAuthError: () => void;
  signInWithDemoCustomer: () => void;
  signOut: () => void;
  addOrder: (order: Omit<CustomerOrder, 'orderId' | 'createdAt'>) => string;
  addCustomRequest: (req: Omit<CustomOrderSubmission, 'id' | 'submittedAt' | 'status' | 'estimatedCraftDays'>) => string;
  addAddress: (address: Omit<CustomerAddress, 'id'>) => void;
  updateUser: (data: Partial<CustomerUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_KEY = 'deepu_creations_auth_user_v1';
const AUTH_ORDERS_KEY = 'deepu_creations_orders_v1';
const AUTH_REQUESTS_KEY = 'deepu_creations_custom_reqs_v1';

function parseJwtPayload(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to parse Google JWT payload:', e);
    return null;
  }
}

function loadGoogleScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
      return resolve();
    }
    const existing = document.getElementById('google-gsi-client');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', (e) => reject(e));
      return;
    }
    const script = document.createElement('script');
    script.id = 'google-gsi-client';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = (e) => reject(e);
    document.head.appendChild(script);
  });
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || null;
  const isGoogleAuthConfigured = Boolean(
    googleClientId &&
    googleClientId !== '[GOOGLE_CLIENT_ID]' &&
    googleClientId.trim().length > 0
  );

  const [googleAuthError, setGoogleAuthError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

  const [user, setUser] = useState<CustomerUser | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [orders, setOrders] = useState<CustomerOrder[]>(() => {
    try {
      const stored = localStorage.getItem(AUTH_ORDERS_KEY);
      if (stored) return JSON.parse(stored);
      // Sample initial verified demo order
      return [
        {
          orderId: 'DC-2026-081',
          createdAt: '2026-10-18',
          status: 'In Crafting',
          items: [
            {
              name: 'Artisan Tulip Bouquet',
              quantity: 1,
              price: 1499,
              color: 'Pastel Blush',
              size: 'Classic (7 Stems)',
              image: '/images/tulip_bouquet.jpg',
            },
          ],
          subtotal: 1499,
          customerNotes: 'Please include a handwritten gift tag: Happy Birthday Ananya!',
          isDraft: false,
        },
      ];
    } catch {
      return [];
    }
  });

  const [customRequests, setCustomRequests] = useState<CustomOrderSubmission[]>(() => {
    try {
      const stored = localStorage.getItem(AUTH_REQUESTS_KEY);
      if (stored) return JSON.parse(stored);
      return [
        {
          id: 'REQ-904',
          submittedAt: '2026-10-21',
          productType: 'Heirloom Bunny',
          primaryColor: 'Blush Pink',
          primaryColorHex: '#F0C9CB',
          accentColor: 'Cream Ivory',
          accentColorHex: '#F6F0E7',
          size: 'Classic (26 cm)',
          customNotes: 'Embroider letter "A" on the left ear with subtle rose gold thread.',
          status: 'Under Review',
          estimatedCraftDays: 5,
        },
      ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_USER_KEY);
      }
    } catch (e) {
      console.warn('Failed to store auth user:', e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(AUTH_ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {
      console.warn('Failed to store orders:', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(AUTH_REQUESTS_KEY, JSON.stringify(customRequests));
    } catch (e) {
      console.warn('Failed to store custom requests:', e);
    }
  }, [customRequests]);

  const clearGoogleAuthError = () => {
    setGoogleAuthError(null);
  };

  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    if (!isGoogleAuthConfigured || !googleClientId) {
      const err = 'Google Sign-In configuration is missing. VITE_GOOGLE_CLIENT_ID must be specified in the project environment.';
      setGoogleAuthError(err);
      return { success: false, error: err };
    }

    setIsGoogleLoading(true);
    setGoogleAuthError(null);

    try {
      await loadGoogleScript();
      return new Promise((resolve) => {
        const google = (window as any).google;
        if (!google?.accounts?.id) {
          setIsGoogleLoading(false);
          const err = 'Failed to load Google Identity Services library.';
          setGoogleAuthError(err);
          resolve({ success: false, error: err });
          return;
        }

        google.accounts.id.initialize({
          client_id: googleClientId,
          callback: (response: any) => {
            setIsGoogleLoading(false);
            if (response.credential) {
              const payload = parseJwtPayload(response.credential);
              if (payload && payload.email) {
                const googleCustomer: CustomerUser = {
                  id: `google-${payload.sub}`,
                  name: payload.name || payload.given_name || payload.email.split('@')[0],
                  email: payload.email,
                  avatar: payload.picture,
                  addresses: [],
                  isDemoCustomer: false,
                };
                setUser(googleCustomer);
                setGoogleAuthError(null);
                resolve({ success: true });
                return;
              }
            }
            const err = 'Invalid credential token returned from Google.';
            setGoogleAuthError(err);
            resolve({ success: false, error: err });
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            setIsGoogleLoading(false);
          }
        });
      });
    } catch (e: any) {
      setIsGoogleLoading(false);
      const err = e?.message || 'Failed to initialize Google Authentication.';
      setGoogleAuthError(err);
      return { success: false, error: err };
    }
  };

  const signInWithDemoCustomer = () => {
    const demoUser: CustomerUser = {
      id: 'usr-demo-01',
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isDemoCustomer: true,
      addresses: [
        {
          id: 'addr-1',
          fullName: 'Priya Sharma',
          street: 'Apartment 4B, Gulmohar Enclave, Indiranagar',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560038',
          phone: '+91 98765 43210',
          isDefault: true,
        },
      ],
    };
    setUser(demoUser);
  };

  const signOut = () => {
    setUser(null);
  };

  const addOrder = (orderData: Omit<CustomerOrder, 'orderId' | 'createdAt'>): string => {
    const orderId = `DC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder: CustomerOrder = {
      ...orderData,
      orderId,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setOrders((prev) => [newOrder, ...prev]);
    return orderId;
  };

  const addCustomRequest = (
    reqData: Omit<CustomOrderSubmission, 'id' | 'submittedAt' | 'status' | 'estimatedCraftDays'>
  ): string => {
    const id = `REQ-${Math.floor(100 + Math.random() * 900)}`;
    const newReq: CustomOrderSubmission = {
      ...reqData,
      id,
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'Under Review',
      estimatedCraftDays: 6,
    };
    setCustomRequests((prev) => [newReq, ...prev]);
    return id;
  };

  const addAddress = (addr: Omit<CustomerAddress, 'id'>) => {
    if (!user) return;
    const newAddress: CustomerAddress = {
      ...addr,
      id: `addr-${Date.now()}`,
    };
    setUser({
      ...user,
      addresses: [...user.addresses, newAddress],
    });
  };

  const updateUser = (data: Partial<CustomerUser>) => {
    if (!user) return;
    setUser({
      ...user,
      ...data,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        orders,
        customRequests,
        isGoogleAuthConfigured,
        googleClientId,
        googleAuthError,
        isGoogleLoading,
        signInWithGoogle,
        clearGoogleAuthError,
        signInWithDemoCustomer,
        signOut,
        addOrder,
        addCustomRequest,
        addAddress,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
