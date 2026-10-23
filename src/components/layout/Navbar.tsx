import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Menu, X, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useIntro } from '../../context/IntroContext';
import { businessConfig } from '../../config/businessConfig';

export const Navbar: React.FC = () => {
  const { itemCount, setIsCartDrawerOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { user } = useAuth();
  const { restartIntro } = useIntro();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  // Top-level destinations only (Categories belong inside the Shop page)
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Custom Orders', path: '/custom-orders', highlight: true },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#F6F0E7]/95 backdrop-blur-md border-b border-[#E6D7CD] transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-[#321923] text-[#F0C9CB] text-xs py-1.5 px-4 text-center font-sans tracking-wider flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#D99AA3] animate-pulse" />
        <span className="font-medium text-[11px] sm:text-xs">
          Artisanal Heirloom Pieces Handcrafted with Love • Custom Inquiries Open
        </span>
        <Sparkles className="w-3.5 h-3.5 text-[#D99AA3] animate-pulse hidden sm:inline" />
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Mobile menu trigger */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 rounded-lg text-[#392923] hover:text-[#6E3947] focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo: Clicking restarts 3D intro as requested in Priority 2 */}
          <div className="flex-1 md:flex-initial flex items-center justify-center md:justify-start">
            <button
              onClick={restartIntro}
              className="flex flex-col items-center md:items-start group text-left cursor-pointer focus:outline-none"
              aria-label={`${businessConfig.brandName} - Replay 3D Intro & Return Home`}
              title="Click to replay 3D introduction"
            >
              <span className="font-serif text-2xl sm:text-3xl text-[#321923] font-semibold tracking-tight group-hover:text-[#6E3947] transition-colors">
                {businessConfig.brandName}
              </span>
              <span className="font-script text-xs sm:text-sm text-[#D99AA3] -mt-1 group-hover:text-[#6E3947] transition-colors">
                Handmade with Love ♡
              </span>
            </button>
          </div>

          {/* Desktop Top-Level Navigation Links */}
          <nav className="hidden md:flex items-center space-x-7" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path && !link.path.includes('#');
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors relative py-1 ${
                    isActive ? 'text-[#6E3947] font-semibold' : 'text-[#392923] hover:text-[#6E3947]'
                  } ${
                    link.highlight
                      ? 'text-[#6E3947] flex items-center gap-1.5 bg-[#F0C9CB]/40 px-3.5 py-1 rounded-full border border-[#D99AA3]/30'
                      : ''
                  }`}
                >
                  {link.highlight && <Sparkles className="w-3.5 h-3.5 text-[#6E3947]" />}
                  <span>{link.name}</span>
                  {isActive && !link.highlight && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6E3947] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Header Actions: Search, Wishlist, Account, Cart */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-full text-[#392923] hover:text-[#6E3947] hover:bg-[#F0C9CB]/30 transition-colors cursor-pointer"
              aria-label="Search Catalog"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Icon */}
            <Link
              to="/account?tab=wishlist"
              className="p-2 rounded-full text-[#392923] hover:text-[#6E3947] hover:bg-[#F0C9CB]/30 transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#6E3947] text-[#FAF6F0] rounded-full text-[10px] font-bold flex items-center justify-center animate-scale">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Customer Account */}
            <Link
              to="/account"
              className="p-2 rounded-full text-[#392923] hover:text-[#6E3947] hover:bg-[#F0C9CB]/30 transition-colors hidden sm:flex items-center"
              aria-label="My Account"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-6 h-6 rounded-full object-cover border border-[#D99AA3]"
                />
              ) : (
                <User className="w-5 h-5" />
              )}
            </Link>

            {/* Shopping Cart Trigger */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="p-2 rounded-full text-[#392923] hover:text-[#6E3947] hover:bg-[#F0C9CB]/30 transition-colors relative flex items-center cursor-pointer"
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#6E3947] text-[#FAF6F0] rounded-full text-[10px] font-bold flex items-center justify-center shadow-sm">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Collapsible Search Bar */}
        {isSearchOpen && (
          <div className="py-3 border-t border-[#E6D7CD]/70 animate-fadeIn">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-[#78816A]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tulip bouquets, plushies, bag charms..."
                className="w-full pl-10 pr-24 py-2.5 rounded-full bg-white/80 border border-[#D99AA3]/40 focus:outline-none focus:ring-2 focus:ring-[#6E3947]/30 text-sm placeholder:text-[#8E987E]"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-1.5 px-4 py-1.5 rounded-full bg-[#6E3947] text-white text-xs font-medium hover:bg-[#522734] transition-colors cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F6F0E7] border-b border-[#E6D7CD] px-4 pt-3 pb-6 space-y-3 animate-slideDown shadow-xl">
          <form onSubmit={handleSearchSubmit} className="relative mb-4">
            <Search className="absolute left-3 w-4 h-4 text-[#78816A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-white border border-[#D99AA3]/40 text-sm"
            />
          </form>

          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between ${
                  location.pathname === link.path && !link.path.includes('#')
                    ? 'bg-[#F0C9CB]/40 text-[#6E3947] font-semibold'
                    : 'text-[#392923] hover:bg-white/60'
                }`}
              >
                <span>{link.name}</span>
                {link.highlight && <Sparkles className="w-4 h-4 text-[#6E3947]" />}
              </Link>
            ))}

            <Link
              to="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-medium text-[#392923] hover:bg-white/60 flex items-center gap-2"
            >
              <User className="w-4 h-4 text-[#6E3947]" />
              <span>Customer Account</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
