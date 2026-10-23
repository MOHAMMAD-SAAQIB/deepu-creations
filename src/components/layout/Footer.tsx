import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Heart, Sparkles, Shield, AlertCircle } from 'lucide-react';
import { InstagramIcon } from '../common/InstagramIcon';
import { businessConfig, getInstagramLink, getWhatsAppLink } from '../../config/businessConfig';

export const Footer: React.FC = () => {
  const [showConfigNotice, setShowConfigNotice] = useState<string | null>(null);

  const instagram = getInstagramLink();
  const whatsapp = getWhatsAppLink('Hello Deepu Creations, I would like to inquire about your handcrafted crochet creations!');

  const handleInstagramClick = (e: React.MouseEvent) => {
    if (!instagram.isReady) {
      e.preventDefault();
      setShowConfigNotice('Instagram profile is currently using placeholder [INSTAGRAM_URL]. Configure in business settings.');
    }
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    if (!whatsapp.isReady) {
      e.preventDefault();
      setShowConfigNotice('WhatsApp business number is currently using placeholder [WHATSAPP_NUMBER]. Configure in business settings.');
    }
  };

  return (
    <footer className="bg-[#321923] text-[#FAF6F0] pt-14 pb-24 md:pb-12 border-t border-[#6E3947]/40 relative overflow-hidden">
      {/* Decorative background floral glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#6E3947]/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#D99AA3]/10 blur-3xl pointer-events-none" />

      {/* Integration placeholder notice modal / toast */}
      {showConfigNotice && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 max-w-md w-11/12 bg-[#FAF6F0] text-[#321923] p-4 rounded-xl shadow-2xl border border-[#D99AA3] animate-fadeIn flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#6E3947] flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <p className="font-semibold text-sm mb-0.5">Configuration Requirement</p>
            <p className="text-[#6B5B54]">{showConfigNotice}</p>
          </div>
          <button
            onClick={() => setShowConfigNotice(null)}
            className="text-xs font-semibold text-[#6E3947] hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#6E3947]/40">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="inline-block group">
              <h3 className="font-serif text-3xl font-normal tracking-wide text-[#FAF6F0] group-hover:text-[#F0C9CB] transition-colors">
                {businessConfig.brandName}
              </h3>
              <p className="font-script text-xl text-[#F0C9CB]">Handmade with Love ♡</p>
            </Link>
            <p className="text-xs text-[#D99AA3] leading-relaxed">
              {businessConfig.slogan}
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-[11px] text-[#F0C9CB]/80">
              <Sparkles className="w-3.5 h-3.5 text-[#D99AA3]" />
              <span>Bespoke commissions & heirloom keepsakes</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-base tracking-wider uppercase text-[#F0C9CB] font-medium">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-[#FAF6F0]/80">
              <li>
                <Link to="/" className="hover:text-[#F0C9CB] transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#F0C9CB] transition-colors">Shop Catalog</Link>
              </li>
              <li>
                <Link to="/custom-orders" className="hover:text-[#F0C9CB] transition-colors flex items-center gap-1">
                  <span>Custom Studio</span>
                  <span className="text-[9px] bg-[#6E3947] px-1.5 py-0.2 rounded text-[#F0C9CB]">Interactive</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#F0C9CB] transition-colors">About the Maker</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#F0C9CB] transition-colors">Contact Atelier</Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-[#F0C9CB] transition-colors">Customer Portal</Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="font-serif text-base tracking-wider uppercase text-[#F0C9CB] font-medium">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-[#FAF6F0]/80">
              <li>
                <Link to="/policies#faq" className="hover:text-[#F0C9CB] transition-colors">Crafting & Order FAQs</Link>
              </li>
              <li>
                <Link to="/policies#shipping" className="hover:text-[#F0C9CB] transition-colors">Packaging & Delivery</Link>
              </li>
              <li>
                <Link to="/policies#returns" className="hover:text-[#F0C9CB] transition-colors">Artisanal Return Policy</Link>
              </li>
              <li>
                <Link to="/policies#custom-terms" className="hover:text-[#F0C9CB] transition-colors">Custom Order Guidelines</Link>
              </li>
              <li>
                <Link to="/policies#privacy" className="hover:text-[#F0C9CB] transition-colors">Privacy & Terms</Link>
              </li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div className="space-y-4">
            <h4 className="font-serif text-base tracking-wider uppercase text-[#F0C9CB] font-medium">
              Connect With Us
            </h4>
            <p className="text-xs text-[#D99AA3] leading-relaxed">
              Follow our daily studio moments, upcoming color drops, and behind-the-scenes stitch reels.
            </p>

            <div className="flex items-center gap-3">
              <a
                href={instagram.url}
                onClick={handleInstagramClick}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#522734] border border-[#F0C9CB]/30 flex items-center justify-center text-[#F0C9CB] hover:bg-[#6E3947] hover:text-white transition-all shadow-md group"
                aria-label="Instagram Profile"
              >
                <InstagramIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>

              <a
                href={whatsapp.url}
                onClick={handleWhatsAppClick}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#522734] border border-[#F0C9CB]/30 flex items-center justify-center text-[#F0C9CB] hover:bg-[#6E3947] hover:text-white transition-all shadow-md group"
                aria-label="WhatsApp Contact"
              >
                <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
            </div>

            <div className="pt-2 text-[11px] text-[#FAF6F0]/60 space-y-1">
              <p>Email: <span className="font-mono text-[#F0C9CB]">{businessConfig.contact.email}</span></p>
              <p>WhatsApp: <span className="font-mono text-[#F0C9CB]">{businessConfig.contact.whatsappNumber}</span></p>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Brand Status */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#D99AA3]/80 gap-4">
          <p className="flex items-center gap-1 text-center sm:text-left">
            <span>© {new Date().getFullYear()} {businessConfig.brandName}. All rights reserved. Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#F0C9CB] inline fill-[#F0C9CB]" />
          </p>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="font-mono text-[10px] text-[#D99AA3]/70">Handmade with mindful intentionality</span>
            <span className="text-[#6E3947]">•</span>
            <span className="font-mono text-[10px] text-[#D99AA3]/60">v1.0 Production Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
