import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, MessageCircle, ChevronDown, ChevronUp, ArrowLeft, Sparkles } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { getWhatsAppLink } from '../config/businessConfig';
import { ProductCard } from '../components/common/ProductCard';
import { NeutralProductPlaceholder } from '../components/common/NeutralProductPlaceholder';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { products, getProductBySlug } = useProducts();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const product = getProductBySlug(slug || '') || products[0];

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || { name: 'Standard', hex: '#D99AA3' });
  const [selectedSize, setSelectedSize] = useState(product?.sizes ? product.sizes[0] : 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [imgLoadError, setImgLoadError] = useState(false);

  // Accordion toggles
  const [openSection, setOpenSection] = useState<'details' | 'care' | 'shipping' | null>('details');

  const isFav = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, {
      color: selectedColor.name,
      colorHex: selectedColor.hex,
      size: selectedSize,
      quantity,
    });
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const whatsappInquiry = getWhatsAppLink(
    `Hello Deepu Creations! I am interested in ordering the "${product.name}" in color "${selectedColor.name}" (${selectedSize}). Is this currently available for dispatch?`
  );

  const relatedProducts = products.filter(
    (p) => p.id !== product?.id && p.category === product?.category
  ).concat(products.filter((p) => p.id !== product?.id && p.category !== product?.category)).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F6F0E7] bg-crochet-pattern py-6 sm:py-10 px-4 sm:px-6 lg:px-8 pb-24 md:pb-12">
      <div className="max-w-6xl mx-auto">
        {/* Back Link */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6E3947] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to catalog</span>
          </button>
        </div>

        {/* Product Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start bg-white/70 backdrop-blur-md rounded-3xl p-5 sm:p-8 border border-[#E6D7CD] shadow-sm">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#FAF6F0] border border-[#E6D7CD]">
              {product.images && product.images.length > 0 && product.images[selectedImage] && !imgLoadError ? (
                <img
                  src={product.images[selectedImage] || product.images[0]}
                  alt={product.name}
                  onError={() => setImgLoadError(true)}
                  className="w-full h-full object-cover object-center transition-all duration-300"
                />
              ) : (
                <NeutralProductPlaceholder size="lg" message="Awaiting product image upload" />
              )}

              {product.badge && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wider bg-[#FAF6F0]/95 text-[#6E3947] border border-[#F0C9CB] shadow-xs backdrop-blur-xs">
                    {product.badge}
                  </span>
                </div>
              )}

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 z-10 p-2.5 rounded-full transition-all duration-200 shadow-md ${
                  isFav
                    ? 'bg-[#6E3947] text-white'
                    : 'bg-white/90 text-[#392923] hover:text-[#6E3947]'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Gallery Thumbnails if multiple images */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      selectedImage === idx
                        ? 'border-[#6E3947] shadow-sm'
                        : 'border-[#E6D7CD] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information, Variants & Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs text-[#78816A] mb-1">
                <span className="uppercase tracking-widest font-semibold">{product.categoryLabel}</span>
                {product.inStock ? (
                  <span className="text-[#78816A] font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#78816A] inline-block" />
                    In Stock • Ready to Dispatch
                  </span>
                ) : (
                  <span className="text-[#991B1B] font-medium">Bespoke • Handcrafted on Order</span>
                )}
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#321923] font-semibold leading-tight">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-2 mt-2">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#6E3947]">
                  {product.currencySymbol}
                  {product.price.toLocaleString()}
                </span>
                {product.isPricePlaceholder && (
                  <span className="text-[10px] font-mono text-[#8E987E] bg-[#FAF6F0] px-2 py-0.5 rounded border border-[#E6D7CD]">
                    Catalog Demo Price
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-[#6B5B54] mt-3 leading-relaxed">
                {product.shortDescription}
              </p>
            </div>

            {/* Color Swatch Selector */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="text-xs font-semibold text-[#321923] block mb-2 flex items-center justify-between">
                  <span>Color Option:</span>
                  <span className="text-[#6E3947] font-medium">{selectedColor.name}</span>
                </label>
                <div className="flex flex-wrap items-center gap-2.5">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c)}
                      className={`group relative p-1 rounded-full border-2 transition-all ${
                        selectedColor.name === c.name
                          ? 'border-[#6E3947] scale-110 shadow-xs'
                          : 'border-transparent hover:border-[#D99AA3]'
                      }`}
                      title={c.name}
                    >
                      <span
                        className="w-6 h-6 rounded-full block border border-black/10 shadow-inner"
                        style={{ backgroundColor: c.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size / Stem Count Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className="text-xs font-semibold text-[#321923] block mb-2">
                  Size / Arrangement:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                        selectedSize === s
                          ? 'border-[#6E3947] bg-[#FAF6F0] text-[#6E3947] font-semibold ring-1 ring-[#6E3947]/30'
                          : 'border-[#E6D7CD] text-[#392923] hover:border-[#D99AA3]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector and Add to Cart */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-[#D99AA3]/50 rounded-full bg-white p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#6E3947] hover:bg-[#F0C9CB]/30 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-xs font-bold text-[#321923]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#6E3947] hover:bg-[#F0C9CB]/30 transition-colors"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3.5 px-6 rounded-full font-medium text-xs sm:text-sm tracking-wide shadow-lg shadow-[#6E3947]/20 flex items-center justify-center gap-2 transition-all active:scale-95 ${
                    addedAnimation
                      ? 'bg-[#78816A] text-white'
                      : 'bg-[#6E3947] hover:bg-[#522734] text-white'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{addedAnimation ? 'Added to Cart ✓' : 'Add to Cart'}</span>
                </button>
              </div>

              {/* Direct WhatsApp Product Inquiry */}
              <a
                href={whatsappInquiry.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-2.5 px-4 rounded-full text-xs font-medium flex items-center justify-center gap-2 border transition-all ${
                  whatsappInquiry.isReady
                    ? 'border-[#25D366] text-[#1EBE5D] hover:bg-[#25D366]/10'
                    : 'border-[#D99AA3]/40 text-[#6B5B54] bg-[#FAF6F0]'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>
                  {whatsappInquiry.isReady
                    ? 'Enquire About this Piece on WhatsApp'
                    : 'WhatsApp Inquiry: [WHATSAPP_NUMBER]'}
                </span>
              </a>

              {/* Direct Link into Custom 3D Studio */}
              <Link
                to={`/custom-orders?product=${product.id}`}
                className="w-full py-2.5 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-2 border border-[#D99AA3] text-[#6E3947] hover:bg-[#FAF6F0] transition-all shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D99AA3]" />
                <span>Customize Colors &amp; Specs in 3D Studio</span>
              </Link>
            </div>

            {/* Collapsible Accordions for Details, Care, Shipping */}
            <div className="border-t border-[#E6D7CD] pt-4 space-y-2 text-xs">
              {/* Product Details */}
              <div className="border border-[#E6D7CD] rounded-xl overflow-hidden bg-white/60">
                <button
                  onClick={() => setOpenSection(openSection === 'details' ? null : 'details')}
                  className="w-full p-3.5 flex items-center justify-between font-semibold text-[#321923] hover:bg-[#FAF6F0]"
                >
                  <span>Materials & Dimensions</span>
                  {openSection === 'details' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSection === 'details' && (
                  <div className="p-3.5 pt-0 text-[#6B5B54] space-y-2 border-t border-[#F6F0E7]">
                    <p>{product.description}</p>
                    <div className="pt-2">
                      <p className="font-semibold text-[#321923]">Dimensions:</p>
                      <p>{product.dimensions}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-[#321923]">Materials:</p>
                      <ul className="list-disc pl-4 space-y-0.5">
                        {product.materials.map((m, idx) => (
                          <li key={idx}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Care Instructions */}
              <div className="border border-[#E6D7CD] rounded-xl overflow-hidden bg-white/60">
                <button
                  onClick={() => setOpenSection(openSection === 'care' ? null : 'care')}
                  className="w-full p-3.5 flex items-center justify-between font-semibold text-[#321923] hover:bg-[#FAF6F0]"
                >
                  <span>Care Instructions</span>
                  {openSection === 'care' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSection === 'care' && (
                  <div className="p-3.5 pt-0 text-[#6B5B54] space-y-1.5 border-t border-[#F6F0E7]">
                    {product.careInstructions.map((c, idx) => (
                      <p key={idx} className="flex items-start gap-1.5">
                        <span className="text-[#6E3947]">•</span>
                        <span>{c}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Shipping & Delivery */}
              <div className="border border-[#E6D7CD] rounded-xl overflow-hidden bg-white/60">
                <button
                  onClick={() => setOpenSection(openSection === 'shipping' ? null : 'shipping')}
                  className="w-full p-3.5 flex items-center justify-between font-semibold text-[#321923] hover:bg-[#FAF6F0]"
                >
                  <span>Packaging & Shipping</span>
                  {openSection === 'shipping' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSection === 'shipping' && (
                  <div className="p-3.5 pt-0 text-[#6B5B54] space-y-1.5 border-t border-[#F6F0E7]">
                    <p>{product.shippingNotice}</p>
                    <p className="italic text-[#78816A]">Crafting turnaround: {product.craftingTime}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Creations */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl sm:text-3xl text-[#321923] font-semibold">
              You May Also Adore
            </h2>
            <p className="text-xs text-[#6B5B54] mt-1">
              Complementary handcrafted creations from our crochet studio
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
