import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, ShieldCheck, CheckCircle2, AlertCircle, MessageCircle, Sparkles, MapPin, Phone, Mail, User } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getWhatsAppLink } from '../config/businessConfig';

export const CheckoutPage: React.FC = () => {
  const { cart, subtotal, clearCart } = useCart();
  const { user, addOrder } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    fullName: user?.addresses[0]?.fullName || user?.name || '',
    email: user?.email || '',
    phone: user?.addresses[0]?.phone || '',
    street: user?.addresses[0]?.street || '',
    city: user?.addresses[0]?.city || '',
    state: user?.addresses[0]?.state || 'Karnataka',
    pincode: user?.addresses[0]?.pincode || '',
    orderNotes: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = 'Please enter your full name';
    if (!formData.phone.trim() || formData.phone.trim().length < 10) errors.phone = 'Valid 10-digit mobile number required';
    if (!formData.email.trim() || !formData.email.includes('@')) errors.email = 'Valid email required for order notifications';
    if (!formData.street.trim()) errors.street = 'Street address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.pincode.trim() || formData.pincode.trim().length < 6) errors.pincode = 'Valid 6-digit postal pincode required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const orderItems = cart.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        color: item.color,
        size: item.size,
        image: item.image,
      }));

      const newOrderId = addOrder({
        status: 'Draft Request',
        items: orderItems,
        subtotal,
        customerNotes: formData.orderNotes,
        isDraft: true, // indicates payment gateway deferred
        shippingAddress: {
          id: `addr-${Date.now()}`,
          fullName: formData.fullName,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          phone: formData.phone,
          isDefault: true,
        },
      });

      clearCart();
      setIsSubmitting(false);
      setConfirmedOrderId(newOrderId);

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6E3947', '#D99AA3', '#F0C9CB', '#78816A'],
      });
    }, 700);
  };

  const whatsappInquiry = confirmedOrderId
    ? getWhatsAppLink(
        `Hello Deepu Creations! I have submitted an order request draft (${confirmedOrderId}) for ₹${subtotal.toLocaleString()}. Looking forward to confirming details with you!`
      )
    : null;

  if (confirmedOrderId) {
    return (
      <div className="min-h-screen bg-[#F6F0E7] bg-crochet-pattern py-12 px-4 sm:px-6 lg:px-8 pb-24 md:pb-12">
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-[#D99AA3] shadow-xl text-center">
          <div className="w-16 h-16 rounded-full bg-[#F0C9CB]/40 text-[#6E3947] flex items-center justify-center mx-auto mb-4 border border-[#D99AA3]">
            <CheckCircle2 className="w-10 h-10 text-[#6E3947]" />
          </div>

          <span className="font-mono text-xs text-[#8E987E] uppercase tracking-wider">
            Order Reference: {confirmedOrderId}
          </span>
          <h1 className="font-serif text-3xl font-semibold text-[#321923] mt-1 mb-2">
            Order Request Draft Registered
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5B54] mb-6">
            Thank you, <strong>{formData.fullName}</strong>! Your order request has been logged in our studio queue. We will review your items and reach out via WhatsApp/email with final dispatch timings.
          </p>

          <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E6D7CD] text-left text-xs space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-[#8E987E]">Order Status:</span>
              <span className="font-semibold text-[#6E3947] bg-[#F0C9CB]/40 px-2 py-0.5 rounded">
                Draft Request (Payment Gateway Deferred)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8E987E]">Total Value:</span>
              <span className="font-semibold text-[#321923]">₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8E987E]">Shipping Address:</span>
              <span className="font-medium text-[#321923] text-right">
                {formData.street}, {formData.city}, {formData.pincode}
              </span>
            </div>
          </div>

          {whatsappInquiry && (
            <div className="mb-4">
              <a
                href={whatsappInquiry.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-3 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md ${
                  whatsappInquiry.isReady
                    ? 'bg-[#25D366] text-white hover:bg-[#1EBE5D]'
                    : 'bg-[#FAF6F0] text-[#78816A] border border-[#D99AA3]/40'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>
                  {whatsappInquiry.isReady
                    ? 'Message Maker on WhatsApp to Expedite Order'
                    : 'WhatsApp: [WHATSAPP_NUMBER]'}
                </span>
              </a>
            </div>
          )}

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => navigate('/shop')}
              className="px-5 py-2.5 rounded-full border border-[#D99AA3] text-[#6E3947] text-xs font-medium hover:bg-[#FAF6F0]"
            >
              Continue Browsing
            </button>
            <button
              onClick={() => navigate('/account')}
              className="px-5 py-2.5 rounded-full bg-[#6E3947] text-white text-xs font-medium hover:bg-[#522734] shadow-sm"
            >
              View in My Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#F6F0E7] bg-crochet-pattern py-16 px-4 text-center">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-[#E6D7CD] shadow-sm">
          <ShoppingBag className="w-12 h-12 text-[#D99AA3] mx-auto mb-3" />
          <h2 className="font-serif text-2xl font-semibold text-[#321923] mb-2">
            Your cart is currently empty
          </h2>
          <p className="text-xs text-[#6B5B54] mb-6">
            Please add handcrafted blooms or accessories before proceeding to checkout.
          </p>
          <Link
            to="/shop"
            className="px-6 py-3 rounded-full bg-[#6E3947] text-white text-xs font-semibold hover:bg-[#522734] shadow-md inline-block"
          >
            Explore Creations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F0E7] bg-crochet-pattern py-8 sm:py-12 px-4 sm:px-6 lg:px-8 pb-24 md:pb-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6E3947] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Shopping</span>
          </button>
        </div>

        <div className="text-center max-w-xl mx-auto mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl text-[#321923] font-semibold">
            Order Request & Review
          </h1>
          <p className="text-xs text-[#6B5B54] mt-1.5">
            Please provide your delivery destination and contact details.
          </p>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Customer Information Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#E6D7CD] shadow-sm space-y-6">
            <h2 className="font-serif text-xl font-semibold text-[#321923] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#6E3947]" />
              <span>Shipping Information</span>
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-[#321923] block mb-1">Full Name *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Priya Sharma"
                  className={`w-full p-2.5 rounded-xl border ${
                    formErrors.fullName ? 'border-[#991B1B] bg-red-50/50' : 'border-[#E6D7CD]'
                  } focus:ring-2 focus:ring-[#6E3947]/30 focus:outline-none`}
                />
                {formErrors.fullName && <p className="text-[#991B1B] text-[11px] mt-1">{formErrors.fullName}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#321923] block mb-1">Phone Number (WhatsApp) *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 9876543210"
                    className={`w-full p-2.5 rounded-xl border ${
                      formErrors.phone ? 'border-[#991B1B] bg-red-50/50' : 'border-[#E6D7CD]'
                    } focus:ring-2 focus:ring-[#6E3947]/30 focus:outline-none`}
                  />
                  {formErrors.phone && <p className="text-[#991B1B] text-[11px] mt-1">{formErrors.phone}</p>}
                </div>

                <div>
                  <label className="font-semibold text-[#321923] block mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. priya@example.com"
                    className={`w-full p-2.5 rounded-xl border ${
                      formErrors.email ? 'border-[#991B1B] bg-red-50/50' : 'border-[#E6D7CD]'
                    } focus:ring-2 focus:ring-[#6E3947]/30 focus:outline-none`}
                  />
                  {formErrors.email && <p className="text-[#991B1B] text-[11px] mt-1">{formErrors.email}</p>}
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#321923] block mb-1">Street Address / House No. *</label>
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  placeholder="e.g. Apartment 4B, Gulmohar Enclave, Indiranagar"
                  className={`w-full p-2.5 rounded-xl border ${
                    formErrors.street ? 'border-[#991B1B] bg-red-50/50' : 'border-[#E6D7CD]'
                  } focus:ring-2 focus:ring-[#6E3947]/30 focus:outline-none`}
                />
                {formErrors.street && <p className="text-[#991B1B] text-[11px] mt-1">{formErrors.street}</p>}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-[#321923] block mb-1">City *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Bengaluru"
                    className={`w-full p-2.5 rounded-xl border ${
                      formErrors.city ? 'border-[#991B1B] bg-red-50/50' : 'border-[#E6D7CD]'
                    } focus:ring-2 focus:ring-[#6E3947]/30 focus:outline-none`}
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#321923] block mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="State"
                    className="w-full p-2.5 rounded-xl border border-[#E6D7CD] focus:ring-2 focus:ring-[#6E3947]/30 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#321923] block mb-1">Pincode *</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder="e.g. 560038"
                    className={`w-full p-2.5 rounded-xl border ${
                      formErrors.pincode ? 'border-[#991B1B] bg-red-50/50' : 'border-[#E6D7CD]'
                    } focus:ring-2 focus:ring-[#6E3947]/30 focus:outline-none`}
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#321923] block mb-1">
                  Artisan Notes / Gift Tag Message:
                </label>
                <textarea
                  rows={2}
                  value={formData.orderNotes}
                  onChange={(e) => setFormData({ ...formData, orderNotes: e.target.value })}
                  placeholder="e.g. Please wrap in ivory tissue paper with a note for Maya..."
                  className="w-full p-2.5 rounded-xl border border-[#E6D7CD] focus:ring-2 focus:ring-[#6E3947]/30 focus:outline-none"
                />
              </div>
            </div>

            {/* Explicit Payment Gateway Integration Boundary */}
            <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#D99AA3]/40 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#6E3947]">
                <ShieldCheck className="w-4 h-4 text-[#D99AA3]" />
                <span>Payment Gateway Integration Boundary</span>
              </div>
              <p className="text-[11px] text-[#6B5B54] leading-relaxed">
                Online payment gateway integration (Razorpay / UPI payment capture) is explicitly deferred for this phase according to project specifications. Submitting will register your order request draft with the Deepu Creations atelier. Our team will verify yarn stock and reach out with payment instructions.
              </p>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#E6D7CD] shadow-sm space-y-5 sticky top-24">
            <h2 className="font-serif text-xl font-semibold text-[#321923] pb-3 border-b border-[#E6D7CD]">
              Selected Pieces ({cart.length})
            </h2>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 text-xs">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-lg object-cover bg-[#F6F0E7] flex-shrink-0"
                  />
                  <div className="flex-1">
                    <p className="font-serif font-semibold text-[#321923] line-clamp-1">{item.name}</p>
                    <p className="text-[11px] text-[#8E987E]">
                      {item.color} • {item.size || 'Standard'} • Qty: {item.quantity}
                    </p>
                    <p className="font-semibold text-[#6E3947] mt-0.5">
                      {item.currencySymbol}
                      {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#E6D7CD] space-y-2 text-xs text-[#6B5B54]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#321923]">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-[#78816A] italic">Calculated upon confirmation</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-[#321923] pt-2 border-t border-[#E6D7CD]">
                <span>Total Draft Value</span>
                <span className="text-[#6E3947]">₹{subtotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-full bg-[#6E3947] hover:bg-[#522734] text-white font-medium text-xs sm:text-sm tracking-wide shadow-lg shadow-[#6E3947]/30 transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Registering Order Draft...</span>
              ) : (
                <>
                  <span>Submit Order Request Draft</span>
                  <Sparkles className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
