import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  User,
  Package,
  Heart,
  Sparkles,
  MapPin,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  ShieldAlert,
  Shield,
  ShieldCheck,
  Lock,
  ArrowRight,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '../context/AdminContext';
import { useWishlist } from '../context/WishlistContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/common/ProductCard';

export const AccountPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'orders';

  const {
    user,
    orders,
    customRequests,
    isGoogleAuthConfigured,
    googleAuthError,
    isGoogleLoading,
    signInWithGoogle,
    clearGoogleAuthError,
    signInWithDemoCustomer,
    signOut,
  } = useAuth();

  const { isAdminAuthenticated } = useAdmin();
  const { wishlist } = useWishlist();

  const [showGoogleConfigModal, setShowGoogleConfigModal] = useState(false);

  const wishlistedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  const setTab = (tab: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', tab);
    setSearchParams(params);
  };

  const handleGoogleSignInClick = async () => {
    if (!isGoogleAuthConfigured) {
      setShowGoogleConfigModal(true);
      return;
    }
    const res = await signInWithGoogle();
    if (!res.success) {
      setShowGoogleConfigModal(true);
    }
  };

  // If user is not logged in, show login / demo auth switcher
  if (!user) {
    return (
      <div className="min-h-screen bg-[#F6F0E7] bg-crochet-pattern py-12 px-4 sm:px-6 lg:px-8 pb-24 md:pb-12">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-[#E6D7CD] shadow-lg text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#F0C9CB]/40 text-[#6E3947] flex items-center justify-center mx-auto border border-[#D99AA3]">
            <User className="w-8 h-8 text-[#6E3947]" />
          </div>

          <div>
            <h1 className="font-serif text-2xl font-semibold text-[#321923]">
              Customer Account
            </h1>
            <p className="text-xs text-[#6B5B54] mt-1.5">
              Access your order history, custom crochet requests, and saved shipping destinations.
            </p>
          </div>

          {/* Customer Authentication Options */}
          <div className="space-y-3 pt-2">
            {/* Real Continue with Google Button */}
            <button
              type="button"
              onClick={handleGoogleSignInClick}
              disabled={isGoogleLoading}
              className="w-full py-3 px-4 rounded-full bg-white border border-[#E6D7CD] hover:border-[#D99AA3] text-[#392923] font-medium text-xs sm:text-sm tracking-wide shadow-xs flex items-center justify-center gap-3 transition-all hover:bg-[#FAF6F0] active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
            </button>

            <div className="flex items-center gap-3 my-2 text-[11px] text-[#8E987E]">
              <div className="h-px bg-[#E6D7CD] flex-1" />
              <span>or explore preview</span>
              <div className="h-px bg-[#E6D7CD] flex-1" />
            </div>

            {/* Test Customer Alternative */}
            <button
              type="button"
              onClick={signInWithDemoCustomer}
              className="w-full py-3 px-4 rounded-full bg-[#6E3947] hover:bg-[#522734] text-white font-medium text-xs sm:text-sm tracking-wide shadow-md shadow-[#6E3947]/20 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#F0C9CB]" />
              <span>Sign in as Test Customer (Priya Sharma)</span>
            </button>

            <Link
              to="/shop"
              className="block text-xs text-[#6E3947] hover:underline pt-2 font-medium"
            >
              ← Continue browsing without logging in
            </Link>
          </div>

          {/* Separated Atelier Staff & Admin Access Section */}
          <div className="pt-6 border-t border-[#E6D7CD] text-left">
            <div className="bg-[#FAF6F0] rounded-2xl p-4 border border-[#E6D7CD] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#522734] border border-[#F0C9CB]/20 flex items-center justify-center text-[#F0C9CB] flex-shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-serif text-xs font-semibold text-[#321923]">Atelier Staff & Administration</p>
                  <p className="text-[10px] text-[#8E987E]">Catalog, category & order management</p>
                </div>
              </div>
              <Link
                to="/admin/login"
                className="px-3.5 py-1.5 rounded-full bg-[#6E3947] hover:bg-[#522734] text-white text-[11px] font-semibold flex items-center gap-1 transition-all shadow-xs flex-shrink-0"
              >
                <span>Admin Login</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Google Authentication Setup / Requirements Modal */}
        {(showGoogleConfigModal || googleAuthError) && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#E6D7CD] shadow-2xl space-y-4 text-left">
              <div className="flex items-center justify-between pb-3 border-b border-[#E6D7CD]">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#6E3947]">
                  <ShieldAlert className="w-5 h-5 text-[#6E3947]" />
                  <span>Google Sign-In Configuration Required</span>
                </div>
                <button
                  onClick={() => {
                    setShowGoogleConfigModal(false);
                    clearGoogleAuthError();
                  }}
                  className="p-1 rounded-full text-[#8E987E] hover:text-[#321923]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-[#6B5B54] leading-relaxed">
                Per business instructions, Google authentication is code-integrated but requires your project's official <strong>Google OAuth 2.0 Web Client ID</strong> to connect with Google servers.
              </p>

              <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#E6D7CD] space-y-2 text-[11px] text-[#392923]">
                <p className="font-semibold text-[#6E3947]">Required Environment Setup:</p>
                <ol className="list-decimal list-inside space-y-1 text-[#6B5B54]">
                  <li>Open <strong>Google Cloud Console</strong> → APIs & Services → Credentials.</li>
                  <li>Create an <strong>OAuth 2.0 Client ID</strong> (Application type: Web application).</li>
                  <li>Add Authorized JavaScript origin: <code className="bg-white px-1.5 py-0.5 rounded border border-[#E6D7CD] font-mono text-[#321923]">http://localhost:5173</code></li>
                  <li>Add to your project <code className="bg-white px-1.5 py-0.5 rounded border border-[#E6D7CD] font-mono text-[#321923]">.env</code>:
                    <pre className="bg-[#220F16] text-[#F0C9CB] p-2 rounded-lg font-mono text-[10px] mt-1.5 overflow-x-auto">
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
                    </pre>
                  </li>
                </ol>
              </div>

              <p className="text-[11px] text-[#8E987E]">
                Until credentials are configured, please use the test customer button to explore customer profile features.
              </p>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowGoogleConfigModal(false);
                    clearGoogleAuthError();
                  }}
                  className="px-5 py-2 rounded-full bg-[#6E3947] text-white text-xs font-semibold"
                >
                  Understood
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F0E7] bg-crochet-pattern py-8 sm:py-12 px-4 sm:px-6 lg:px-8 pb-24 md:pb-12">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Customer Profile Banner */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E6D7CD] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#D99AA3] shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h1 className="font-serif text-xl sm:text-2xl font-semibold text-[#321923]">
                  {user.name}
                </h1>
                {user.isDemoCustomer && (
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#F0C9CB]/40 text-[#6E3947] border border-[#D99AA3]/30">
                    Test Customer
                  </span>
                )}
              </div>
              <p className="text-xs text-[#8E987E]">{user.email}</p>
            </div>
          </div>

          <button
            onClick={signOut}
            className="px-4 py-2 rounded-full border border-[#D99AA3] text-xs font-medium text-[#6E3947] hover:bg-[#FAF6F0] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Dedicated Admin Portal Access Banner for Authorized Administrators */}
        {isAdminAuthenticated && (
          <div className="bg-[#321923] text-[#FAF6F0] rounded-3xl p-5 border border-[#6E3947] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#522734] border border-[#F0C9CB]/20 flex items-center justify-center text-[#F0C9CB] flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-base font-semibold text-[#FAF6F0]">Atelier Administration Session Active</h2>
                  <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#78816A] text-white font-semibold">Authorized</span>
                </div>
                <p className="text-xs text-[#D99AA3] mt-0.5">
                  You are authenticated as an atelier manager. You can manage live catalog products, custom categories, and orders.
                </p>
              </div>
            </div>

            <Link
              to="/admin"
              className="px-5 py-2.5 rounded-full bg-[#6E3947] hover:bg-[#522734] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md active:scale-95 flex-shrink-0"
            >
              <span>Open Admin Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-[#E6D7CD]">
          {[
            { id: 'orders', label: 'My Orders', icon: Package, count: orders.length },
            { id: 'requests', label: 'Custom Requests', icon: Sparkles, count: customRequests.length },
            { id: 'wishlist', label: 'Wishlist', icon: Heart, count: wishlistedProducts.length },
            { id: 'addresses', label: 'Addresses', icon: MapPin, count: user.addresses.length },
          ].map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setTab(tab.id)}
                className={`py-3 px-4 text-xs font-semibold whitespace-nowrap flex items-center gap-2 border-b-2 transition-all ${
                  isActive
                    ? 'border-[#6E3947] text-[#6E3947]'
                    : 'border-transparent text-[#6B5B54] hover:text-[#321923]'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#FAF6F0] border border-[#E6D7CD]">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Orders */}
        {currentTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 border border-[#E6D7CD] text-center">
                <p className="text-xs text-[#6B5B54]">You have not registered any orders yet.</p>
                <Link
                  to="/shop"
                  className="mt-3 inline-block px-4 py-2 rounded-full bg-[#6E3947] text-white text-xs font-medium"
                >
                  Explore Catalog
                </Link>
              </div>
            ) : (
              orders.map((ord) => (
                <div
                  key={ord.orderId}
                  className="bg-white rounded-2xl p-5 border border-[#E6D7CD] shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#F6F0E7] gap-2">
                    <div>
                      <span className="font-mono text-xs font-semibold text-[#6E3947]">
                        {ord.orderId}
                      </span>
                      <span className="text-xs text-[#8E987E] ml-2">Placed on {ord.createdAt}</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#FAF6F0] text-[#6E3947] border border-[#D99AA3]/40 w-fit">
                      <Clock className="w-3.5 h-3.5 text-[#D99AA3]" />
                      <span>{ord.status}</span>
                    </span>
                  </div>

                  <div className="space-y-3">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="flex gap-3 text-xs">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 rounded-lg object-cover bg-[#F6F0E7]"
                        />
                        <div className="flex-1">
                          <h4 className="font-serif font-semibold text-[#321923]">{item.name}</h4>
                          <p className="text-[11px] text-[#8E987E]">
                            {item.color} • {item.size || 'Standard'} • Qty: {item.quantity}
                          </p>
                          <p className="font-semibold text-[#6E3947] mt-0.5">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {ord.customerNotes && (
                    <p className="text-[11px] text-[#6B5B54] bg-[#FAF6F0] p-2.5 rounded-lg italic">
                      Note: "{ord.customerNotes}"
                    </p>
                  )}

                  <div className="pt-2 border-t border-[#F6F0E7] flex justify-between items-center text-xs">
                    <span className="text-[#8E987E]">Order Total</span>
                    <span className="font-semibold text-[#321923] text-sm">
                      ₹{ord.subtotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Custom Requests */}
        {currentTab === 'requests' && (
          <div className="space-y-4">
            {customRequests.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 border border-[#E6D7CD] text-center">
                <p className="text-xs text-[#6B5B54]">No bespoke custom requests placed yet.</p>
                <Link
                  to="/custom-orders"
                  className="mt-3 inline-block px-4 py-2 rounded-full bg-[#6E3947] text-white text-xs font-medium"
                >
                  Start Custom Order
                </Link>
              </div>
            ) : (
              customRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl p-5 border border-[#E6D7CD] shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#F6F0E7]">
                    <span className="font-mono text-xs font-semibold text-[#6E3947]">
                      {req.id} • {req.productType}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F0C9CB]/40 text-[#6E3947] font-medium">
                      {req.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-[#6B5B54]">
                    <div>
                      <span className="text-[10px] text-[#8E987E] block">Primary Yarn:</span>
                      <span className="font-medium text-[#321923]">{req.primaryColor}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#8E987E] block">Accent Color:</span>
                      <span className="font-medium text-[#321923]">{req.accentColor || 'None'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#8E987E] block">Size / Arrangement:</span>
                      <span className="font-medium text-[#321923]">{req.size}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#8E987E] block">Crafting Time:</span>
                      <span className="font-medium text-[#78816A]">~{req.estimatedCraftDays} days</span>
                    </div>
                  </div>

                  {req.customNotes && (
                    <p className="text-[11px] text-[#6B5B54] bg-[#FAF6F0] p-2 rounded-lg italic">
                      "{req.customNotes}"
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Wishlist */}
        {currentTab === 'wishlist' && (
          <div>
            {wishlistedProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 border border-[#E6D7CD] text-center">
                <Heart className="w-10 h-10 text-[#D99AA3] mx-auto mb-2" />
                <p className="text-xs text-[#6B5B54]">Your wishlist is currently empty.</p>
                <Link
                  to="/shop"
                  className="mt-3 inline-block px-4 py-2 rounded-full bg-[#6E3947] text-white text-xs font-medium"
                >
                  Discover Creations
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {wishlistedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Addresses */}
        {currentTab === 'addresses' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user.addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="bg-white rounded-2xl p-5 border border-[#E6D7CD] shadow-xs space-y-2 text-xs text-[#6B5B54]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#321923]">{addr.fullName}</span>
                    {addr.isDefault && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#78816A] text-white">
                        Default Destination
                      </span>
                    )}
                  </div>
                  <p>{addr.street}</p>
                  <p>
                    {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                  <p className="text-[#321923] font-medium">Contact: {addr.phone}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Staff Administration Gateway (clearly separated from customer operations) */}
        {!isAdminAuthenticated && (
          <div className="pt-8 border-t border-[#E6D7CD]/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8E987E]">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#6E3947]" />
              <span>Are you an atelier team member or store manager?</span>
            </div>
            <Link
              to="/admin/login"
              className="text-xs font-semibold text-[#6E3947] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Switch to Atelier Admin Portal</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
