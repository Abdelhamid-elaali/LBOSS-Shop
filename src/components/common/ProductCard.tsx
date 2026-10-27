import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import type { Product } from '../../types';
import { formatPrice, calculateOriginalPrice } from '../../lib/utils';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addToCart } from '../../features/cart/cartSlice';
import { toggleWishlist, selectIsInWishlist } from '../../features/wishlist/wishlistSlice';
import { setQuickViewProductId, selectCurrency } from '../../features/ui/uiSlice';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const isInWishlist = useAppSelector(selectIsInWishlist(product.id));
  const currency = useAppSelector(selectCurrency);

  const originalPrice = calculateOriginalPrice(product.price, product.discountPercentage);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    dispatch(addToCart({ product, quantity: product.minimumOrderQuantity || 1 }));
    toast.success(`Acquired: "${product.title}" added to cart!`, {
      icon: '⚡',
      style: {
        borderRadius: '12px',
        background: '#181b24',
        color: '#ffd88a',
        border: '1px solid rgba(245, 183, 0, 0.3)',
        fontFamily: 'JetBrains Mono',
      },
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(product));
    if (isInWishlist) {
      toast('De-indexed from Private Wishlist', {
        icon: '🤍',
        style: { background: '#181b24', color: '#d4c5ac', fontFamily: 'JetBrains Mono' },
      });
    } else {
      toast.success('Indexed into Private Wishlist', {
        icon: '❤️',
        style: { background: '#181b24', color: '#cabeff', fontFamily: 'JetBrains Mono' },
      });
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(setQuickViewProductId(product.id));
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="group relative flex flex-col rounded-none bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[#f5b700]/50 shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_32px_-8px_rgba(245,183,0,0.18)] overflow-hidden transition-all duration-300"
    >
      {/* Top badges & action buttons */}
      <div className="relative aspect-square w-full bg-[var(--bg-inset)] overflow-hidden flex items-center justify-center">
        {/* Ambient radial lighting vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,183,0,0.06)_0%,rgba(0,0,0,0.4)_75%)] pointer-events-none" />

        {/* Discount badge */}
        {product.discountPercentage > 0 && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center px-2 py-0.5 rounded-none text-[11px] font-bold font-['JetBrains_Mono'] tracking-tight bg-gradient-to-r from-[#ffd88a] via-[#fbbc0e] to-[#cabeff] text-[#0b0e16] shadow-[0_0_12px_rgba(245,183,0,0.3)]">
              -{Math.round(product.discountPercentage)}%
            </span>
          </div>
        )}

        {/* Scarcity / Stock badge */}
        {isOutOfStock ? (
          <div className="absolute top-3 right-12 z-10">
            <span className="inline-flex items-center px-2 py-0.5 rounded-none text-[10px] font-['JetBrains_Mono'] font-bold bg-[#ffb4ab]/15 text-[#ffb4ab] border border-[#ffb4ab]/30">
              ALLOCATION DEPLETED
            </span>
          </div>
        ) : isLowStock ? (
          <div className="absolute top-3 right-12 z-10">
            <span className="inline-flex items-center px-2 py-0.5 rounded-none text-[10px] font-['JetBrains_Mono'] font-bold bg-[#f5b700]/15 text-[#ffd88a] border border-[#f5b700]/30 animate-pulse">
              ONLY {product.stock} REMAIN
            </span>
          </div>
        ) : null}

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 z-10 p-2 rounded-none bg-[var(--bg-surface-elevated)]/80 backdrop-blur-md text-[var(--text-secondary)] hover:text-[#ffd88a] border border-[var(--border-subtle)] transition-transform active:scale-90 cursor-pointer"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isInWishlist ? 'fill-[#cabeff] text-[#cabeff]' : ''
            }`}
          />
        </button>

        {/* Image link */}
        <Link to={`/products/${product.id}`} className="block w-full h-full relative z-0">
          <img
            src={product.thumbnail || product.images?.[0]}
            alt={product.title}
            loading="lazy"
            width={400}
            height={400}
            className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Quick View Button on hover */}
        <button
          onClick={handleQuickView}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 px-3.5 py-1.5 rounded-none bg-[var(--bg-surface-elevated)]/90 text-[var(--text-primary)] text-xs font-['JetBrains_Mono'] border border-[var(--border-subtle)] shadow-lg flex items-center gap-1.5 backdrop-blur-md hover:border-[#ffd88a] hover:text-[#ffd88a] cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 text-[#f5b700]" />
          <span>Quick Dossier</span>
        </button>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-5 bg-[var(--bg-surface)]">
        {/* Category & Brand Telemetry */}
        <div className="flex items-center justify-between text-[11px] font-['JetBrains_Mono'] text-[var(--text-secondary)] mb-1.5">
          <span className="uppercase tracking-wider truncate max-w-[120px]">
            {product.category?.replace(/-/g, ' ')}
          </span>
          {product.brand && (
            <span className="truncate max-w-[100px] font-medium text-[var(--text-secondary)]">
              {product.brand}
            </span>
          )}
        </div>

        {/* Title */}
        <Link
          to={`/products/${product.id}`}
          className="font-['Sora'] font-bold text-sm line-clamp-2 text-[var(--text-primary)] hover:text-[#ffd88a] transition-colors mb-2 leading-snug"
          title={product.title}
        >
          {product.title}
        </Link>

        {/* Star Rating & Reviews */}
        <div className="flex items-center gap-1.5 mb-4">
          <div className="flex items-center text-[#f5b700]">
            <Star className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="font-['JetBrains_Mono'] text-xs font-bold text-[var(--text-primary)]">
            {product.rating?.toFixed(1) || '4.9'}
          </span>
          <span className="font-['JetBrains_Mono'] text-[11px] text-[var(--text-secondary)]">
            ({product.reviews?.length || 18} verify)
          </span>
        </div>

        {/* Price & Add to Cart button */}
        <div className="mt-auto pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-['JetBrains_Mono'] text-base font-extrabold text-[#ffd88a]">
                {formatPrice(product.price, currency.code, currency.rate)}
              </span>
              {product.discountPercentage > 0 && (
                <span className="font-['JetBrains_Mono'] text-xs text-[var(--text-secondary)] line-through">
                  {formatPrice(originalPrice, currency.code, currency.rate)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-label="Add to cart"
            className="p-2.5 rounded-none bg-[#f5b700] hover:bg-[#ffd88a] text-[#402d00] transition-all duration-200 active:scale-95 disabled:opacity-30 disabled:pointer-events-none shadow-[0_4px_16px_rgba(245,183,0,0.3)] cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
