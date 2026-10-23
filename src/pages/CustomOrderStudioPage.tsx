import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ArrowLeft, Check, CheckCircle2, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CustomStudioPreview } from '../components/custom/CustomStudioPreview';
import { CustomProductType } from '../components/custom/CustomStudio3DCanvas';
import { useAuth } from '../context/AuthContext';
import { getWhatsAppLink } from '../config/businessConfig';

interface ColorOption {
  name: string;
  hex: string;
}

const PRIMARY_COLORS: ColorOption[] = [
  { name: 'Cream Ivory', hex: '#F6F0E7' },
  { name: 'Blush Pink', hex: '#F0C9CB' },
  { name: 'Dusty Rose', hex: '#D99AA3' },
  { name: 'Deep Burgundy', hex: '#6E3947' },
  { name: 'Golden Marigold', hex: '#EAB308' },
  { name: 'Warm Peach', hex: '#F2D2BE' },
  { name: 'Muted Sage', hex: '#78816A' },
  { name: 'Lavender Mist', hex: '#C4B5FD' },
];

const ACCENT_COLORS: ColorOption[] = [
  { name: 'Deep Burgundy', hex: '#6E3947' },
  { name: 'Blush Pink', hex: '#F0C9CB' },
  { name: 'Gold Ochre', hex: '#D97706' },
  { name: 'Forest Olive', hex: '#4D583F' },
  { name: 'Soft Cream', hex: '#FAF6F0' },
  { name: 'Espresso Cocoa', hex: '#392923' },
];

interface ProductMetaItem {
  id: CustomProductType;
  title: string;
  categoryTag: string;
  img: string;
  basePrice: number;
  sizes: string[];
  craftDays: number;
  primaryLabel: string;
  accentLabel: string;
  monogramNote: string;
}

const PRODUCT_CATALOG: Record<CustomProductType, ProductMetaItem> = {
  bunny: {
    id: 'bunny',
    title: 'Heirloom Crochet Bunny',
    categoryTag: 'Plushie',
    img: '/images/bunny_plush.jpg',
    basePrice: 1899,
    sizes: ['Petite (18 cm)', 'Classic (26 cm)', 'Jumbo (36 cm)'],
    craftDays: 5,
    primaryLabel: 'Bunny Body Yarn Shade',
    accentLabel: 'Knitted Bowtie Shade',
    monogramNote: 'Hand-stitched onto circular keepsake tag',
  },
  tulip: {
    id: 'tulip',
    title: 'Artisan Tulip Bouquet',
    categoryTag: 'Bouquet',
    img: '/images/tulip_bouquet.jpg',
    basePrice: 1499,
    sizes: ['Petite (3 Stems)', 'Classic (7 Stems)', 'Luxe (12 Stems)'],
    craftDays: 4,
    primaryLabel: 'Tulip Bloom Yarn Shade',
    accentLabel: 'Bouquet Sleeve Ribbon',
    monogramNote: 'Letter engraved onto ribbon wooden charm tag',
  },
  rose: {
    id: 'rose',
    title: 'Burgundy Velvet Rose Bouquet',
    categoryTag: 'Bouquet',
    img: '/images/rose_bouquet.jpg',
    basePrice: 1999,
    sizes: ['Trio (3 Roses)', 'Half Dozen (6 Roses)', 'Full Dozen (12 Roses)'],
    craftDays: 4,
    primaryLabel: 'Rose Petal Yarn Shade',
    accentLabel: 'Ribbon & Foliage Accent',
    monogramNote: 'Letter engraved onto wrap ribbon charm',
  },
  sunflower: {
    id: 'sunflower',
    title: 'Radiant Sunflower Cluster',
    categoryTag: 'Bouquet',
    img: '/images/sunflower_bouquet.jpg',
    basePrice: 1699,
    sizes: ['Single Statement (1 Stem)', 'Boutique Trio (3 Stems)', 'Meadow Bunch (5 Stems)'],
    craftDays: 3,
    primaryLabel: 'Sunflower Petal Shade',
    accentLabel: 'Stem Ribbon Accent',
    monogramNote: 'Letter attached onto ribbon charm tag',
  },
  tote: {
    id: 'tote',
    title: 'Diamond Weave Crochet Tote',
    categoryTag: 'Artisan Bag',
    img: '/images/tote_bag.jpg',
    basePrice: 2499,
    sizes: ['Medium Day Tote (32 × 28 cm)', 'Large Weekend Bag (40 × 34 cm)'],
    craftDays: 6,
    primaryLabel: 'Tote Weave Cord Color',
    accentLabel: 'Handles & Trim Accent',
    monogramNote: 'Letter embossed onto leather handle fob',
  },
  heart: {
    id: 'heart',
    title: 'Puffy Heart Bag Charm',
    categoryTag: 'Accessory',
    img: '/images/heart_keychain.jpg',
    basePrice: 499,
    sizes: ['Standard (7 cm)'],
    craftDays: 2,
    primaryLabel: 'Heart Body Shade',
    accentLabel: 'Hanging Tassel Accent',
    monogramNote: 'Embroidered onto center of puffy heart',
  },
};

