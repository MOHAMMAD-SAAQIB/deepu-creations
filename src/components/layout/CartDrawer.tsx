import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
  } = useCart();
  const navigate = useNavigate();

  if (!isCartDrawerOpen) return null;

  const handleCheckoutClick = () => {
    setIsCartDrawerOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartDrawerOpen(false)}
        className="absolute inset-0 bg-[#321923]/50 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF6F0] shadow-2xl flex flex-col border-l border-[#E6D7CD]">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#E6D7CD] flex items-center justify-between bg-[#F6F0E7]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#6E3947]" />
              <h2 className="font-serif text-xl text-[#321923] font-semibold">Your Keepsake Cart</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#F0C9CB] text-[#6E3947] font-medium">
                {cart.length} {cart.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 rounded-full hover:bg-[#E6D7CD]/60 text-[#392923] transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#6B5B54]">
                <div className="w-16 h-16 rounded-full bg-[#F0C9CB]/30 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 text-[#D99AA3]" />
                </div>
                <h3 className="font-serif text-lg text-[#321923] font-medium mb-1">Your cart is empty</h3>
                <p className="text-xs text-[#8E987E] max-w-xs mb-6">
                  Explore our handcrafted blooms, cozy plushies, or begin a personalized crochet commission.
                </p>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigate('/shop');
                  }}
                  className="px-5 py-2.5 rounded-full bg-[#6E3947] text-white text-xs font-semibold hover:bg-[#522734] transition-all shadow-md"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-xs text-[#6B5B54] pb-1">
                  <span>Selected Pieces</span>
                  <button
                    onClick={clearCart}
                    className="text-[#6E3947] hover:underline hover:text-[#522734]"
                  >
                    Clear All
                  </button>
                </div>

                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-white border border-[#E6D7CD] shadow-xs flex gap-3.5"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover bg-[#F6F0E7] flex-shrink-0"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-serif text-sm font-semibold text-[#321923] leading-snug line-clamp-1">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-[#8E987E] hover:text-[#991B1B] p-1 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-[#6B5B54]">
                          {item.color && (
                            <span className="inline-flex items-center gap-1 bg-[#FAF6F0] px-2 py-0.5 rounded border border-[#E6D7CD]">
                              {item.colorHex && (
                                <span
                                  className="w-2 h-2 rounded-full border border-black/10"
                                  style={{ backgroundColor: item.colorHex }}
                                />
                              )}
                              {item.color}
                            </span>
                          )}
                          {item.size && (
                            <span className="bg-[#FAF6F0] px-2 py-0.5 rounded border border-[#E6D7CD]">
                              {item.size}
                            </span>
                          )}
                        </div>

                        {item.customNote && (
                          <p className="text-[10px] text-[#6E3947] bg-[#F0C9CB]/20 px-2 py-0.5 rounded mt-1.5 italic line-clamp-1">
                            Note: "{item.customNote}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F6F0E7]">
                        <div className="flex items-center border border-[#D99AA3]/40 rounded-lg overflow-hidden bg-[#FAF6F0]">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 text-[#6E3947] hover:bg-[#F0C9CB]/40 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 py-0.5 text-xs font-semibold text-[#321923] min-w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 text-[#6E3947] hover:bg-[#F0C9CB]/40 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-semibold text-[#321923]">
                            {item.currencySymbol}
                            {(item.price * item.quantity).toLocaleString()}
                          </span>
                          {item.isPricePlaceholder && (
                            <span className="block text-[9px] text-[#8E987E] font-mono">demo</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Footer & Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#E6D7CD] bg-[#F6F0E7] space-y-3">
              <div className="space-y-1.5 text-xs text-[#6B5B54]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#321923]">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="text-[#78816A] italic">Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-[#321923] pt-2 border-t border-[#E6D7CD]">
                  <span>Total (Draft)</span>
                  <span className="text-[#6E3947]">₹{subtotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Notice regarding payment integration boundary */}
              <div className="p-2.5 rounded-lg bg-[#FAF6F0] border border-[#D99AA3]/30 text-[11px] text-[#6E3947] flex items-start gap-1.5">
                <Sparkles className="w-4 h-4 text-[#D99AA3] flex-shrink-0 mt-0.5" />
                <span>
                  Payment gateway integration is deferred in this version. Proceeding will record an order request draft with your details.
                </span>
              </div>

              <button
                onClick={handleCheckoutClick}
                className="w-full py-3 px-4 rounded-full bg-[#6E3947] hover:bg-[#522734] text-white font-medium text-xs sm:text-sm tracking-wide shadow-lg shadow-[#6E3947]/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
