import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Sparkles, HelpCircle } from 'lucide-react';
import { businessConfig } from '../config/businessConfig';

export const PoliciesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F6F0E7] bg-crochet-pattern py-8 sm:py-14 px-4 sm:px-6 lg:px-8 pb-24 md:pb-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-[11px] uppercase tracking-widest font-semibold text-[#6E3947] bg-[#F0C9CB]/40 px-3 py-1 rounded-full border border-[#D99AA3]/30">
            Customer Care & Terms
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#321923] font-semibold tracking-tight mt-2">
            Studio Policies & FAQ
          </h1>
          <p className="text-xs text-[#6B5B54] mt-1.5">
            Clear, transparent guidelines for handcrafted creations and bespoke orders.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E6D7CD] shadow-sm space-y-8 text-xs sm:text-sm text-[#6B5B54]">
          {/* Section 1: FAQs */}
          <div id="faq" className="space-y-4">
            <h2 className="font-serif text-xl font-semibold text-[#321923] flex items-center gap-2 pb-2 border-b border-[#F6F0E7]">
              <HelpCircle className="w-5 h-5 text-[#6E3947]" />
              <span>Frequently Asked Questions</span>
            </h2>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[#FAF6F0] border border-[#E6D7CD]">
                <h3 className="font-semibold text-[#321923] mb-1">
                  How long do custom crochet orders take?
                </h3>
                <p>
                  Most bouquets and plushies take 3 to 7 crafting days before shipping, as each stitch is made entirely by hand. During festive or wedding seasons, please allow up to 10 days.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF6F0] border border-[#E6D7CD]">
                <h3 className="font-semibold text-[#321923] mb-1">
                  Do the crochet flowers fade or lose shape?
                </h3>
                <p>
                  We use premium high-twist combed cotton and reinforced inner floral wire cores so your tulips and roses retain their crisp, natural posture indefinitely.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF6F0] border border-[#E6D7CD]">
                <h3 className="font-semibold text-[#321923] mb-1">
                  How does payment work?
                </h3>
                <p>
                  In this version, online automated payment capture is deferred. Placing an order registers an order request draft with our atelier. We will review your selections and contact you via WhatsApp to finalize your delivery date and payment method.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Shipping */}
          <div id="shipping" className="space-y-3 pt-4 border-t border-[#F6F0E7]">
            <h2 className="font-serif text-xl font-semibold text-[#321923] flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#6E3947]" />
              <span>Shipping & Delivery Policy</span>
            </h2>
            <p className="leading-relaxed">
              {businessConfig.policies.shippingPolicy}
            </p>
            <p className="leading-relaxed">
              Each piece is protected with breathable cotton dust wrappers and corrugated crush-resistant outer shipping boxes to safeguard delicate petals and limbs during transit.
            </p>
          </div>

          {/* Section 3: Returns */}
          <div id="returns" className="space-y-3 pt-4 border-t border-[#F6F0E7]">
            <h2 className="font-serif text-xl font-semibold text-[#321923] flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-[#6E3947]" />
              <span>Artisanal Returns & Replacements</span>
            </h2>
            <p className="leading-relaxed">
              {businessConfig.policies.returnPolicy}
            </p>
          </div>

          {/* Section 4: Custom Terms */}
          <div id="custom-terms" className="space-y-3 pt-4 border-t border-[#F6F0E7]">
            <h2 className="font-serif text-xl font-semibold text-[#321923] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#6E3947]" />
              <span>Custom Order Terms</span>
            </h2>
            <p className="leading-relaxed">
              {businessConfig.policies.customOrderTerms}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
