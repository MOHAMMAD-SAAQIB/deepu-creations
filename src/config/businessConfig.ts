/**
 * Deepu Creations — Official Business Configuration
 * 
 * Official brand parameters confirmed by business:
 * - Brand Name: Deepu Creations
 * - Slogan: Beautiful, premium handmade and customized creations made especially for birthdays, anniversaries, weddings, and life's personal moments.
 * - Instagram: https://www.instagram.com/deepu_momenta_creations
 * - WhatsApp: +91 9703265096
 * - Email: deepu.momenta.creations@gmail.com
 */

export interface BusinessConfig {
  brandName: string;
  slogan: string;
  isSloganConfigured: boolean;
  logoUrl: string;
  isLogoConfigured: boolean;
  
  contact: {
    whatsappNumber: string;
    isWhatsappConfigured: boolean;
    email: string;
    isEmailConfigured: boolean;
    instagramUrl: string;
    isInstagramConfigured: boolean;
    locationNote: string;
  };

  policies: {
    shippingPolicy: string;
    isShippingConfigured: boolean;
    returnPolicy: string;
    isReturnConfigured: boolean;
    customOrderTerms: string;
  };

  makerStory: {
    isStoryConfigured: boolean;
    makerName: string;
    storyContent: string;
  };

  currency: {
    symbol: string;
    code: string;
  };
}

export const businessConfig: BusinessConfig = {
  brandName: "Deepu Creations",
  slogan: "Beautiful, premium handmade and customized creations made especially for birthdays, anniversaries, weddings, and life's personal moments.",
  isSloganConfigured: true,
  logoUrl: "[OFFICIAL_LOGO]",
  isLogoConfigured: false,

  contact: {
    whatsappNumber: "+91 9703265096",
    isWhatsappConfigured: true,
    email: "deepu.momenta.creations@gmail.com",
    isEmailConfigured: true,
    instagramUrl: "https://www.instagram.com/deepu_momenta_creations",
    isInstagramConfigured: true,
    locationNote: "Handcrafted with artisanal care • Made in Studio",
  },

  policies: {
    shippingPolicy: "Standard shipping calculation will be finalized upon order confirmation. Express dispatch available upon request.",
    isShippingConfigured: false,
    returnPolicy: "Due to the intimate, handcrafted nature of custom crochet heirlooms, returns are evaluated on a case-by-case basis. Damaged or defective items are replaced with priority.",
    isReturnConfigured: false,
    customOrderTerms: "Custom orders require 5-10 crafting days depending on stitch complexity. A design approval review is shared before final yarn knotting.",
  },

  makerStory: {
    isStoryConfigured: false,
    makerName: "The Maker at Deepu Creations",
    storyContent: "Deepu Creations was born out of a profound passion for the timeless art of crochet. Every stitch is woven with mindful intentionality, turning delicate strands of luxury cotton and wool into heirloom memories, vibrant floral bouquets, and cozy companions.",
  },

  currency: {
    symbol: "₹",
    code: "INR",
  },
};

/**
 * Helper to generate a prefilled WhatsApp link safely
 */
export function getWhatsAppLink(prefilledMessage?: string): { url: string; isReady: boolean } {
  if (!businessConfig.contact.isWhatsappConfigured || businessConfig.contact.whatsappNumber.includes("[")) {
    return {
      url: "#",
      isReady: false,
    };
  }
  let cleanNumber = businessConfig.contact.whatsappNumber.replace(/[^0-9]/g, "");
  // Prepend India country code (91) if 10-digit standard Indian mobile number
  if (cleanNumber.length === 10) {
    cleanNumber = `91${cleanNumber}`;
  }
  const encodedMsg = prefilledMessage ? encodeURIComponent(prefilledMessage) : "";
  return {
    url: `https://wa.me/${cleanNumber}${encodedMsg ? `?text=${encodedMsg}` : ""}`,
    isReady: true,
  };
}

/**
 * Helper to get Instagram URL safely
 */
export function getInstagramLink(): { url: string; isReady: boolean } {
  if (!businessConfig.contact.isInstagramConfigured || businessConfig.contact.instagramUrl.includes("[")) {
    return {
      url: "#",
      isReady: false,
    };
  }
  return {
    url: businessConfig.contact.instagramUrl,
    isReady: true,
  };
}
