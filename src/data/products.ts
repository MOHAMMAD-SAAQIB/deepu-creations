export interface ProductVariant {
  id: string;
  name: string;
  colorHex?: string;
  priceModifier?: number;
  inStock: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categoryLabel: string;
  price: number;
  isPricePlaceholder: boolean;
  currencySymbol: string;
  description: string;
  shortDescription: string;
  images: string[];
  inStock: boolean;
  badge?: string;
  featured?: boolean;
  colors: { name: string; hex: string }[];
  sizes?: string[];
  materials: string[];
  dimensions: string;
  craftingTime: string;
  careInstructions: string[];
  shippingNotice: string;
  isDemoAsset: boolean;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  count?: number;
  image?: string;
  tagline?: string;
}

export const CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    slug: 'bouquets',
    name: 'Bouquets',
    count: 3,
    image: '/images/tulip_bouquet.jpg',
    tagline: 'Everlasting floral blooms crocheted stitch by stitch',
  },
  {
    id: 'cat-2',
    slug: 'plushies',
    name: 'Plushies',
    count: 1,
    image: '/images/bunny_plush.jpg',
    tagline: 'Gentle companions and nursery heirloom keepsakes',
  },
  {
    id: 'cat-3',
    slug: 'accessories',
    name: 'Accessories',
    count: 2,
    image: '/images/tote_bag.jpg',
    tagline: 'Bespoke totes, bag charms, and wearable yarn artistry',
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod-tulip-bouquet',
    name: 'Artisan Tulip Bouquet',
    slug: 'artisan-tulip-bouquet',
    category: 'bouquets',
    categoryLabel: 'Bouquets',
    price: 1499,
    isPricePlaceholder: true, // Clearly indicated as demo catalog price
    currencySymbol: '₹',
    shortDescription: 'A delicate arrangement of 7 hand-knitted pastel tulips wrapped in eco-kraft paper and tied with natural jute cord.',
    description: 'Each petal in our Artisan Tulip Bouquet is sculpted by hand using premium combed cotton yarn that maintains its crisp bloom forever. Never wilting, hypoallergenic, and crafted with delicate floral gradients, it brings everlasting warmth to any bedside, workspace, or celebration.',
    images: [
      '/images/tulip_bouquet.jpg',
      '/images/hero_banner.jpg',
    ],
    inStock: true,
    badge: 'Bestseller',
    featured: true,
    colors: [
      { name: 'Pastel Blush', hex: '#F0C9CB' },
      { name: 'Warm Peach', hex: '#F2D2BE' },
      { name: 'Dusty Rose', hex: '#D99AA3' },
      { name: 'Deep Burgundy', hex: '#6E3947' },
      { name: 'Lavender Mist', hex: '#C4B5FD' },
      { name: 'Sage Green', hex: '#78816A' },
    ],
    sizes: ['Single Stem (1)', 'Petite (3 Stems)', 'Classic (7 Stems)', 'Luxe (12 Stems)'],
    materials: ['100% Combed Milk Cotton Yarn', 'Reinforced Floral Wire Core', 'Organic Jute Tie', 'Recycled Kraft Wrapping'],
    dimensions: 'Approx. 34 cm height × 18 cm diameter',
    craftingTime: 'Handmade in 2–3 days',
    careInstructions: [
      'Gently dust with a soft makeup brush or blow with cool hairdryer on low.',
      'Spot clean with mild soapy water on a clean cloth; do not machine wash.',
      'Keep away from direct open flames or prolonged damp environments.',
    ],
    shippingNotice: 'Carefully cushioned in reinforced keepsake packaging to protect stem geometry during transit.',
    isDemoAsset: true,
  },
  {
    id: 'prod-bunny-plush',
    name: 'Heirloom Crochet Bunny',
    slug: 'heirloom-crochet-bunny',
    category: 'plushies',
    categoryLabel: 'Plushies',
    price: 1899,
    isPricePlaceholder: true,
    currencySymbol: '₹',
    shortDescription: 'Cuddle-soft bunny plushie with floppy textured ears, rosy embroidered cheeks, and a dainty knitted ribbon.',
    description: 'Our signature Heirloom Bunny is crocheted with ultra-soft baby-grade organic wool blend yarn. Featuring child-safe embroidered features, hypoallergenic polyester fiberfill, and comforting weight, this plush is designed to be cherished across generations.',
    images: [
      '/images/bunny_plush.jpg',
    ],
    inStock: true,
    badge: 'Popular',
    featured: true,
    colors: [
      { name: 'Cream Ivory', hex: '#F6F0E7' },
      { name: 'Warm Taupe', hex: '#D4C3B3' },
      { name: 'Blush Pink', hex: '#F0C9CB' },
      { name: 'Honey Wheat', hex: '#E6C594' },
    ],
    sizes: ['Petite (18 cm)', 'Classic (26 cm)', 'Jumbo (36 cm)'],
    materials: ['Super-soft Organic Milk Cotton & Wool Blend', 'Child-Safe Embroidered Eyes', 'Hypoallergenic Virgin Fiberfill'],
    dimensions: '26 cm sitting height × 14 cm width',
    craftingTime: 'Handmade in 3–4 days',
    careInstructions: [
      'Hand wash gently in lukewarm water with mild wool detergent.',
      'Reshape gently and lay flat on a dry towel in the shade to dry.',
      'Do not wring, bleach, or tumble dry.',
    ],
    shippingNotice: 'Comes nestled in a protective breathable cotton drawstring gift bag.',
    isDemoAsset: true,
  },
  {
    id: 'prod-rose-bouquet',
    name: 'Burgundy Velvet Rose Bouquet',
    slug: 'burgundy-velvet-rose-bouquet',
    category: 'bouquets',
    categoryLabel: 'Bouquets',
    price: 1999,
    isPricePlaceholder: true,
    currencySymbol: '₹',
    shortDescription: 'A rich bouquet of crimson and burgundy crochet roses with lifelike calyxes and deep emerald leaves.',
    description: 'Inspired by romantic vintage gardens, the Burgundy Velvet Rose Bouquet features intricately layered petals crocheted with rich heathered wine yarns. Each rosebud is sculpted to capture the spiraling beauty of fresh roses.',
    images: [
      '/images/rose_bouquet.jpg',
    ],
    inStock: true,
    badge: 'Artisan Choice',
    featured: true,
    colors: [
      { name: 'Deep Burgundy', hex: '#6E3947' },
      { name: 'Classic Crimson', hex: '#991B1B' },
      { name: 'Vintage Rose', hex: '#D99AA3' },
      { name: 'Champagne Cream', hex: '#F6F0E7' },
    ],
    sizes: ['Trio (3 Roses)', 'Half Dozen (6 Roses)', 'Full Dozen (12 Roses)'],
    materials: ['High-Twist Cotton Yarn', 'Inner Floral Support Stems', 'Artisanal Kraft Sleeve'],
    dimensions: 'Approx. 38 cm height × 22 cm width',
    craftingTime: 'Handmade in 3–5 days',
    careInstructions: [
      'Lightly dust periodically to preserve the rich wine dye vibrancy.',
      'Avoid high moisture areas to maintain petal tension.',
    ],
    shippingNotice: 'Ships securely anchored in customized box to prevent flattening.',
    isDemoAsset: true,
  },
  {
    id: 'prod-sunflower-bouquet',
    name: 'Radiant Sunflower Cluster',
    slug: 'radiant-sunflower-cluster',
    category: 'bouquets',
    categoryLabel: 'Bouquets',
    price: 1699,
    isPricePlaceholder: true,
    currencySymbol: '₹',
    shortDescription: 'Bright joyful crochet sunflowers with detailed ribbed spiral disc florets and sturdy emerald leaves.',
    description: 'Bring perpetual golden hour into your home. Our Radiant Sunflower Cluster combines textured dark-chocolate yarn centers with double-layered bright marigold petals, symbolizing joy, loyalty, and sunshine.',
    images: [
      '/images/sunflower_bouquet.jpg',
    ],
    inStock: true,
    badge: 'Cheerful',
    featured: true,
    colors: [
      { name: 'Golden Marigold', hex: '#EAB308' },
      { name: 'Tuscan Amber', hex: '#D97706' },
      { name: 'Honey Ochre', hex: '#CA8A04' },
    ],
    sizes: ['Single Statement (1 Large)', 'Boutique Trio (3 Stems)', 'Meadow Bunch (5 Stems)'],
    materials: ['100% Breathable Cotton', 'Textured Wool Center', 'Flexible Floral Wire'],
    dimensions: 'Approx. 36 cm height × 20 cm width',
    craftingTime: 'Handmade in 2–3 days',
    careInstructions: ['Wipe gently with dry microfiber cloth.'],
    shippingNotice: 'Wrapped with decorative paper and branded craft tags.',
    isDemoAsset: true,
  },
  {
    id: 'prod-heart-keychain',
    name: 'Puffy Heart Charm Keychain',
    slug: 'puffy-heart-charm-keychain',
    category: 'accessories',
    categoryLabel: 'Accessories',
    price: 399,
    isPricePlaceholder: true,
    currencySymbol: '₹',
    shortDescription: 'Whimsical 3D puffed crochet heart charm with antique brass hardware and tassel accent.',
    description: 'An adorable tactile companion for keys, backpacks, or tote bags. Crocheted in seamless rounds with a dense plush feel and fitted with a sturdy antique brass swivel clasp.',
    images: [
      '/images/heart_keychain.jpg',
    ],
    inStock: true,
    badge: 'Gifting Favorite',
    featured: false,
    colors: [
      { name: 'Blush Pink', hex: '#F0C9CB' },
      { name: 'Dusty Rose', hex: '#D99AA3' },
      { name: 'Deep Plum', hex: '#321923' },
      { name: 'Sage Green', hex: '#78816A' },
      { name: 'Warm Ivory', hex: '#F6F0E7' },
    ],
    sizes: ['Standard (7 cm × 6 cm)'],
    materials: ['Mercerized Cotton Yarn', 'Antique Brass Swivel Lobster Clasp', 'Polyester Fiberfill'],
    dimensions: '7 cm × 6.5 cm (excluding 4 cm hardware)',
    craftingTime: 'Handmade in 1 day',
    careInstructions: ['Spot clean gently with damp cloth.'],
    shippingNotice: 'Packaged in a miniature kraft pillow pouch.',
    isDemoAsset: true,
  },
  {
    id: 'prod-tote-bag',
    name: 'Diamond Weave Crochet Tote',
    slug: 'diamond-weave-crochet-tote',
    category: 'accessories',
    categoryLabel: 'Accessories',
    price: 2499,
    isPricePlaceholder: true,
    currencySymbol: '₹',
    shortDescription: 'Spacious textured tote bag with raised geometric diamond stitching and reinforced rope handles.',
    description: 'Elevate everyday errands with this bohemian luxury crochet tote. Features thick structural cotton cord stitches in warm oatmeal and blush tones, comfortable twisted cord handles, and reinforced base structure.',
    images: [
      '/images/tote_bag.jpg',
    ],
    inStock: true,
    badge: 'Artisan Bag',
    featured: false,
    colors: [
      { name: 'Oatmeal & Blush', hex: '#D99AA3' },
      { name: 'Earthy Sage & Cream', hex: '#78816A' },
      { name: 'Classic Cocoa & Ivory', hex: '#392923' },
    ],
    sizes: ['Medium Day Tote (32 × 28 cm)', 'Large Weekend Bag (40 × 34 cm)'],
    materials: ['Heavy-Duty Cotton Rope Cord', 'Genuine Leather Handle Straps', 'Brass Rivets'],
    dimensions: '34 cm width × 30 cm height × 12 cm depth (strap drop 22 cm)',
    craftingTime: 'Handmade in 5–7 days',
    careInstructions: [
      'Spot clean with gentle fabric soap.',
      'Do not machine wash or soak leather tabs.',
    ],
    shippingNotice: 'Shipped flat in protective cotton dust cover.',
    isDemoAsset: true,
  },
];
