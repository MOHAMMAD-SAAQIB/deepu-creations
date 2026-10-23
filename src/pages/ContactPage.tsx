import React, { useState } from 'react';
import {
  MessageCircle,
  Mail,
  Send,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Copy,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { InstagramIcon } from '../components/common/InstagramIcon';
import {
  businessConfig,
  getInstagramLink,
  getWhatsAppLink,
} from '../config/businessConfig';

interface FormState {
  name: string;
  email: string;
  enquiryType: string;
  message: string;
  // Anti-spam honeypot
  honeypot: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  enquiryType?: string;
  message?: string;
}

export const ContactPage: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    enquiryType: 'custom_order',
    message: '',
    honeypot: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedDraft, setSubmittedDraft] = useState<FormState | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);

  // Business config helpers
  const whatsapp = getWhatsAppLink(
    'Hello Deepu Creations! I would like to inquire about your handcrafted crochet creations.'
  );
  const instagram = getInstagramLink();
  const isEmailConfigured =
    businessConfig.contact.isEmailConfigured &&
    !businessConfig.contact.email.includes('[');

  // Field Validation
  const validateField = (name: keyof FormState, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Please enter your name.';
        if (value.trim().length < 2) return 'Name must be at least 2 characters.';
        return undefined;
      case 'email':
        if (!value.trim()) return 'Please enter your email address.';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) return 'Please enter a valid email address.';
        return undefined;
      case 'enquiryType':
        if (!value.trim()) return 'Please select an enquiry subject.';
        return undefined;
      case 'message':
        if (!value.trim()) return 'Please enter your message or question.';
        if (value.trim().length < 10) return 'Message must be at least 10 characters long.';
        return undefined;
      default:
        return undefined;
    }
  };

  const handleBlur = (field: keyof FormState) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errorMsg = validateField(field, form[field]);
    setErrors((prev) => ({ ...prev, [field]: errorMsg }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const errorMsg = validateField(name as keyof FormState, value);
      setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Anti-spam honeypot detection
    if (form.honeypot.trim() !== '') {
      console.warn('Bot submission blocked via honeypot.');
      return;
    }

    // 2. Client-side rate limiting (prevent repeated submissions within 5 seconds)
    const now = Date.now();
    if (now - lastSubmitTime < 5000) {
      alert('Please wait a moment before sending another request.');
      return;
    }

    // 3. Validate all fields
    const newErrors: FormErrors = {
      name: validateField('name', form.name),
      email: validateField('email', form.email),
      enquiryType: validateField('enquiryType', form.enquiryType),
      message: validateField('message', form.message),
    };

    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      enquiryType: true,
      message: true,
    });

    const hasErrors = Object.values(newErrors).some(Boolean);
    if (hasErrors) {
      return;
    }

    setIsSubmitting(true);
    setLastSubmitTime(now);

    // Honest submission boundary:
    // There is no external production backend endpoint configured in this project.
    // Rather than showing a false success banner or dropping the user's message,
    // we clearly display the documented setup boundary and retain the drafted message
    // with direct actions (WhatsApp instant transfer, email client launch, or copy).
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedDraft({ ...form });
    }, 600);
  };

  const handleCopyDraft = () => {
    if (!submittedDraft) return;
    const textToCopy = `Inquiry for Deepu Creations:\n\nName: ${submittedDraft.name}\nEmail: ${submittedDraft.email}\nSubject: ${submittedDraft.enquiryType}\nMessage:\n${submittedDraft.message}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const getCustomWhatsAppLink = () => {
    if (!submittedDraft) return '#';
    const prefilledText = `Hello Deepu Creations! My name is ${submittedDraft.name} (${submittedDraft.email}). Regarding [${submittedDraft.enquiryType}]: ${submittedDraft.message}`;
    if (!businessConfig.contact.isWhatsappConfigured || businessConfig.contact.whatsappNumber.includes('[')) {
      return '#';
    }
    let cleanNumber = businessConfig.contact.whatsappNumber.replace(/[^0-9]/g, '');
    if (cleanNumber.length === 10) {
      cleanNumber = `91${cleanNumber}`;
    }
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(prefilledText)}`;
  };

  const getDirectMailtoLink = () => {
    if (!submittedDraft) return '#';
    const recipient = isEmailConfigured ? businessConfig.contact.email : 'deepu.momenta.creations@gmail.com';
    const subject = encodeURIComponent(`[${submittedDraft.enquiryType}] Inquiry from ${submittedDraft.name}`);
    const body = encodeURIComponent(
      `Name: ${submittedDraft.name}\nEmail: ${submittedDraft.email}\nType: ${submittedDraft.enquiryType}\n\nMessage:\n${submittedDraft.message}`
    );
    return `mailto:${recipient}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-[#F6F0E7] bg-crochet-pattern py-8 sm:py-14 px-4 sm:px-6 lg:px-8 pb-24 md:pb-14">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Contact Introduction Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0C9CB]/40 border border-[#D99AA3]/30 text-[#6E3947] text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Atelier Direct Communication</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#321923] tracking-tight">
            Get in Touch with Deepu Creations
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5B54] leading-relaxed">
            Have a custom design concept, question regarding yarn palettes, or special event request? We welcome your inquiries and are delighted to help weave your vision into reality.
          </p>
        </div>

        {/* Contact Channels Grid (WhatsApp, Instagram, Business Email) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* WhatsApp Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#E6D7CD] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#25D366]/15 border border-[#25D366]/30 flex items-center justify-center text-[#1E7E34]">
                <MessageCircle className="w-6 h-6 text-[#25D366]" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-semibold text-[#321923]">
                  Direct WhatsApp
                </h2>
                <p className="text-xs text-[#8E987E] mt-1">
                  Fastest response for custom order status, photo confirmations, and color swatches.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#F6F0E7]">
              {whatsapp.isReady ? (
                <a
                  href={whatsapp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-auto opacity-70" />
                </a>
              ) : (
                <div className="p-3 rounded-xl bg-[#FAF6F0] border border-[#E6D7CD] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#6E3947]">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Setup Required</span>
                  </div>
                  <p className="text-[11px] text-[#8E987E]">
                    Business phone: <code className="font-mono text-[#321923]">{businessConfig.contact.whatsappNumber}</code>
                  </p>
                  <p className="text-[10px] text-[#8E987E] italic">
                    Contact channel awaiting official business activation.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Instagram Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#E6D7CD] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#E1306C]/10 border border-[#E1306C]/30 flex items-center justify-center text-[#E1306C]">
                <InstagramIcon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-semibold text-[#321923]">
                  Instagram Atelier
                </h2>
                <p className="text-xs text-[#8E987E] mt-1">
                  Follow behind-the-scenes reels, upcoming color drops, and community highlights.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#F6F0E7]">
              {instagram.isReady ? (
                <a
                  href={instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#6E3947] hover:bg-[#522734] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <InstagramIcon className="w-4 h-4" />
                  <span>Visit Instagram Profile</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-auto opacity-70" />
                </a>
              ) : (
                <div className="p-3 rounded-xl bg-[#FAF6F0] border border-[#E6D7CD] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#6E3947]">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Setup Required</span>
                  </div>
                  <p className="text-[11px] text-[#8E987E]">
                    Profile URL: <code className="font-mono text-[#321923]">{businessConfig.contact.instagramUrl}</code>
                  </p>
                  <p className="text-[10px] text-[#8E987E] italic">
                    Official Instagram handle awaiting confirmation.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Official Email Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#E6D7CD] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#522734] border border-[#F0C9CB]/20 flex items-center justify-center text-[#F0C9CB]">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-semibold text-[#321923]">
                  Atelier Email
                </h2>
                <p className="text-xs text-[#8E987E] mt-1">
                  Ideal for detailed wedding keepsakes, wholesale, and formal collaborations.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#F6F0E7]">
              {isEmailConfigured ? (
                <a
                  href={`mailto:${businessConfig.contact.email}`}
                  className="w-full py-2.5 px-4 rounded-xl border border-[#6E3947] text-[#6E3947] hover:bg-[#6E3947] hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{businessConfig.contact.email}</span>
                </a>
              ) : (
                <div className="p-3 rounded-xl bg-[#FAF6F0] border border-[#E6D7CD] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#6E3947]">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Setup Required</span>
                  </div>
                  <p className="text-[11px] text-[#8E987E]">
                    Contact Email: <code className="font-mono text-[#321923]">{businessConfig.contact.email}</code>
                  </p>
                  <p className="text-[10px] text-[#8E987E] italic">
                    Awaiting confirmation of official business domain email.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Section: Contact Form + Atelier Guarantees */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#E6D7CD] shadow-sm">
            <div className="mb-6 pb-4 border-b border-[#F6F0E7]">
              <h2 className="font-serif text-2xl font-semibold text-[#321923]">
                Send an Atelier Message
              </h2>
              <p className="text-xs text-[#8E987E] mt-1">
                Fill in the details below. All fields marked with * are required.
              </p>
            </div>

            {/* Display setup-required state / draft container if form has been submitted */}
            {submittedDraft ? (
              <div className="space-y-5 animate-fadeIn">
                <div className="p-5 rounded-2xl bg-[#FAF6F0] border-2 border-[#D99AA3] space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#6E3947]">
                    <ShieldCheck className="w-5 h-5 text-[#6E3947]" />
                    <span>Integration Boundary Notice (Setup Required)</span>
                  </div>
                  <p className="text-xs text-[#6B5B54] leading-relaxed">
                    In accordance with honest system verification, an external email dispatch service (e.g. SMTP, SendGrid, or AWS SES) is <strong>not yet configured</strong> for this project environment.
                  </p>
                  <p className="text-xs text-[#321923] font-medium">
                    Your inquiry has been formulated and preserved below so no details are lost. You can instantly transmit it via WhatsApp or open it in your email application:
                  </p>

                  {/* Summary of drafted inquiry */}
                  <div className="p-3.5 rounded-xl bg-white border border-[#E6D7CD] text-xs font-mono space-y-1.5 text-[#392923]">
                    <p><strong>From:</strong> {submittedDraft.name} ({submittedDraft.email})</p>
                    <p><strong>Subject:</strong> {submittedDraft.enquiryType}</p>
                    <p className="pt-1 text-[#6B5B54] whitespace-pre-wrap"><strong>Message:</strong> "{submittedDraft.message}"</p>
                  </div>

                  {/* Honest Action Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                    {businessConfig.contact.isWhatsappConfigured && !businessConfig.contact.whatsappNumber.includes('[') ? (
                      <a
                        href={getCustomWhatsAppLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Send via WhatsApp</span>
                      </a>
                    ) : null}

                    <a
                      href={getDirectMailtoLink()}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-[#6E3947] hover:bg-[#522734] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Open in Email App</span>
                    </a>

                    <button
                      type="button"
                      onClick={handleCopyDraft}
                      className="py-2.5 px-4 rounded-xl border border-[#D99AA3] text-[#6E3947] hover:bg-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {copiedNotification ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-[#78816A]" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Message</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedDraft(null);
                      setForm({
                        name: '',
                        email: '',
                        enquiryType: 'custom_order',
                        message: '',
                        honeypot: '',
                      });
                      setTouched({});
                      setErrors({});
                    }}
                    className="text-xs text-[#6E3947] hover:underline cursor-pointer"
                  >
                    ← Formulate Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Honeypot field (hidden from real users, caught by spam bots) */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="website_url">Website</label>
                  <input
                    type="text"
                    id="website_url"
                    name="honeypot"
                    value={form.honeypot}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {/* Name Field */}
                <div>
                  <label
                    htmlFor="contact_name"
                    className="block text-xs font-semibold text-[#321923] mb-1.5"
                  >
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="contact_name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    onBlur={() => handleBlur('name')}
                    placeholder="e.g. Aditi Sharma"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'contact_name_error' : undefined}
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm text-[#392923] transition-colors focus:outline-none focus:ring-2 ${
                      errors.name
                        ? 'border-red-400 bg-red-50/30 focus:ring-red-300'
                        : 'border-[#E6D7CD] bg-[#FAF6F0]/60 focus:bg-white focus:ring-[#6E3947]/30'
                    }`}
                  />
                  {errors.name && (
                    <p id="contact_name_error" className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label
                    htmlFor="contact_email"
                    className="block text-xs font-semibold text-[#321923] mb-1.5"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="contact_email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={() => handleBlur('email')}
                    placeholder="e.g. aditi@example.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'contact_email_error' : undefined}
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm text-[#392923] transition-colors focus:outline-none focus:ring-2 ${
                      errors.email
                        ? 'border-red-400 bg-red-50/30 focus:ring-red-300'
                        : 'border-[#E6D7CD] bg-[#FAF6F0]/60 focus:bg-white focus:ring-[#6E3947]/30'
                    }`}
                  />
                  {errors.email && (
                    <p id="contact_email_error" className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* Subject / Enquiry Type */}
                <div>
                  <label
                    htmlFor="contact_enquiryType"
                    className="block text-xs font-semibold text-[#321923] mb-1.5"
                  >
                    Enquiry Subject <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="contact_enquiryType"
                    name="enquiryType"
                    value={form.enquiryType}
                    onChange={handleChange}
                    onBlur={() => handleBlur('enquiryType')}
                    aria-invalid={!!errors.enquiryType}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E6D7CD] bg-[#FAF6F0]/60 focus:bg-white text-xs sm:text-sm text-[#392923] focus:outline-none focus:ring-2 focus:ring-[#6E3947]/30"
                  >
                    <option value="custom_order">Custom Bouquet / Heirloom Commission</option>
                    <option value="plushie_inquiry">Bespoke Bunny Plushie / Bag Charm</option>
                    <option value="order_status">Existing Order Tracking & Dispatch</option>
                    <option value="bridal_bulk">Wedding Keepsakes & Bulk Gifting</option>
                    <option value="collaboration">Studio Collaboration / Wholesale</option>
                    <option value="general">General Question</option>
                  </select>
                </div>

                {/* Message Field */}
                <div>
                  <label
                    htmlFor="contact_message"
                    className="block text-xs font-semibold text-[#321923] mb-1.5"
                  >
                    Detailed Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="contact_message"
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    onBlur={() => handleBlur('message')}
                    placeholder="Tell us about your desired color palette, timeline, floral arrangements, or questions..."
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'contact_message_error' : undefined}
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm text-[#392923] transition-colors focus:outline-none focus:ring-2 resize-y ${
                      errors.message
                        ? 'border-red-400 bg-red-50/30 focus:ring-red-300'
                        : 'border-[#E6D7CD] bg-[#FAF6F0]/60 focus:bg-white focus:ring-[#6E3947]/30'
                    }`}
                  />
                  <div className="flex justify-between items-center text-[10px] text-[#8E987E] mt-1">
                    <span>Minimum 10 characters</span>
                    <span>{form.message.length} chars</span>
                  </div>
                  {errors.message && (
                    <p id="contact_message_error" className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.message}</span>
                    </p>
                  )}
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-full bg-[#6E3947] hover:bg-[#522734] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Verifying & Preparing Submission...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message to Atelier</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Common Questions & Inquiries Guide */}
          <div className="lg:col-span-5 space-y-6">

            {/* Quick Consultation Notes */}
            <div className="bg-white rounded-3xl p-6 border border-[#E6D7CD] shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#6E3947]" />
                <h3 className="font-serif text-base font-semibold text-[#321923]">
                  Common Questions
                </h3>
              </div>

              <div className="space-y-3 text-xs text-[#6B5B54]">
                <div>
                  <p className="font-semibold text-[#321923] mb-0.5">How long does a custom piece take?</p>
                  <p className="text-[11px] leading-relaxed">
                    Typically 5–10 crafting days depending on stitch complexity, followed by protective tracked shipping.
                  </p>
                </div>

                <div className="pt-2 border-t border-[#F6F0E7]">
                  <p className="font-semibold text-[#321923] mb-0.5">Can I request specific yarn colors?</p>
                  <p className="text-[11px] leading-relaxed">
                    Yes! Visit our interactive 3D Custom Studio or describe your shade preferences in your message.
                  </p>
                </div>

                <div className="pt-2 border-t border-[#F6F0E7]">
                  <p className="font-semibold text-[#321923] mb-0.5">Need urgent wedding or anniversary gifts?</p>
                  <p className="text-[11px] leading-relaxed">
                    Check our "Ready to Ship" stock filter in the shop for pieces ready for immediate dispatch.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
