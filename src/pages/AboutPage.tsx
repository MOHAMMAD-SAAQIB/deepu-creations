import React from 'react';
import { Heart, Sparkles, Gift, Wand2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { businessConfig } from '../config/businessConfig';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F6F0E7] bg-crochet-pattern py-8 sm:py-14 px-4 sm:px-6 lg:px-8 pb-24 md:pb-12">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Editorial Story Section */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-[#E6D7CD] shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5 relative">
            <div className="aspect-square rounded-2xl overflow-hidden border border-[#D99AA3]/50 shadow-md">
              <img
                src="/images/artisan_maker.jpg"
                alt="The Maker at Deepu Creations"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-3 -right-3 bg-[#FAF6F0] px-3.5 py-1.5 rounded-full border border-[#D99AA3] shadow-md flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-[#6E3947] fill-[#6E3947]" />
              <span className="text-[11px] font-serif font-semibold text-[#321923]">The Artisan Hand</span>
            </div>
          </div>

          <div className="md:col-span-7 space-y-4">
            <span className="text-[11px] uppercase tracking-widest font-semibold text-[#6E3947] bg-[#F0C9CB]/40 px-3 py-1 rounded-full border border-[#D99AA3]/30">
              Artisan Heritage
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#321923] font-semibold leading-tight">
              The Story Behind Deepu Creations
            </h1>

            <p className="text-xs sm:text-sm text-[#6B5B54] leading-relaxed">
              {businessConfig.makerStory.storyContent}
            </p>

            <p className="text-xs sm:text-sm text-[#6B5B54] leading-relaxed">
              Unlike fast machine-knitted textiles, every single petal, floppy bunny ear, and bag charm from our studio begins as an unspooled strand of premium combed cotton. We believe true luxury lies in patience, human touch, and lasting emotional resonance.
            </p>

            {!businessConfig.makerStory.isStoryConfigured && (
              <div className="p-3 rounded-xl bg-[#FAF6F0] border border-[#E6D7CD] text-[10px] font-mono text-[#8E987E]">
                Note: Brand story narrative is currently configured with placeholder context awaiting official founder biography.
              </div>
            )}

            <div className="pt-2">
              <Link
                to="/custom-orders"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#6E3947] text-white text-xs font-semibold hover:bg-[#522734] shadow-md transition-all active:scale-95"
              >
                <span>Commission a Custom Piece</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Why Choose Us Values Grid */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="font-serif text-2xl sm:text-3xl text-[#321923] font-semibold">
              Why Choose Deepu Creations
            </h2>
            <p className="text-xs text-[#6B5B54] mt-1">
              Handmade values woven into every single stitch
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                title: 'Handmade with Love',
                desc: 'Carefully knotted one stitch at a time with mindful attention.',
                icon: Heart,
              },
              {
                title: 'Unique Designs',
                desc: 'Original patterns and organic silhouettes that feel distinct.',
                icon: Sparkles,
              },
              {
                title: 'Custom Orders',
                desc: 'Personalized palettes, sizes, and monogram initial embroidery.',
                icon: Wand2,
              },
              {
                title: 'Perfect for Gifting',
                desc: 'Delicately wrapped in keepsake boxes ready to bring joy.',
                icon: Gift,
              },
            ].map((v, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 border border-[#E6D7CD] shadow-xs text-center flex flex-col items-center justify-center space-y-2.5"
              >
                <div className="w-12 h-12 rounded-full bg-[#F0C9CB]/40 text-[#6E3947] flex items-center justify-center border border-[#D99AA3]/30">
                  <v.icon className="w-5 h-5 text-[#6E3947]" />
                </div>
                <h3 className="font-serif text-sm font-semibold text-[#321923]">{v.title}</h3>
                <p className="text-[11px] text-[#6B5B54] leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div id="contact" className="bg-[#321923] text-[#FAF6F0] rounded-3xl p-6 sm:p-10 border border-[#6E3947] text-center space-y-4">
          <span className="text-[11px] uppercase tracking-widest font-semibold text-[#F0C9CB]">
            Atelier Inquiries
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold">
            Get in Touch With Deepu Creations
          </h2>
          <p className="text-xs sm:text-sm text-[#D99AA3] max-w-lg mx-auto leading-relaxed">
            Have questions about bouquet sizing, wedding keepsakes, or special wool requests? We would love to hear from you.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-mono">
            <div className="px-5 py-3 rounded-2xl bg-[#522734] border border-[#F0C9CB]/20 text-[#F0C9CB]">
              WhatsApp: <span className="text-white">{businessConfig.contact.whatsappNumber}</span>
            </div>
            <div className="px-5 py-3 rounded-2xl bg-[#522734] border border-[#F0C9CB]/20 text-[#F0C9CB]">
              Email: <span className="text-white">{businessConfig.contact.email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
