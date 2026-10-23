import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Heart, MessageCircle, Gift, Wand2 } from 'lucide-react';
import { InstagramIcon } from '../components/common/InstagramIcon';
import { motion } from 'framer-motion';
import { useProducts } from '../context/ProductContext';
import { ProductCard } from '../components/common/ProductCard';
import { businessConfig, getInstagramLink, getWhatsAppLink } from '../config/businessConfig';

export const HomePage: React.FC = () => {
  const { products, categories } = useProducts();
  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);
  const instagram = getInstagramLink();
  const whatsapp = getWhatsAppLink('Hello Deepu Creations, I would like to enquire about your handmade crochet creations!');

  return (
    <div className="min-h-screen bg-[#F6F0E7] overflow-x-hidden pb-20 md:pb-0">
      {/* SECTION 1: EDITORIAL HERO */}
      <section className="relative pt-6 sm:pt-12 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#E6D7CD]/70 overflow-hidden bg-gradient-to-b from-[#FAF6F0] via-[#F6F0E7] to-[#F6F0E7]">
        {/* Soft atmospheric ambient glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-[#F0C9CB]/25 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 rounded-full bg-[#D99AA3]/15 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Hero Copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 space-y-6 text-center lg:text-left z-10"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0C9CB]/40 text-[#6E3947] text-xs font-semibold uppercase tracking-wider border border-[#D99AA3]/30 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#6E3947]" />
              <span>Artisanal Luxury Crochet</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#321923] font-semibold tracking-tight leading-[1.12]">
              Handmade Happiness for Every Moment
            </h1>

            <p className="text-sm sm:text-base text-[#6B5B54] max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              Crochet creations that bring warmth, charm, and a little more joy to your world. Sculpted petal by petal, stitch by stitch.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <Link
                to="/shop"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#6E3947] hover:bg-[#522734] text-white text-xs sm:text-sm font-semibold tracking-wide shadow-lg shadow-[#6E3947]/25 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/custom-orders"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/90 hover:bg-white text-[#321923] text-xs sm:text-sm font-semibold tracking-wide border border-[#D99AA3]/60 shadow-sm flex items-center justify-center gap-2 transition-all hover:border-[#6E3947] active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-[#D99AA3]" />
                <span>Custom Orders</span>
              </Link>
            </div>

            {/* Micro Trust Indicators */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-[11px] text-[#78816A]">
              <span className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#D99AA3] fill-[#D99AA3]" />
                100% Handcrafted
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D99AA3]" />
                Bespoke Palettes
              </span>
              <span className="flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5 text-[#D99AA3]" />
                Keepsake Packaging
              </span>
            </div>
          </motion.div>

          {/* Hero Visual Imagery */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-6 relative z-10"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Backing decorative frame */}
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-[#6E3947]/10 via-[#F0C9CB]/30 to-[#F6F0E7] transform rotate-1 blur-xs" />

              {/* Main Showcase Image */}
              <div className="relative rounded-3xl overflow-hidden border border-[#E6D7CD] shadow-2xl bg-[#FAF6F0] aspect-4/3 sm:aspect-4/3">
                <img
                  src="/images/hero_banner.jpg"
                  alt="Deepu Creations Handmade Crochet Floral Bouquet"
                  className="w-full h-full object-cover"
                />

                {/* Floating Artisan Tag */}
                <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-[#FAF6F0]/95 backdrop-blur-md p-3 rounded-2xl border border-[#D99AA3]/40 shadow-lg flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                    <img src="/images/tulip_bouquet.jpg" alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#8E987E] uppercase tracking-wider block">
                      Artisan Spotlight
                    </span>
                    <span className="font-serif text-xs font-semibold text-[#321923]">
                      Everlasting Pastel Tulip Bouquet
                    </span>
                  </div>
                  <Link
                    to="/product/artisan-tulip-bouquet"
                    className="ml-auto p-1.5 rounded-full bg-[#6E3947] text-white hover:bg-[#522734]"
                    aria-label="View Product"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: COLLECTION DISCOVERY (ROUND TILES) */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-[11px] uppercase tracking-widest font-semibold text-[#6E3947]">
              Curated Realms
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#321923] mt-1">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-semibold text-[#6E3947] hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.slug}`}
              className="group bg-white rounded-3xl p-4 sm:p-5 border border-[#E6D7CD] shadow-2xs hover:shadow-lg hover:border-[#D99AA3] transition-all text-center flex flex-col items-center"
            >
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-[#FAF6F0] p-1 border-2 border-[#F0C9CB] group-hover:scale-105 group-hover:border-[#6E3947] transition-all mb-3 shadow-inner">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <h3 className="font-serif text-base sm:text-lg font-semibold text-[#321923] group-hover:text-[#6E3947] transition-colors">
                {cat.name}
              </h3>
              <p className="text-[11px] text-[#78816A] mt-0.5 font-medium">
                {cat.count} Handcrafted Styles
              </p>
            </Link>
          ))}

          {/* Fourth Custom Studio Tile */}
          <Link
            to="/custom-orders"
            className="group bg-gradient-to-b from-[#FAF6F0] to-[#F0C9CB]/40 rounded-3xl p-4 sm:p-5 border border-[#D99AA3]/60 shadow-2xs hover:shadow-lg hover:border-[#6E3947] transition-all text-center flex flex-col items-center justify-center"
          >
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-[#FAF6F0] flex items-center justify-center border-2 border-dashed border-[#D99AA3] group-hover:scale-105 transition-all mb-3 shadow-xs">
              <Wand2 className="w-8 h-8 text-[#6E3947]" />
            </div>
            <h3 className="font-serif text-base sm:text-lg font-semibold text-[#321923] group-hover:text-[#6E3947] transition-colors">
              Custom Studio
            </h3>
            <p className="text-[11px] text-[#6E3947] mt-0.5 font-medium">
              Bespoke Colors & Sizes
            </p>
          </Link>
        </div>
      </section>

      {/* SECTION 3: FEATURED CREATIONS */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E6D7CD]/70">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-[11px] uppercase tracking-widest font-semibold text-[#6E3947]">
              Artisan Signature
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#321923] mt-1">
              Featured Creations
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-semibold text-[#6E3947] hover:underline flex items-center gap-1"
          >
            <span>Explore Entire Boutique</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* SECTION 4: BESPOKE CUSTOM STUDIO SHOWCASE */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#321923] text-[#FAF6F0] relative overflow-hidden my-8">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#6E3947]/30 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#D99AA3]/15 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10">
          <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#522734] border border-[#F0C9CB]/30 text-xs font-semibold text-[#F0C9CB]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive 3D & Vector Studio</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
              Craft Something Uniquely Yours
            </h2>

            <p className="text-xs sm:text-sm text-[#D99AA3] leading-relaxed max-w-xl mx-auto lg:mx-0">
              Have a special nursery palette, an anniversary bouquet, or an embroidered monogram in mind? Step into our Interactive Custom Studio to preview colors, proportions, and personal initial tags in real time.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/custom-orders"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D99AA3] to-[#F0C9CB] text-[#321923] font-semibold text-xs sm:text-sm tracking-wide shadow-xl shadow-[#220F16]/50 hover:from-white hover:to-[#FAF6F0] transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Launch Custom Studio</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-md bg-[#392923] p-6 rounded-3xl border border-[#6E3947] shadow-2xl">
              <div className="aspect-square rounded-2xl overflow-hidden bg-[#220F16] flex items-center justify-center relative">
                <img
                  src="/images/bunny_plush.jpg"
                  alt="Custom Crochet Bunny"
                  className="w-4/5 h-4/5 object-contain drop-shadow-2xl"
                />
                <div className="absolute top-3 left-3 bg-[#522734]/90 px-3 py-1 rounded-full text-[10px] font-mono text-[#F0C9CB] border border-[#F0C9CB]/20">
                  Live Customizer
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-[#F0C9CB]">
                <span>Choose Yarn • Accent • Monogram</span>
                <span className="font-serif font-bold text-white">From ₹499</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: ABOUT THE MAKER & VALUES */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E6D7CD] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 relative">
            <div className="aspect-square rounded-2xl overflow-hidden border border-[#D99AA3]/50 shadow-md">
              <img
                src="/images/artisan_maker.jpg"
                alt="Maker at Deepu Creations"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-3 -right-3 bg-[#FAF6F0] px-3.5 py-1.5 rounded-full border border-[#D99AA3] shadow-md flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-[#6E3947] fill-[#6E3947]" />
              <span className="text-[11px] font-serif font-semibold text-[#321923]">Handmade with Love</span>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <span className="text-[11px] uppercase tracking-widest font-semibold text-[#6E3947]">
              The Story
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#321923] font-semibold leading-tight">
              The Heart Behind Deepu Creations
            </h2>
            <p className="text-xs sm:text-sm text-[#6B5B54] leading-relaxed">
              {businessConfig.makerStory.storyContent}
            </p>
            <p className="text-xs sm:text-sm text-[#6B5B54] leading-relaxed">
              Every creation is built with durable, hypoallergenic cotton and wool yarns, designed to stay vibrant and comforting across seasons and celebrations.
            </p>

            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#6E3947] hover:underline"
              >
                <span>Read Full Maker Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: SOCIAL CONNECTION & WHATSAPP */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E6D7CD]/70">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-[11px] uppercase tracking-widest font-semibold text-[#6E3947]">
            Stay In Touch
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#321923] mt-1">
            Let's Stay Connected
          </h2>
          <p className="text-xs sm:text-sm text-[#6B5B54] mt-1.5">
            Follow our studio journey on Instagram for fresh pattern releases, or send a quick WhatsApp note for custom bouquet assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {/* Instagram Connect Card */}
          <div className="bg-white rounded-2xl p-6 border border-[#E6D7CD] shadow-xs text-center space-y-3 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#F0C9CB]/40 text-[#6E3947] flex items-center justify-center">
              <InstagramIcon className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base font-semibold text-[#321923]">Follow on Instagram</h3>
            <p className="text-xs text-[#6B5B54]">
              Reels, stitch tutorials, and behind-the-scenes moments.
            </p>
            <a
              href={instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full py-2.5 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                instagram.isReady
                  ? 'bg-[#E1306C] text-white hover:bg-[#C13584]'
                  : 'bg-[#FAF6F0] text-[#6E3947] border border-[#D99AA3]'
              }`}
            >
              <span>{instagram.isReady ? 'Visit @deepucreations' : 'Instagram: [INSTAGRAM_URL]'}</span>
            </a>
          </div>

          {/* WhatsApp Direct Chat Card */}
          <div className="bg-white rounded-2xl p-6 border border-[#E6D7CD] shadow-xs text-center space-y-3 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#25D366]/20 text-[#1EBE5D] flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base font-semibold text-[#321923]">Chat on WhatsApp</h3>
            <p className="text-xs text-[#6B5B54]">
              Direct assistance with custom colors, sizing, and gifting.
            </p>
            <a
              href={whatsapp.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full py-2.5 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                whatsapp.isReady
                  ? 'bg-[#25D366] text-white hover:bg-[#1EBE5D]'
                  : 'bg-[#FAF6F0] text-[#78816A] border border-[#D99AA3]'
              }`}
            >
              <span>{whatsapp.isReady ? 'Message Studio on WhatsApp' : 'WhatsApp: [WHATSAPP_NUMBER]'}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
