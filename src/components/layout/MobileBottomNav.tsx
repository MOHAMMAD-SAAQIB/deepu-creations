import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ShoppingBag, Sparkles, ShoppingCart, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const MobileBottomNav: React.FC = () => {
  const { itemCount, setIsCartDrawerOpen } = useCart();

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Shop', path: '/shop', icon: ShoppingBag },
    { label: 'Custom', path: '/custom-orders', icon: Sparkles, highlight: true },
    { label: 'Cart', path: '#cart', icon: ShoppingCart, isCartTrigger: true },
    { label: 'Account', path: '/account', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF6F0]/95 backdrop-blur-lg border-t border-[#E6D7CD] pb-[calc(env(safe-area-inset-bottom,8px)+6px)] pt-2 px-3 shadow-[0_-4px_16px_rgba(50,25,35,0.06)]">
      <nav className="flex items-center justify-around">
        {navItems.map((item) => {
          if (item.isCartTrigger) {
            return (
              <button
                key={item.label}
                onClick={() => setIsCartDrawerOpen(true)}
                className="flex flex-col items-center justify-center flex-1 py-1 text-[#392923] relative group active:scale-95 transition-transform"
                aria-label="Open Cart"
              >
                <div className="relative">
                  <item.icon className="w-5 h-5 text-[#392923] group-hover:text-[#6E3947]" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-[#6E3947] text-[#FAF6F0] rounded-full text-[9px] font-bold px-1.5 py-0.2 min-w-4 text-center leading-tight">
                      {itemCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium tracking-tight mt-1 text-[#6B5B54]">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 py-1 relative transition-all active:scale-95 ${
                  isActive ? 'text-[#6E3947] font-semibold' : 'text-[#6B5B54] hover:text-[#392923]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`relative p-1 rounded-full transition-colors ${
                      item.highlight
                        ? 'bg-[#F0C9CB]/40 text-[#6E3947]'
                        : isActive
                        ? 'bg-[#F0C9CB]/30 text-[#6E3947]'
                        : ''
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${item.highlight ? 'text-[#6E3947]' : ''}`} />
                    {isActive && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#6E3947] rounded-full" />
                    )}
                  </div>
                  <span className={`text-[10px] tracking-tight mt-0.5 ${isActive ? 'font-semibold text-[#6E3947]' : 'font-medium'}`}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};
