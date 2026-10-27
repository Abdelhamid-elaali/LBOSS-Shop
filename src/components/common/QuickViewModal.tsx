import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Star, ShoppingBag, Heart, ShieldCheck, Truck, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectQuickViewProductId, setQuickViewProductId, selectCurrency } from '../../features/ui/uiSlice';
import { useGetProductByIdQuery } from '../../features/api/apiSlice';
import { addToCart } from '../../features/cart/cartSlice';
import { toggleWishlist, selectIsInWishlist } from '../../features/wishlist/wishlistSlice';
import { formatPrice, calculateOriginalPrice } from '../../lib/utils';
import { Button } from '../ui/Button';

export const QuickViewModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const productId = useAppSelector(selectQuickViewProductId);
  const currency = useAppSelector(selectCurrency);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading } = useGetProductByIdQuery(productId || 0, {
    skip: !productId,
  });

  const isInWishlist = useAppSelector(selectIsInWishlist(product?.id || 0));

  const handleClose = () => {
    dispatch(setQuickViewProductId(null));
    setSelectedImageIndex(0);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addToCart({ product, quantity }));
    toast.success(`Acquired: ${quantity} × "${product.title}" added to cart!`, {
      style: {
        background: '#181b24',
        color: '#ffd88a',
        fontFamily: 'JetBrains Mono',
        border: '1px solid rgba(245, 183, 0, 0.4)',
      },
    });
    handleClose();
  };

  return (
    <AnimatePresence>
      {productId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-3xl bg-[#14171f] border border-white/10 rounded-none shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden z-10"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-none bg-[#1c1f28] text-[#9c8f78] hover:text-[#e0e2ed] hover:bg-[#272a32] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {isLoading || !product ? (
              <div className="p-16 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#f5b700] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Images column */}
                <div className="p-6 bg-[#0b0e16] flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5">
                  <div className="aspect-square w-full rounded-none bg-[#10131b] p-6 border border-white/5 flex items-center justify-center overflow-hidden">
                    <img
                      src={
                        product.images?.[selectedImageIndex] ||
                        product.thumbnail ||
                        ''
                      }
                      alt={product.title}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {product.images && product.images.length > 1 && (
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                      {product.images.slice(0, 5).map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImageIndex(idx)}
                          className={`w-14 h-14 rounded-none border p-1 shrink-0 bg-[#181b24] overflow-hidden cursor-pointer ${
                            selectedImageIndex === idx
                              ? 'border-[#f5b700] ring-1 ring-[#f5b700]/50'
                              : 'border-white/5 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={img}
                            alt=""
                            className="w-full h-full object-contain"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Info column */}
                <div className="p-6 md:p-8 flex flex-col justify-between bg-[#14171f]">
                  <div>
                    <div className="flex items-center justify-between font-['JetBrains_Mono'] text-xs text-[#ffd88a] font-bold tracking-wider uppercase mb-1">
                      <span>{product.category?.replace(/-/g, ' ')}</span>
                      {product.brand && (
                        <span className="text-[#9c8f78] font-normal">
                          {product.brand}
                        </span>
                      )}
                    </div>

                    <h2 className="font-['Sora'] text-xl font-bold text-[#e0e2ed] mb-2 leading-tight">
                      {product.title}
                    </h2>

                    {/* Rating & reviews */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center text-[#f5b700]">
                        <Star className="w-4 h-4 fill-current" />
                      </div>
                      <span className="font-['JetBrains_Mono'] text-sm font-bold text-[#e0e2ed]">
                        {product.rating?.toFixed(1)}
                      </span>
                      <span className="font-['JetBrains_Mono'] text-xs text-[#9c8f78]">
                        ({product.reviews?.length || 24} authenticated reviews)
                      </span>
                      <span className="font-['JetBrains_Mono'] text-[11px] text-[#22c55e] bg-[#22c55e]/10 border border-[#22c55e]/20 px-2 py-0.5 rounded-full font-semibold ml-2">
                        {product.availabilityStatus || 'Allocated'}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-3 mb-4">
                      <span className="font-['JetBrains_Mono'] text-2xl font-extrabold text-[#ffd88a]">
                        {formatPrice(product.price, currency.code, currency.rate)}
                      </span>
                      {product.discountPercentage > 0 && (
                        <>
                          <span className="font-['JetBrains_Mono'] text-sm text-[#9c8f78] line-through">
                            {formatPrice(
                              calculateOriginalPrice(
                                product.price,
                                product.discountPercentage
                              ),
                              currency.code,
                              currency.rate
                            )}
                          </span>
                          <span className="font-['JetBrains_Mono'] text-xs font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-[#ffd88a] via-[#fbbc0e] to-[#cabeff] text-[#0b0e16]">
                            Save {Math.round(product.discountPercentage)}%
                          </span>
                        </>
                      )}
                    </div>

                    <p className="font-['Manrope'] text-xs text-[#d4c5ac] line-clamp-3 mb-6 leading-relaxed">
                      {product.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 font-['JetBrains_Mono'] text-[11px] text-[#9c8f78] mb-6 py-3 border-y border-white/5">
                      <div className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-[#f5b700]" />
                        <span>{product.shippingInformation || 'Global Zero-Latency Dispatch'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#f5b700]" />
                        <span>{product.warrantyInformation || 'Aerospace Warranty'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity & CTA */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center rounded-xl border border-white/5 bg-[#181b24] p-1">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[#d4c5ac] hover:bg-[#272a32] hover:text-[#ffd88a]"
                        >
                          -
                        </button>
                        <span className="w-10 text-center font-['JetBrains_Mono'] text-sm font-bold text-[#e0e2ed]">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[#d4c5ac] hover:bg-[#272a32] hover:text-[#ffd88a]"
                        >
                          +
                        </button>
                      </div>

                      <Button
                        onClick={handleAddToCart}
                        variant="primary"
                        size="md"
                        className="flex-1 gap-2"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Acquire Asset</span>
                      </Button>

                      <button
                        onClick={() => dispatch(toggleWishlist(product))}
                        className="p-3 rounded-xl border border-white/5 bg-[#1c1f28] hover:bg-[#272a32] text-[#d4c5ac] hover:text-[#cabeff]"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            isInWishlist ? 'fill-[#cabeff] text-[#cabeff]' : ''
                          }`}
                        />
                      </button>
                    </div>

                    <Link
                      to={`/products/${product.id}`}
                      onClick={handleClose}
                      className="font-['JetBrains_Mono'] text-xs font-semibold text-[#ffd88a] hover:text-[#ffd88a]/80 flex items-center justify-center gap-1.5"
                    >
                      <span>Access Complete Technical Dossier</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
