import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  selectWishlistItems,
  removeFromWishlist,
  clearWishlist,
} from '../features/wishlist/wishlistSlice';
import { addToCart } from '../features/cart/cartSlice';
import { ProductCard } from '../components/common/ProductCard';
import { Button } from '../components/ui/Button';

export const Wishlist: React.FC = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectWishlistItems);

  useEffect(() => {
    document.title = 'Private Vault Dossier — LBOSS SHOP';
  }, []);

  const handleAddAllToCart = () => {
    items.forEach((p) => {
      dispatch(addToCart({ product: p, quantity: p.minimumOrderQuantity || 1 }));
    });
    toast.success(`Allocated all ${items.length} vault assets to your cart!`, {
      style: { background: '#181b24', color: '#ffd88a', fontFamily: 'JetBrains Mono' },
    });
  };

  if (items.length === 0) {
    return (
      <div className="max-w-[1920px] mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 rounded-2xl bg-[#14171f] border border-white/5 text-[#cabeff] flex items-center justify-center mx-auto mb-6 shadow-xl">
          <Heart className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h1 className="font-['Sora'] font-black text-3xl text-[#e0e2ed] mb-2">
          Private Vault is Empty
        </h1>
        <p className="font-['Manrope'] text-sm text-[#9c8f78] max-w-sm mx-auto mb-8 leading-relaxed">
          Index bespoke hardware assets you wish to monitor by tapping the heart icon on any product dossier.
        </p>
        <Link to="/products">
          <Button variant="primary" size="lg" className="gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Discover 2027 Catalog</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1920px] mx-auto px-4 md:px-8 xl:px-16 py-8 lg:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-white/5">
        <div>
          <h1 className="font-['Sora'] font-black text-3xl sm:text-4xl text-[#e0e2ed] flex items-center gap-3">
            <span>Private Vault Dossier</span>
            <span className="text-xs font-['JetBrains_Mono'] font-bold px-3 py-1 rounded-full bg-[#4816cb] text-[#e6deff] border border-[#cabeff]/30">
              {items.length} {items.length === 1 ? 'ASSET' : 'ASSETS'}
            </span>
          </h1>
          <p className="font-['JetBrains_Mono'] text-xs sm:text-sm text-[#9c8f78] mt-1">
            ENCRYPTED TELEMETRY WATCHLIST FOR COMMANDERS OF INDUSTRY
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleAddAllToCart}
            variant="primary"
            size="sm"
            className="gap-1.5 font-['JetBrains_Mono']"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Acquire All Assets</span>
          </Button>

          <Button
            onClick={() => {
              if (window.confirm('Clear all indexed items from your private vault?')) {
                dispatch(clearWishlist());
                toast.success('Vault dossier cleared');
              }
            }}
            variant="outline"
            size="sm"
            className="gap-1.5 font-['JetBrains_Mono'] text-[#ffb4ab] border-[#ffb4ab]/30 hover:bg-[#ffb4ab]/10"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Vault</span>
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