export const CustomOrderStudioPage: React.FC = () => {
  const { addCustomRequest } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Determine initial product type from search params or default to 'bunny'
  const initialTypeFromUrl = (): CustomProductType => {
    const pParam = searchParams.get('product') || searchParams.get('type');
    if (pParam) {
      if (pParam.includes('tote')) return 'tote';
      if (pParam.includes('tulip')) return 'tulip';
      if (pParam.includes('rose')) return 'rose';
      if (pParam.includes('sunflower')) return 'sunflower';
      if (pParam.includes('heart')) return 'heart';
      if (pParam.includes('bunny')) return 'bunny';
    }
    return 'bunny';
  };

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [productType, setProductTypeState] = useState<CustomProductType>(initialTypeFromUrl);
  const [primaryColor, setPrimaryColor] = useState<ColorOption>(PRIMARY_COLORS[1]); // Blush Pink
  const [accentColor, setAccentColor] = useState<ColorOption>(ACCENT_COLORS[0]); // Deep Burgundy
  const [sizeIndex, setSizeIndex] = useState(0);
  const [customInitial, setCustomInitial] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequestId, setSubmittedRequestId] = useState<string | null>(null);

  // Sync state if URL search params change externally
  useEffect(() => {
    const targetType = initialTypeFromUrl();
    if (targetType !== productType) {
      setProductTypeState(targetType);
      setSizeIndex(0);
    }
  }, [searchParams]);

  const currentMeta = PRODUCT_CATALOG[productType] || PRODUCT_CATALOG.bunny;

  // Safe product selection that preserves/clamps size index and applies suitable default palette
  const handleSelectProduct = (newType: CustomProductType) => {
    if (newType === productType) return;
    setProductTypeState(newType);

    // Apply signature palette default for newly selected silhouette
    if (newType === 'sunflower') {
      setPrimaryColor(PRIMARY_COLORS.find(c => c.name.includes('Marigold')) || PRIMARY_COLORS[4]);
      setAccentColor(ACCENT_COLORS.find(c => c.name.includes('Cocoa')) || ACCENT_COLORS[5]);
    } else if (newType === 'rose') {
      setPrimaryColor(PRIMARY_COLORS.find(c => c.name.includes('Burgundy')) || PRIMARY_COLORS[3]);
      setAccentColor(ACCENT_COLORS.find(c => c.name.includes('Cream')) || ACCENT_COLORS[4]);
    } else if (newType === 'tote') {
      setPrimaryColor(PRIMARY_COLORS.find(c => c.name.includes('Dusty Rose')) || PRIMARY_COLORS[2]);
      setAccentColor(ACCENT_COLORS.find(c => c.name.includes('Soft Cream')) || ACCENT_COLORS[4]);
    } else if (newType === 'bunny') {
      setPrimaryColor(PRIMARY_COLORS[0]); // Cream Ivory
      setAccentColor(ACCENT_COLORS[0]); // Deep Burgundy
    } else {
      setPrimaryColor(PRIMARY_COLORS[1]); // Blush Pink
      setAccentColor(ACCENT_COLORS[0]); // Deep Burgundy
    }

    // Clamp or reset size index to prevent out-of-bounds errors
    const targetSizes = PRODUCT_CATALOG[newType].sizes;
    if (sizeIndex >= targetSizes.length) {
      setSizeIndex(0);
    }

    // Update query params cleanly
    setSearchParams({ type: newType });
  };

  const currentSizeLabel = currentMeta.sizes[sizeIndex] || currentMeta.sizes[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newId = addCustomRequest({
        productType: currentMeta.title,
        primaryColor: primaryColor.name,
        primaryColorHex: primaryColor.hex,
        accentColor: accentColor.name,
        accentColorHex: accentColor.hex,
        size: currentSizeLabel,
        customNotes: `For: ${recipientName || 'Self'}. Initial: ${customInitial || 'None'}. Notes: ${customNotes || 'None'}`,
      });

      setIsSubmitting(false);
      setSubmittedRequestId(newId);

      // Trigger celebratory confetti
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D99AA3', '#F0C9CB', '#6E3947', '#F2D2BE', '#EAB308'],
      });
    }, 500);
  };

  const whatsappInquiry = submittedRequestId
    ? getWhatsAppLink(
        `Hello Deepu Creations! I have submitted a bespoke custom request (${submittedRequestId}):\n- Item: ${currentMeta.title}\n- Primary Color: ${primaryColor.name}\n- Accent Color: ${accentColor.name}\n- Initial: ${customInitial || 'N/A'}\n- Size: ${currentSizeLabel}`
      )
    : null;

  return (
    <div className="min-h-screen bg-[#F6F0E7] bg-crochet-pattern py-8 sm:py-12 px-4 sm:px-6 lg:px-8 pb-24 md:pb-12">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F0C9CB]/40 text-[#6E3947] text-xs font-semibold uppercase tracking-wider mb-2 border border-[#D99AA3]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Bespoke Studio</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#321923] font-semibold tracking-tight">
            Design Your Custom Crochet Heirloom
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5B54] mt-2">
            Select your preferred silhouette, curated yarn shades, and monogram accents. Watch your exact piece come to life in our real-time 3D studio preview.
          </p>
        </div>

        {/* Stepper indicator */}
        {!submittedRequestId && (
          <div className="max-w-xl mx-auto mb-8">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#E6D7CD] -translate-y-1/2 z-0" />
              {[
                { num: 1, label: 'Silhouette' },
                { num: 2, label: 'Palette & Size' },
                { num: 3, label: 'Personalize' },
                { num: 4, label: 'Review' },
              ].map((s) => {
                const isPassed = step >= s.num;
                const isCurrent = step === s.num;
                return (
                  <div key={s.num} className="relative z-10 flex flex-col items-center">
                    <button
                      onClick={() => s.num < step && setStep(s.num as any)}
                      disabled={s.num > step}
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                        isCurrent
                          ? 'bg-[#6E3947] text-white ring-4 ring-[#F0C9CB]'
                          : isPassed
                          ? 'bg-[#D99AA3] text-white'
                          : 'bg-[#FAF6F0] text-[#8E987E] border border-[#E6D7CD]'
                      }`}
                    >
                      {isPassed && !isCurrent ? <Check className="w-4 h-4" /> : s.num}
                    </button>
                    <span
                      className={`text-[11px] font-medium mt-1.5 hidden sm:block ${
                        isCurrent ? 'text-[#6E3947] font-semibold' : 'text-[#8E987E]'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Main interactive grid: Left side Studio Preview, Right side Workflow Controls */}
        {submittedRequestId ? (
          /* Submission Success State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-[#D99AA3] shadow-xl text-center"
          >
            <div className="w-16 h-16 rounded-full bg-[#F0C9CB]/40 text-[#6E3947] flex items-center justify-center mx-auto mb-4 border border-[#D99AA3]">
              <CheckCircle2 className="w-10 h-10 text-[#6E3947]" />
            </div>

            <span className="font-mono text-xs text-[#8E987E] uppercase tracking-wider">
              Request Ref: {submittedRequestId}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#321923] mt-1 mb-2">
              Custom Request Confirmed!
            </h2>
            <p className="text-xs sm:text-sm text-[#6B5B54] mb-6">
              Our atelier has received your bespoke yarn specifications for the{' '}
              <strong>{currentMeta.title}</strong> in <strong>{primaryColor.name}</strong> and{' '}
              <strong>{accentColor.name}</strong>.
            </p>

            {/* Request Summary Card */}
            <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E6D7CD] text-left text-xs space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-[#8E987E]">Selected Size / Proportions:</span>
                <span className="font-semibold text-[#321923]">{currentSizeLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E987E]">Personal Monogram:</span>
                <span className="font-semibold text-[#321923]">{customInitial || 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E987E]">Estimated Crafting Duration:</span>
                <span className="font-semibold text-[#78816A]">~{currentMeta.craftDays} business days</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#E6D7CD]">
                <span className="text-[#8E987E]">Artisan Base Estimate:</span>
                <span className="font-semibold text-[#6E3947]">₹{currentMeta.basePrice.toLocaleString()} (catalog)</span>
              </div>
            </div>

            {/* Direct WhatsApp Follow-up */}
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
                  <MessageSquare className="w-4 h-4" />
                  <span>
                    {whatsappInquiry.isReady
                      ? 'Connect with Maker on WhatsApp with this Spec'
                      : 'WhatsApp Contact: [WHATSAPP_NUMBER]'}
                  </span>
                </a>
              </div>
            )}

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSubmittedRequestId(null);
                  setStep(1);
                }}
                className="px-5 py-2.5 rounded-full border border-[#D99AA3] text-[#6E3947] text-xs font-medium hover:bg-[#FAF6F0] transition-colors"
              >
                Design Another Piece
              </button>
              <button
                onClick={() => navigate('/account?tab=requests')}
                className="px-5 py-2.5 rounded-full bg-[#6E3947] text-white text-xs font-medium hover:bg-[#522734] transition-colors shadow-sm"
              >
                View in Account
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Studio Live Preview */}
            <div className="lg:col-span-5 sticky top-24">
              <CustomStudioPreview
                productType={productType}
                primaryColor={primaryColor}
                accentColor={accentColor}
                sizeLabel={currentSizeLabel}
                sizeIndex={sizeIndex}
                customInitial={customInitial}
                fallbackImage={currentMeta.img}
              />
              <div className="text-center mt-3">
                <span className="text-[11px] text-[#8E987E]">
                  Interactive 3D Artisanal Preview for <strong>{currentMeta.title}</strong> • Drag to inspect 360°
                </span>
              </div>
            </div>

            {/* Right: Step-by-Step Selection Panels */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-7 border border-[#E6D7CD] shadow-md">
              {/* Step 1: Silhouette selection */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-[#321923]">
                      Step 1: Choose Your Product Silhouette
                    </h3>
                    <p className="text-xs text-[#6B5B54] mt-1">
                      Select any of our signature handcrafted items to customize in 3D.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.values(PRODUCT_CATALOG).map((item) => {
                      const isSelected = productType === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelectProduct(item.id)}
                          className={`p-3 rounded-2xl border text-left flex flex-col items-center transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#6E3947] bg-[#FAF6F0] ring-2 ring-[#6E3947]/30 shadow-md'
                              : 'border-[#E6D7CD] hover:border-[#D99AA3] bg-white'
                          }`}
                        >
                          <img
                            src={item.img}
                            alt={item.title}
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover mb-2 bg-[#F6F0E7]"
                          />
                          <span className="text-[9px] uppercase font-bold text-[#6E3947] bg-[#F0C9CB]/40 px-2 py-0.5 rounded-full mb-1">
                            {item.categoryTag}
                          </span>
                          <h4 className="font-serif text-xs sm:text-sm font-semibold text-[#321923] text-center line-clamp-2">
                            {item.title}
                          </h4>
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-4 flex justify-end border-t border-[#F6F0E7]">
                    <button
                      onClick={() => setStep(2)}
                      className="px-6 py-3 rounded-full bg-[#6E3947] hover:bg-[#522734] text-white text-xs font-semibold flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
                    >
                      <span>Continue to Color &amp; Size</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Palette & Size selection */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-[#321923]">
                      Step 2: Curate Palette &amp; Proportions
                    </h3>
                    <p className="text-xs text-[#6B5B54] mt-1">
                      Customize <strong>{currentMeta.title}</strong> materials and scale.
                    </p>
                  </div>

                  {/* Primary Color Swatches */}
                  <div>
                    <label className="text-xs font-semibold text-[#321923] block mb-2 flex items-center justify-between">
                      <span>{currentMeta.primaryLabel}:</span>
                      <span className="text-[#6E3947] font-serif font-medium">{primaryColor.name}</span>
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                      {PRIMARY_COLORS.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setPrimaryColor(c)}
                          className={`p-1.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                            primaryColor.name === c.name
                              ? 'border-[#6E3947] bg-[#FAF6F0] ring-2 ring-[#6E3947]/30 shadow-xs'
                              : 'border-[#E6D7CD] hover:border-[#D99AA3]'
                          }`}
                        >
                          <span
                            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-black/15 shadow-inner"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span className="text-[9px] text-center text-[#392923] truncate w-full">
                            {c.name.split(' ')[0]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Accent Color Swatches */}
                  <div>
                    <label className="text-xs font-semibold text-[#321923] block mb-2 flex items-center justify-between">
                      <span>{currentMeta.accentLabel}:</span>
                      <span className="text-[#6E3947] font-serif font-medium">{accentColor.name}</span>
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {ACCENT_COLORS.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setAccentColor(c)}
                          className={`p-1.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                            accentColor.name === c.name
                              ? 'border-[#6E3947] bg-[#FAF6F0] ring-2 ring-[#6E3947]/30 shadow-xs'
                              : 'border-[#E6D7CD] hover:border-[#D99AA3]'
                          }`}
                        >
                          <span
                            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-black/15 shadow-inner"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span className="text-[9px] text-center text-[#392923] truncate w-full">
                            {c.name.split(' ')[0]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size Option with Real-Time 3D preview impact */}
                  <div>
                    <label className="text-xs font-semibold text-[#321923] block mb-2 flex items-center justify-between">
                      <span>Select Proportion / Count:</span>
                      <span className="text-[10px] text-[#78816A]">Updates 3D scale immediately</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {currentMeta.sizes.map((s, idx) => (
                        <button
                          key={s}
                          onClick={() => setSizeIndex(idx)}
                          className={`p-3 rounded-xl border text-center text-xs font-medium transition-all cursor-pointer ${
                            sizeIndex === idx
                              ? 'border-[#6E3947] bg-[#FAF6F0] text-[#6E3947] font-semibold ring-2 ring-[#6E3947]/20 shadow-xs'
                              : 'border-[#E6D7CD] text-[#392923] hover:border-[#D99AA3]'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-[#F6F0E7]">
                    <button
                      onClick={() => setStep(1)}
                      className="px-4 py-2.5 rounded-full border border-[#E6D7CD] text-xs font-medium text-[#392923] hover:bg-[#FAF6F0] flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Silhouette</span>
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="px-6 py-3 rounded-full bg-[#6E3947] hover:bg-[#522734] text-white text-xs font-semibold flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
                    >
                      <span>Continue to Personalization</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Personalization & Details */}
              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-[#321923]">
                      Step 3: Embroidered Monogram &amp; Notes
                    </h3>
                    <p className="text-xs text-[#6B5B54] mt-1">
                      Add a hand-embroidered monogram letter, dedication name, or bespoke instructions.
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#321923] block mb-1">
                      Embroidered Initial Letter (Optional):
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        maxLength={2}
                        value={customInitial}
                        onChange={(e) => setCustomInitial(e.target.value.toUpperCase())}
                        placeholder="e.g. A"
                        className="w-20 px-3 py-2 text-center text-lg font-serif font-bold uppercase rounded-xl border border-[#D99AA3]/50 bg-[#FAF6F0] focus:ring-2 focus:ring-[#6E3947]/30 focus:outline-none"
                      />
                      <span className="text-xs text-[#78816A]">
                        {currentMeta.monogramNote} in {accentColor.name} yarn.
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#321923] block mb-1">
                      Recipient / Dedication Name:
                    </label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="e.g. For Ananya's Nursery / Birthday Keepsake"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D99AA3]/40 focus:ring-2 focus:ring-[#6E3947]/30 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#321923] block mb-1">
                      Artisan Instructions &amp; Notes:
                    </label>
                    <textarea
                      rows={3}
                      value={customNotes}
                      onChange={(e) => setCustomNotes(e.target.value)}
                      placeholder="e.g. Custom stem height, add handwritten gift note with personalized message..."
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D99AA3]/40 focus:ring-2 focus:ring-[#6E3947]/30 focus:outline-none placeholder:text-[#8E987E]"
                    />
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-[#F6F0E7]">
                    <button
                      onClick={() => setStep(2)}
                      className="px-4 py-2.5 rounded-full border border-[#E6D7CD] text-xs font-medium text-[#392923] hover:bg-[#FAF6F0] flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                    <button
                      onClick={() => setStep(4)}
                      className="px-6 py-3 rounded-full bg-[#6E3947] hover:bg-[#522734] text-white text-xs font-semibold flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
                    >
                      <span>Review Specification</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Review and Submit */}
              {step === 4 && (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-[#321923]">
                      Step 4: Final Review &amp; Submission
                    </h3>
                    <p className="text-xs text-[#6B5B54] mt-1">
                      Review your customized specifications before submitting to the studio queue.
                    </p>
                  </div>

                  {/* Summary Box */}
                  <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E6D7CD] space-y-3 text-xs">
                    <div className="flex justify-between items-center pb-2 border-b border-[#E6D7CD]">
                      <span className="font-semibold text-[#321923] text-sm">{currentMeta.title}</span>
                      <span className="font-serif font-bold text-[#6E3947] text-sm">
                        ₹{currentMeta.basePrice.toLocaleString()} (catalog base)
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[#6B5B54]">
                      <div>
                        <span className="text-[#8E987E] block text-[10px]">Primary Color:</span>
                        <div className="flex items-center gap-1.5 font-medium text-[#321923]">
                          <span
                            className="w-3 h-3 rounded-full border border-black/10 inline-block"
                            style={{ backgroundColor: primaryColor.hex }}
                          />
                          {primaryColor.name}
                        </div>
                      </div>

                      <div>
                        <span className="text-[#8E987E] block text-[10px]">Accent / Trim:</span>
                        <div className="flex items-center gap-1.5 font-medium text-[#321923]">
                          <span
                            className="w-3 h-3 rounded-full border border-black/10 inline-block"
                            style={{ backgroundColor: accentColor.hex }}
                          />
                          {accentColor.name}
                        </div>
                      </div>

                      <div>
                        <span className="text-[#8E987E] block text-[10px]">Size / Count:</span>
                        <span className="font-medium text-[#321923]">{currentSizeLabel}</span>
                      </div>

                      <div>
                        <span className="text-[#8E987E] block text-[10px]">Monogram Initial:</span>
                        <span className="font-medium text-[#321923]">{customInitial || 'None'}</span>
                      </div>
                    </div>

                    {customNotes && (
                      <div className="pt-2 border-t border-[#E6D7CD]">
                        <span className="text-[#8E987E] block text-[10px]">Special Instructions:</span>
                        <p className="text-[#321923] italic text-[11px] mt-0.5">"{customNotes}"</p>
                      </div>
                    )}
                  </div>

                  {/* Crafting notice */}
                  <div className="p-3 rounded-xl bg-[#F0C9CB]/20 border border-[#D99AA3]/30 text-[11px] text-[#6E3947] space-y-1">
                    <p className="font-semibold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Handmade Crafting Notice
                    </p>
                    <p>
                      Custom orders require ~{currentMeta.craftDays} crafting days. Submitting sends your request to our studio queue. We will contact you to confirm final yarn shades before commencing crochet work.
                    </p>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-[#F6F0E7]">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-4 py-2.5 rounded-full border border-[#E6D7CD] text-xs font-medium text-[#392923] hover:bg-[#FAF6F0] flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3.5 rounded-full bg-[#6E3947] hover:bg-[#522734] text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-[#6E3947]/30 transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span>Registering Commission...</span>
                      ) : (
                        <>
                          <span>Submit Custom Order Request</span>
                          <CheckCircle2 className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
