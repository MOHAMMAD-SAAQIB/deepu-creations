import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Sparkles } from 'lucide-react';
import { Product } from '../../data/products';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { NeutralProductPlaceholder } from './NeutralProductPlaceholder';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const isFav = isInWishlist(product.id);
  const [imageError, setImageError] = React.useState(false);

  const hasImage = Boolean(product.images && product.images.length > 0 && product.images[0] && !imageError);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, {
      color: product.colors[0]?.name,
      colorHex: product.colors[0]?.hex,
      size: product.sizes?.[0],
      quantity: 1,
    });
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-[#E6D7CD]/80 shadow-xs hover:shadow-xl hover:border-[#D99AA3]/60 transition-all duration-300 flex flex-col">
      {/* Image container */}
      <Link to={`/product/${product.slug}`} className="relative aspect-square overflow-hidden bg-[#F6F0E7] block">
        {hasImage ? (
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <NeutralProductPlaceholder size="md" message="Awaiting image upload" />
        )}

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-semibold tracking-wider bg-[#FAF6F0]/95 text-[#6E3947] border border-[#F0C9CB] shadow-xs backdrop-blur-xs">
              {product.badge}
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-200 shadow-sm ${
            isFav
              ? 'bg-[#6E3947] text-white'
              : 'bg-white/90 text-[#392923] hover:text-[#6E3947] hover:bg-white'
          }`}
          aria-label={isFav ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
        </button>

        {/* Floating Quick Action overlay on desktop hover */}
        <div className="absolute inset-x-3 bottom-3 z-10 hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 gap-2">
          <button
            onClick={handleQuickAdd}
            className="flex-1 py-2 px-3 rounded-full bg-[#6E3947]/95 hover:bg-[#522734] text-white text-xs font-medium shadow-md backdrop-blur-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Quick Add</span>
          </button>
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-[#78816A] mb-1">
            <span className="uppercase tracking-wider font-medium">{product.categoryLabel}</span>
            {product.inStock ? (
              <span className="text-[#78816A] text-[10px] font-medium flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#78816A] inline-block" />
                In Stock
              </span>
            ) : (
              <span className="text-[#991B1B] text-[10px] font-medium">Made to Order</span>
            )}
          </div>

          <Link to={`/product/${product.slug}`} className="block">
            <h3 className="font-serif text-base sm:text-lg font-semibold text-[#321923] group-hover:text-[#6E3947] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Color preview dots */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1 mt-2">
              {product.colors.slice(0, 4).map((c, i) => (
                <span
                  key={i}
                  className="w-2.5 h-2.5 rounded-full border border-black/15 shadow-2xs"
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-[10px] text-[#8E987E] font-medium ml-0.5">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Price & Mobile Add Button */}
        <div className="mt-3 pt-2.5 border-t border-[#F6F0E7] flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-base sm:text-lg font-bold text-[#321923]">
                {product.currencySymbol}
                {product.price.toLocaleString()}
              </span>
              {product.isPricePlaceholder && (
                <span className="text-[9px] uppercase tracking-wider font-mono text-[#8E987E] bg-[#FAF6F0] px-1 rounded border border-[#E6D7CD]">
                  catalog
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleQuickAdd}
            className="sm:hidden p-2 rounded-full bg-[#6E3947] text-white active:scale-95 transition-transform"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
