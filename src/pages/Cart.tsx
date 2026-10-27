import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Tag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  selectCartItems,
  selectCartSubtotal,
  selectCartProductSavings,
  selectCartCouponDiscount,
  selectCartShipping,
  selectCartTax,
  selectCartTotal,
  selectAppliedCoupon,
  updateQuantity,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon,
  AVAILABLE_COUPONS,
} from '../features/cart/cartSlice';
import { selectCurrency } from '../features/ui/uiSlice';
import { formatPrice } from '../lib/utils';
import { Button } from '../components/ui/Button';

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);
  const productSavings = useAppSelector(selectCartProductSavings);
  const couponDiscount = useAppSelector(selectCartCouponDiscount);
  const shipping = useAppSelector(selectCartShipping);
  const tax = useAppSelector(selectCartTax);
  const total = useAppSelector(selectCartTotal);
  const appliedCoupon = useAppSelector(selectAppliedCoupon);
  const currency = useAppSelector(selectCurrency);

  const format = (amt: number) => formatPrice(amt, currency.code, currency.rate);

  const [couponCode, setCouponCode] = useState('');

  useEffect(() => {
    document.title = 'Interactive Cart Allocation — LBOSS SHOP';
  }, []);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    const code = couponCode.trim().toUpperCase();
    const match = AVAILABLE_COUPONS.find((c) => c.code === code);

    if (match) {
      dispatch(applyCoupon(code));
      toast.success(`VIP Voucher "${code}" applied! ${match.description}`, {
        style: {
          background: '#181b24',
          color: '#ffd88a',
          fontFamily: 'JetBrains Mono',
          border: '1px solid rgba(245, 183, 0, 0.4)',
        },
      });
      setCouponCode('');
    } else {
      toast.error('Invalid vault voucher code. Try BOSS10 or BOSS20');
    }
  };

  const freeShippingThreshold = 100;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  if (items.length === 0) {
    return (
      <div className="max-w-[1920px] mx-auto px-4 py-24 text-center">
        <div className="w-24 h-24 rounded-3xl bg-[#14171f] border border-white/5 text-[#f5b700] flex items-center justify-center mx-auto mb-6 shadow-xl">
          <ShoppingBag className="w-12 h-12 stroke-[1.5]" />
        </div>
        <h1 className="font-['Sora'] font-black text-3xl text-[#e0e2ed] mb-2">
          Your Cart Allocation is Empty
        </h1>
        <p className="font-['Manrope'] text-sm text-[#9c8f78] max-w-md mx-auto mb-8 leading-relaxed">
          No hardware assets currently indexed. Discover the 2027 collection to index bespoke technology assets into your private terminal.
        </p>
        <Link to="/products">
          <Button variant="primary" size="lg" className="gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Discover 2027 Collection</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1920px] mx-auto px-4 md:px-8 xl:px-16 py-8 lg:py-12">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-white/5">
        <div>
          <h1 className="font-['Sora'] font-black text-3xl sm:text-4xl text-[#e0e2ed]">
            Interactive Cart Allocation
          </h1>
          <p className="font-['JetBrains_Mono'] text-xs sm:text-sm text-[#9c8f78] mt-1">
            {items.length} {items.length === 1 ? 'asset allocated' : 'unique assets allocated'} for dispatch
          </p>
        </div>

        <button
          onClick={() => {
            if (window.confirm('Clear all indexed items from your allocation?')) {
              dispatch(clearCart());
              toast.success('Allocation cleared');
            }
          }}
          className="font-['JetBrains_Mono'] text-xs font-semibold text-[#ffb4ab] hover:text-[#ffb4ab]/80 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Allocation</span>
        </button>
      </div>

      {/* Free Shipping Meter */}
      <div className="p-5 rounded-none bg-[#14171f] border border-white/10 mb-8 shadow-sm">
        <div className="flex items-center justify-between font-['JetBrains_Mono'] text-xs font-semibold mb-2.5">
          <div className="flex items-center gap-2 text-[#e0e2ed]">
            <Truck className="w-4 h-4 text-[#f5b700]" />
            {amountToFreeShipping > 0 ? (
              <span>
                Index <strong>{format(amountToFreeShipping)}</strong> more to unlock <strong>Complimentary Zero-Latency Express Dispatch</strong>!
              </span>
            ) : (
              <span className="text-[#22c55e] flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-4 h-4" /> Unlocked Complimentary Zero-Latency Express Dispatch!
              </span>
            )}
          </div>
          <span className="text-[#ffd88a] font-mono font-bold">{Math.round(freeShippingProgress)}%</span>
        </div>
        <div className="w-full h-2 rounded-none bg-[#0b0e16] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#ffd88a] via-[#fbbc0e] to-[#cabeff] transition-all duration-500 shadow-[0_0_8px_rgba(245,183,0,0.5)]"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      {/* Grid: Cart Items (left) & Summary (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 rounded-none bg-[#14171f] border border-white/10 p-6 sm:p-8 shadow-sm divide-y divide-white/10">
          {items.map((item) => (
            <div
              key={item.id}
              className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-20 h-20 rounded-none object-contain bg-[#0b0e16] p-2.5 shrink-0 border border-white/10"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 font-['JetBrains_Mono'] text-[11px] text-[#ffd88a] font-bold uppercase tracking-wider mb-1">
                    <span>{item.category?.replace(/-/g, ' ')}</span>
                    {item.brand && (
                      <span className="text-[#9c8f78] font-normal">
                        • {item.brand}
                      </span>
                    )}
                  </div>
                  <Link
                    to={`/products/${item.id}`}
                    className="font-['Sora'] font-bold text-sm sm:text-base text-[#e0e2ed] hover:text-[#ffd88a] transition-colors line-clamp-1"
                  >
                    {item.title}
                  </Link>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-['JetBrains_Mono'] text-sm font-bold text-[#ffd88a]">
                      {format(item.price)}
                    </span>
                    {item.originalPrice > item.price && (
                      <span className="font-['JetBrains_Mono'] text-xs text-[#9c8f78] line-through">
                        {format(item.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quantity Controls & Total & Remove */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                {/* Quantity */}
                <div className="flex items-center rounded-none border border-white/10 bg-[#181b24] p-1 font-['JetBrains_Mono']">
                  <button
                    onClick={() =>
                      dispatch(
                        updateQuantity({
                          id: item.id,
                          quantity: item.quantity - 1,
                        })
                      )
                    }
                    className="w-8 h-8 rounded-none flex items-center justify-center font-bold text-[#d4c5ac] hover:bg-[#272a32] hover:text-[#ffd88a] cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-9 text-center text-xs font-bold text-[#e0e2ed]">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      dispatch(
                        updateQuantity({
                          id: item.id,
                          quantity: item.quantity + 1,
                        })
                      )
                    }
                    className="w-8 h-8 rounded-none flex items-center justify-center font-bold text-[#d4c5ac] hover:bg-[#272a32] hover:text-[#ffd88a] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal for line item */}
                <div className="text-right min-w-[80px]">
                  <p className="font-['JetBrains_Mono'] font-bold text-sm sm:text-base text-[#ffd88a]">
                    {format(item.price * item.quantity)}
                  </p>
                </div>

                {/* Remove */}
                <button
                  onClick={() => dispatch(removeFromCart(item.id))}
                  className="p-2 rounded-none text-[#9c8f78] hover:text-[#ffb4ab] hover:bg-[#ffb4ab]/10 transition-colors cursor-pointer"
                  title="Remove asset"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-none bg-[#14171f] border border-white/10 p-6 sm:p-8 shadow-sm">
            <h3 className="font-['Sora'] font-black text-xl text-[#e0e2ed] mb-6">
              Allocation Telemetry
            </h3>

            {/* Calculations breakdown */}
            <div className="space-y-3.5 font-['JetBrains_Mono'] text-xs sm:text-sm text-[#9c8f78] pb-6 border-b border-white/5">
              <div className="flex justify-between">
                <span>Gross Allocation</span>
                <span className="font-semibold text-[#e0e2ed]">
                  {format(subtotal)}
                </span>
              </div>

              {productSavings > 0 && (
                <div className="flex justify-between text-[#22c55e] font-medium">
                  <span>Hardware Privileges</span>
                  <span>-{format(productSavings)}</span>
                </div>
              )}

              {appliedCoupon && couponDiscount > 0 && (
                <div className="flex justify-between text-[#ffd88a] font-bold">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Voucher ({appliedCoupon.code})</span>
                  </span>
                  <span>-{format(couponDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Courier Transport</span>
                <span className="font-semibold text-[#e0e2ed]">
                  {shipping === 0 ? (
                    <span className="text-[#22c55e] font-bold">COMPLIMENTARY</span>
                  ) : (
                    format(shipping)
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Telemetry Tax (8%)</span>
                <span className="font-semibold text-[#e0e2ed]">
                  {format(tax)}
                </span>
              </div>
            </div>

            {/* Final Total */}
            <div className="flex items-baseline justify-between py-5 border-b border-white/5 mb-6">
              <div>
                <span className="font-['Sora'] font-black text-base text-[#e0e2ed] block">
                  Net Authorization
                </span>
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#9c8f78]">Includes all duties</span>
              </div>
              <span className="font-['JetBrains_Mono'] font-black text-2xl sm:text-3xl text-[#ffd88a]">
                {format(total)}
              </span>
            </div>

            {/* Voucher Code Box */}
            <div className="mb-6">
              <label className="block font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-wider text-[#9c8f78] mb-2">
                Encrypted Vault Voucher
              </label>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#f5b700]/10 border border-[#f5b700]/30 font-['JetBrains_Mono']">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#ffd88a]">
                    <Tag className="w-4 h-4 text-[#f5b700]" />
                    <span>{appliedCoupon.code} VERIFIED</span>
                  </div>
                  <button
                    onClick={() => dispatch(removeCoupon())}
                    className="text-xs text-[#ffb4ab] font-semibold hover:underline cursor-pointer"
                  >
                    Release
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="e.g. BOSS10 or BOSS20"
                    className="flex-1 h-11 px-3.5 rounded-xl font-['JetBrains_Mono'] text-xs bg-[#1c1f28] border border-white/10 text-[#e0e2ed] focus:outline-none focus:ring-1 focus:ring-[#f5b700] uppercase"
                  />
                  <Button variant="secondary" size="sm" type="submit">
                    Verify
                  </Button>
                </form>
              )}
              <div className="mt-2.5 flex gap-1.5 flex-wrap font-['JetBrains_Mono']">
                {['BOSS10', 'BOSS20', 'FREESHIP'].map((code) => (
                  <button
                    key={code}
                    onClick={() => {
                      dispatch(applyCoupon(code));
                      toast.success(`Voucher ${code} verified!`);
                    }}
                    className="text-[10px] px-2.5 py-1 rounded-md bg-[#181b24] text-[#d4c5ac] hover:text-[#ffd88a] border border-white/5 cursor-pointer"
                  >
                    +{code}
                  </button>
                ))}
              </div>
            </div>

            {/* Checkout CTA */}
            <Link to="/checkout" className="block w-full">
              <Button variant="primary" size="lg" className="w-full gap-2 font-black shadow-[0_12px_32px_-8px_rgba(245,183,0,0.4)]">
                <span>Proceed to Terminal Authorization</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <Link
              to="/products"
              className="block text-center font-['JetBrains_Mono'] text-xs font-semibold text-[#9c8f78] hover:text-[#ffd88a] mt-4 transition-colors"
            >
              ← Return to 2027 Catalog
            </Link>
          </div>

          {/* Trust Guarantees */}
          <div className="p-5 rounded-2xl bg-[#14171f] border border-white/5 space-y-3 font-['JetBrains_Mono'] text-xs text-[#9c8f78]">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#f5b700]" />
              <span>Simulated 256-Bit Quantum Protocol</span>
            </div>
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-[#f5b700]" />
              <span>White Glove 30-Day Escrow Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
