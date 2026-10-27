import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Share2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  useGetProductByIdQuery,
  useGetProductsByCategoryQuery,
} from '../features/api/apiSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { addToCart } from '../features/cart/cartSlice';
import { toggleWishlist, selectIsInWishlist } from '../features/wishlist/wishlistSlice';
import { selectCurrency } from '../features/ui/uiSlice';
import { formatPrice, calculateOriginalPrice, formatDate } from '../lib/utils';
import { ProductCard } from '../components/common/ProductCard';
import { Button } from '../components/ui/Button';

type TabKey = 'description' | 'specs' | 'shipping' | 'reviews';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currency = useAppSelector(selectCurrency);

  const { data: product, isLoading, isError } = useGetProductByIdQuery(id || '');

  const [selectedImage, setSelectedImage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<TabKey>('description');
  const [quantity, setQuantity] = useState<number>(1);

  const isInWishlist = useAppSelector(selectIsInWishlist(product?.id || 0));

  useEffect(() => {
    if (product) {
      setSelectedImage(product.images?.[0] || product.thumbnail || '');
      setQuantity(product.minimumOrderQuantity || 1);
      document.title = `${product.title} — LBOSS 2027 Executive Dossier`;
    }
  }, [product]);

  const { data: relatedData } = useGetProductsByCategoryQuery(
    { category: product?.category || '', limit: 4 },
    { skip: !product?.category }
  );

  const relatedProducts = relatedData?.products?.filter((p) => p.id !== product?.id) || [];

  if (isLoading) {
    return (
      <div className="max-w-[1920px] mx-auto px-4 py-24 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#f5b700] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-['JetBrains_Mono'] text-xs font-bold text-[#9c8f78] uppercase tracking-wider">
          Retrieving Asset Dossier...
        </p>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h2 className="font-['Sora'] text-2xl font-black text-[#e0e2ed] mb-2">
          Asset Not Found
        </h2>
        <p className="font-['Manrope'] text-sm text-[#9c8f78] mb-6">
          The requested asset identifier does not match active vault inventory records.
        </p>
        <Link to="/products">
          <Button variant="primary" size="md">
            Return to 2027 Catalog
          </Button>
        </Link>
      </div>
    );
  }

  const originalPrice = calculateOriginalPrice(product.price, product.discountPercentage);
  const minQty = product.minimumOrderQuantity || 1;
  const maxStock = product.stock || 0;
  const isOutOfStock = maxStock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    dispatch(addToCart({ product, quantity }));
    toast.success(`Acquired: ${quantity} × "${product.title}" added to cart!`, {
      style: {
        background: '#181b24',
        color: '#ffd88a',
        fontFamily: 'JetBrains Mono',
        border: '1px solid rgba(245, 183, 0, 0.4)',
      },
    });
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    dispatch(addToCart({ product, quantity }));
    navigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Dossier terminal link copied!');
    }
  };

  return (
    <div className="max-w-[1920px] mx-auto px-4 md:px-8 xl:px-16 py-8 lg:py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 font-['JetBrains_Mono'] text-xs text-[#9c8f78] mb-8 overflow-x-auto pb-1">
        <Link to="/" className="hover:text-[#ffd88a]">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#504532]" />
        <Link to="/products" className="hover:text-[#ffd88a]">
          2027 Catalog
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#504532]" />
        <Link
          to={`/products?category=${product.category}`}
          className="hover:text-[#ffd88a] capitalize"
        >
          {product.category?.replace(/-/g, ' ')}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#504532]" />
        <span className="text-[#ffd88a] font-semibold truncate max-w-[240px]">
          {product.title}
        </span>
      </nav>

      {/* Main Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 mb-16">
        {/* Gallery Column */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="relative aspect-square w-full rounded-none bg-[#0b0e16] border border-white/10 p-8 flex items-center justify-center overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            {/* Discount badge */}
            {product.discountPercentage > 0 && (
              <div className="absolute top-5 left-5 z-10 px-3 py-1 rounded-none bg-gradient-to-r from-[#ffd88a] via-[#fbbc0e] to-[#cabeff] text-[#0b0e16] font-['JetBrains_Mono'] text-xs font-black shadow-sm">
                VIP SAVE {Math.round(product.discountPercentage)}%
              </div>
            )}

            <button
              onClick={handleShare}
              className="absolute top-5 right-5 z-10 p-2.5 rounded-none bg-[#1c1f28] text-[#d4c5ac] hover:text-[#ffd88a] border border-white/10 transition-colors cursor-pointer"
              title="Share dossier"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <img
              src={selectedImage || product.thumbnail}
              alt={product.title}
              className="w-full h-full object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)] transition-transform duration-500 group-hover:scale-105 relative z-10"
            />
          </div>

          {/* Thumbnails Row */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-none p-2 shrink-0 bg-[#14171f] border transition-all cursor-pointer ${
                    selectedImage === img
                      ? 'border-[#f5b700] ring-1 ring-[#f5b700]/50 shadow-md'
                      : 'border-white/10 opacity-60 hover:opacity-100'
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

        {/* Product Details Column */}
        <div className="lg:col-span-5 flex flex-col">
          {/* Department & SKU Telemetry */}
          <div className="flex items-center justify-between font-['JetBrains_Mono'] text-xs font-bold text-[#ffd88a] tracking-wider uppercase mb-2">
            <span>{product.category?.replace(/-/g, ' ')}</span>
            {product.sku && (
              <span className="text-[#9c8f78] font-normal">
                SKU: {product.sku}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-['Sora'] font-black text-2xl sm:text-3xl lg:text-4xl text-[#e0e2ed] mb-3 leading-tight">
            {product.title}
          </h1>

          {/* Brand line */}
          {product.brand && (
            <p className="font-['Manrope'] text-sm font-semibold text-[#9c8f78] mb-4">
              Hardware Brand: <span className="text-[#e0e2ed]">{product.brand}</span>
            </p>
          )}

          {/* Rating & Stock status */}
          <div className="flex items-center gap-3 mb-6 flex-wrap font-['JetBrains_Mono']">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#f5b700]/15 text-[#ffd88a] font-bold text-xs border border-[#f5b700]/30">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{product.rating?.toFixed(1) || '4.9'}</span>
            </div>
            <span className="text-xs text-[#9c8f78]">
              ({product.reviews?.length || 24} verified patron audits)
            </span>
            <span className="text-[#504532]">•</span>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                isOutOfStock
                  ? 'bg-[#ffb4ab]/15 text-[#ffb4ab] border border-[#ffb4ab]/30'
                  : 'bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30'
              }`}
            >
              {product.availabilityStatus || (isOutOfStock ? 'Allocation Depleted' : 'Immediate Allocation')}
            </span>
          </div>

          {/* Price Box */}
          <div className="p-6 rounded-none bg-[#14171f] border border-white/10 mb-6 shadow-sm">
            <div className="flex items-baseline gap-3 mb-1">
              <span className="font-['JetBrains_Mono'] font-extrabold text-3xl sm:text-4xl text-[#ffd88a]">
                {formatPrice(product.price, currency.code, currency.rate)}
              </span>
              {product.discountPercentage > 0 && (
                <span className="font-['JetBrains_Mono'] text-base text-[#9c8f78] line-through">
                  {formatPrice(originalPrice, currency.code, currency.rate)}
                </span>
              )}
            </div>
            {product.minimumOrderQuantity && product.minimumOrderQuantity > 1 && (
              <p className="font-['JetBrains_Mono'] text-xs text-[#9c8f78] mt-1">
                Minimum order telemetry threshold: <strong>{product.minimumOrderQuantity}</strong>
              </p>
            )}
          </div>

          {/* Description */}
          <p className="font-['Manrope'] text-sm text-[#d4c5ac] mb-8 leading-relaxed">
            {product.description}
          </p>

          {/* Quantity selector & Actions */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3">
              {/* Quantity */}
              <div className="flex items-center rounded-none border border-white/10 bg-[#181b24] p-1 font-['JetBrains_Mono']">
                <button
                  onClick={() => setQuantity(Math.max(minQty, quantity - 1))}
                  className="w-10 h-10 rounded-none flex items-center justify-center font-bold text-[#d4c5ac] hover:bg-[#272a32] hover:text-[#ffd88a] cursor-pointer"
                >
                  -
                </button>
                <span className="w-12 text-center text-sm font-bold text-[#e0e2ed]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
                  className="w-10 h-10 rounded-none flex items-center justify-center font-bold text-[#d4c5ac] hover:bg-[#272a32] hover:text-[#ffd88a] cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                variant="primary"
                size="lg"
                className="flex-1 gap-2 rounded-none"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Acquire Asset</span>
              </Button>

              {/* Wishlist button */}
              <button
                onClick={() => dispatch(toggleWishlist(product))}
                className="p-3.5 rounded-none border border-white/10 bg-[#14171f] hover:bg-[#1c1f28] text-[#d4c5ac] hover:text-[#cabeff] transition-colors cursor-pointer"
                title={isInWishlist ? 'Remove from vault' : 'Index into vault'}
              >
                <Heart
                  className={`w-5 h-5 ${
                    isInWishlist ? 'fill-[#cabeff] text-[#cabeff]' : ''
                  }`}
                />
              </button>
            </div>

            {/* Instant Buy Now Button */}
            <Button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              variant="gold"
              size="lg"
              className="w-full gap-2 font-black"
            >
              <Sparkles className="w-5 h-5" />
              <span>Instant Acquisition Protocol</span>
            </Button>
          </div>

          {/* Quick value badges */}
          <div className="grid grid-cols-2 gap-3 pt-6 border-t border-white/5 font-['JetBrains_Mono'] text-xs text-[#9c8f78]">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#f5b700] shrink-0" />
              <span>{product.shippingInformation || 'Zero-Latency Global Dispatch'}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#f5b700] shrink-0" />
              <span>{product.warrantyInformation || 'Aerospace Grade 5 Warranty'}</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[#f5b700] shrink-0" />
              <span>{product.returnPolicy || '30-Day White Glove Returns'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#f5b700] shrink-0" />
              <span>100% Cryptographically Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Description, Specs, Shipping, Reviews */}
      <div className="rounded-none bg-[#14171f] border border-white/10 p-6 sm:p-10 mb-16 shadow-lg">
        {/* Tabs Bar */}
        <div className="flex border-b border-white/10 gap-8 overflow-x-auto pb-px">
          {(
            [
              { key: 'description', label: 'Architectural Dossier' },
              { key: 'specs', label: 'Telemetry & Specs' },
              { key: 'shipping', label: 'Global Logistics' },
              {
                key: 'reviews',
                label: `Patron Audits (${product.reviews?.length || 0})`,
              },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-4 font-['Sora'] text-sm font-bold tracking-wide transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                activeTab === tab.key
                  ? 'border-[#f5b700] text-[#ffd88a]'
                  : 'border-transparent text-[#9c8f78] hover:text-[#e0e2ed]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab contents */}
        <div className="py-8">
          {activeTab === 'description' && (
            <div className="space-y-4 max-w-3xl font-['Manrope'] text-sm text-[#d4c5ac] leading-relaxed">
              <p>{product.description}</p>
              {product.tags && product.tags.length > 0 && (
                <div className="pt-4 flex items-center gap-2 flex-wrap font-['JetBrains_Mono']">
                  <span className="text-xs font-bold text-[#9c8f78]">Telemetry Tags:</span>
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-lg bg-[#1c1f28] text-[#ffd88a] border border-white/5"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 font-['JetBrains_Mono'] text-xs">
              <div className="p-4 rounded-xl bg-[#0b0e16] border border-white/5 flex justify-between">
                <span className="text-[#9c8f78]">Net Mass</span>
                <span className="font-bold text-[#e0e2ed]">
                  {product.weight ? `${product.weight} oz / aerospace standard` : 'Nominal'}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-[#0b0e16] border border-white/5 flex justify-between">
                <span className="text-[#9c8f78]">Chassis Geometry</span>
                <span className="font-bold text-[#e0e2ed]">
                  {product.dimensions
                    ? `${product.dimensions.width} × ${product.dimensions.height} × ${product.dimensions.depth} mm`
                    : 'Precision Form Factor'}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-[#0b0e16] border border-white/5 flex justify-between">
                <span className="text-[#9c8f78]">Registry SKU</span>
                <span className="font-bold text-[#ffd88a]">
                  {product.sku || 'APEX-2027'}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-[#0b0e16] border border-white/5 flex justify-between">
                <span className="text-[#9c8f78]">Optical Barcode</span>
                <span className="font-bold text-[#e0e2ed]">
                  {product.meta?.barcode || 'AUTHENTICATED'}
                </span>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="max-w-3xl space-y-6 font-['Manrope'] text-sm text-[#d4c5ac]">
              <div className="flex gap-4">
                <Truck className="w-5 h-5 text-[#f5b700] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-['Sora'] font-bold text-[#e0e2ed] mb-1">
                    Zero-Latency Dispatch
                  </h4>
                  <p>{product.shippingInformation || 'Dispatched via private armored air transport within 24 hours of biometric order verification.'}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <ShieldCheck className="w-5 h-5 text-[#f5b700] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-['Sora'] font-bold text-[#e0e2ed] mb-1">
                    Aerospace Warranty Coverage
                  </h4>
                  <p>{product.warrantyInformation || 'Full hardware coverage covering structural integrity, circuitry anomalies, and bespoke calibration.'}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <RotateCcw className="w-5 h-5 text-[#f5b700] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-['Sora'] font-bold text-[#e0e2ed] mb-1">
                    White Glove 30-Day Return
                  </h4>
                  <p>{product.returnPolicy || 'Complimentary return courier courier pick-up from your residence in sealed climate packaging.'}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6 max-w-3xl">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev, index) => (
                  <div
                    key={index}
                    className="p-5 rounded-2xl bg-[#0b0e16] border border-white/5 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#f5b700]/20 text-[#ffd88a] font-['JetBrains_Mono'] font-bold text-xs flex items-center justify-center">
                          {rev.reviewerName[0]}
                        </div>
                        <div>
                          <p className="font-['Sora'] text-xs font-bold text-[#e0e2ed]">
                            {rev.reviewerName}
                          </p>
                          <p className="font-['JetBrains_Mono'] text-[10px] text-[#9c8f78]">
                            {formatDate(rev.date)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center text-[#f5b700]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-current' : 'text-[#32353d]'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="font-['Manrope'] text-xs text-[#d4c5ac] leading-relaxed pt-1">
                      "{rev.comment}"
                    </p>
                  </div>
                ))
              ) : (
                <p className="font-['JetBrains_Mono'] text-xs text-[#9c8f78]">
                  Zero patron audits logged yet for this asset.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="pt-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-['Sora'] font-black text-2xl text-[#e0e2ed]">
              Complementary 2027 Rigs
            </h3>
            <Link
              to={`/products?category=${product.category}`}
              className="font-['JetBrains_Mono'] text-xs font-bold text-[#ffd88a] hover:text-[#ffd88a]/80 flex items-center gap-1"
            >
              <span>Explore Portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
