import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Truck,
  CreditCard,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Lock,
  Printer,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  selectCartItems,
  selectCartSubtotal,
  selectCartCouponDiscount,
  selectCartShipping,
  selectCartTax,
  selectCartTotal,
  selectAppliedCoupon,
  clearCart,
} from '../features/cart/cartSlice';
import { addOrder } from '../features/orders/ordersSlice';
import { useSimulateCheckoutMutation } from '../features/api/apiSlice';
import { selectCurrency } from '../features/ui/uiSlice';
import { formatPrice } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import type { DeliveryMethod, Order, ShippingAddressInput } from '../types';

type CheckoutStep = 'shipping' | 'delivery' | 'payment' | 'review' | 'success';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currency = useAppSelector(selectCurrency);

  const { user } = useAppSelector((state) => state.auth);
  const cartItems = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);
  const couponDiscount = useAppSelector(selectCartCouponDiscount);
  const baseShipping = useAppSelector(selectCartShipping);
  const tax = useAppSelector(selectCartTax);
  const cartTotal = useAppSelector(selectCartTotal);
  const appliedCoupon = useAppSelector(selectAppliedCoupon);

  const [simulateCheckoutMutation, { isLoading: isSubmitting }] =
    useSimulateCheckoutMutation();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Shipping Form State (pre-filled with logged-in user data)
  const [shippingAddress, setShippingAddress] = useState<ShippingAddressInput>({
    firstName: user?.firstName || 'Emily',
    lastName: user?.lastName || 'Johnson',
    email: user?.email || 'emily.johnson@x.dummyjson.com',
    phone: user?.phone || '+1 555-0199',
    address: user?.address?.address || '1745 T St NW',
    city: user?.address?.city || 'Washington',
    state: user?.address?.state || 'DC',
    postalCode: user?.address?.postalCode || '20009',
    country: 'United States',
  });

  // Delivery Method
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('standard');

  // Payment State (Demo UI only)
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [cardName, setCardName] = useState(
    user ? `${user.firstName} ${user.lastName}` : 'Emily Johnson'
  );

  useEffect(() => {
    document.title = 'Terminal Authorization — LBOSS SHOP';
  }, []);

  const deliverySurcharge =
    deliveryMethod === 'overnight' ? 19.99 : deliveryMethod === 'express' ? 9.99 : 0;
  const effectiveShipping = baseShipping + deliverySurcharge;
  const finalOrderTotal = Number(
    (Math.max(0, subtotal - couponDiscount) + effectiveShipping + tax).toFixed(2)
  );

  const handleUseDemoCard = () => {
    setCardNumber('4000 1234 5678 9010');
    setCardExpiry('08/29');
    setCardCvc('123');
    setCardName(user ? `${user.firstName} ${user.lastName}` : 'Emily Johnson');
    toast.success('Executive biometric token loaded!', {
      style: { background: '#181b24', color: '#ffd88a', fontFamily: 'JetBrains Mono' },
    });
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;

    try {
      try {
        await simulateCheckoutMutation({
          userId: user?.id || 1,
          products: cartItems.map((item) => ({
            id: item.id,
            quantity: item.quantity,
          })),
        }).unwrap();
      } catch {
        // Fallback simulated handshake
      }

      const orderNumber = `LBOSS-${Math.floor(100000 + Math.random() * 900000)}`;
      const newOrder: Order = {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        orderNumber,
        date: new Date().toISOString(),
        items: cartItems.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          thumbnail: item.thumbnail,
        })),
        subtotal,
        discount: couponDiscount,
        shipping: effectiveShipping,
        tax,
        total: finalOrderTotal,
        couponCode: appliedCoupon?.code,
        shippingAddress,
        deliveryMethod,
        paymentMethod: `Quantum Credit Card (•••• ${cardNumber.slice(-4)})`,
        status: 'Confirmed',
      };

      dispatch(addOrder(newOrder));
      dispatch(clearCart());
      setCompletedOrder(newOrder);
      setCurrentStep('success');

      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#F5B700', '#FFD88A', '#CABEFF', '#FFFFFF'],
        });
      } catch {
        // ignore
      }

      toast.success(`Asset dispatch authorization ${orderNumber} locked!`);
    } catch {
      toast.error('Terminal handshake anomaly. Please retry authorization.');
    }
  };

  if (cartItems.length === 0 && currentStep !== 'success') {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h2 className="font-['Sora'] text-2xl font-black mb-2 text-[#e0e2ed]">
          Allocation is Empty
        </h2>
        <p className="font-['Manrope'] text-sm text-[#9c8f78] mb-6">
          Index items into your cart before initiating terminal authorization.
        </p>
        <Link to="/products">
          <Button variant="primary" size="md">
            Return to 2027 Catalog
          </Button>
        </Link>
      </div>
    );
  }

  // ------------------ SUCCESS PAGE ------------------
  if (currentStep === 'success' && completedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="rounded-3xl bg-[#14171f] border border-white/10 p-8 sm:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-center">
          <div className="w-20 h-20 rounded-2xl bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30 flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold font-['JetBrains_Mono'] uppercase tracking-wider bg-[#f5b700]/15 text-[#ffd88a] border border-[#f5b700]/30 mb-2">
            Dispatched via Zero-Latency Courier
          </span>

          <h1 className="font-['Sora'] font-black text-3xl sm:text-4xl text-[#e0e2ed] mb-2">
            Terminal Authorization Verified
          </h1>
          <p className="font-['Manrope'] text-sm text-[#9c8f78] max-w-md mx-auto mb-8 leading-relaxed">
            Your simulated order handshake is locked. A cryptographic receipt and dispatch tracking manifest have been registered.
          </p>

          {/* Order Details Card */}
          <div className="rounded-2xl bg-[#0b0e16] border border-white/5 p-6 text-left mb-8 space-y-4 font-['JetBrains_Mono']">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-white/5 text-xs">
              <div>
                <p className="text-[#9c8f78]">Order Hash</p>
                <p className="font-bold text-[#ffd88a] text-sm mt-0.5">
                  {completedOrder.orderNumber}
                </p>
              </div>
              <div>
                <p className="text-[#9c8f78]">Timestamp</p>
                <p className="font-semibold text-[#e0e2ed] mt-0.5">
                  {new Date(completedOrder.date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-[#9c8f78]">Total Settled</p>
                <p className="font-bold text-[#ffd88a] text-sm mt-0.5">
                  {formatPrice(completedOrder.total)}
                </p>
              </div>
              <div>
                <p className="text-[#9c8f78]">Method</p>
                <p className="font-semibold text-[#e0e2ed] mt-0.5">
                  Simulated Card
                </p>
              </div>
            </div>

            {/* Items summary */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#9c8f78] mb-3">
                Allocated Hardware Assets ({completedOrder.items.length})
              </p>
              <div className="space-y-3">
                {completedOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.thumbnail}
                        alt=""
                        className="w-10 h-10 rounded-lg bg-[#14171f] p-1 border border-white/5 object-contain"
                      />
                      <div>
                        <p className="font-['Sora'] font-bold text-[#e0e2ed]">
                          {item.title}
                        </p>
                        <p className="text-[#9c8f78]">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-[#ffd88a]">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping destination */}
            <div className="pt-4 border-t border-white/5 text-xs text-[#9c8f78]">
              <p className="font-bold text-[#e0e2ed] mb-1 font-['Sora']">
                Destination:
              </p>
              <p>
                {completedOrder.shippingAddress.firstName}{' '}
                {completedOrder.shippingAddress.lastName} •{' '}
                {completedOrder.shippingAddress.address},{' '}
                {completedOrder.shippingAddress.city},{' '}
                {completedOrder.shippingAddress.state}{' '}
                {completedOrder.shippingAddress.postalCode}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-[#1c1f28] text-xs font-['JetBrains_Mono'] font-bold flex items-center gap-2 text-[#e0e2ed] cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#f5b700]" />
              <span>Print Manifest</span>
            </button>
            <Link to="/orders">
              <Button variant="secondary" size="md">
                View Courier Dispatches
              </Button>
            </Link>
            <Link to="/products">
              <Button variant="primary" size="md">
                Return to 2027 Catalog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ------------------ MULTI-STEP CHECKOUT FORM ------------------
  return (
    <div className="max-w-[1920px] mx-auto px-4 md:px-8 xl:px-16 py-8 lg:py-12">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-white/5">
        <h1 className="font-['Sora'] font-black text-3xl sm:text-4xl text-[#e0e2ed]">
          Terminal Authorization
        </h1>
        <p className="font-['JetBrains_Mono'] text-xs sm:text-sm text-[#9c8f78] mt-1 flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-[#f5b700]" />
          <span>256-Bit Quantum Authenticated Protocol</span>
        </p>
      </div>

      {/* Progress Steps Header */}
      <div className="flex items-center justify-between max-w-xl mx-auto mb-10 font-['JetBrains_Mono'] text-xs font-bold">
        {[
          { key: 'shipping', label: '1. Destination' },
          { key: 'delivery', label: '2. Logistics' },
          { key: 'payment', label: '3. Authorization' },
          { key: 'review', label: '4. Verification' },
        ].map((step, idx) => {
          const isActive = currentStep === step.key;
          const isPassed =
            (step.key === 'shipping' && currentStep !== 'shipping') ||
            (step.key === 'delivery' &&
              (currentStep === 'payment' || currentStep === 'review')) ||
            (step.key === 'payment' && currentStep === 'review');

          return (
            <div key={step.key} className="flex items-center gap-2">
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors ${
                  isActive
                    ? 'bg-[#f5b700] text-[#0b0e16] font-black shadow-[0_0_12px_rgba(245,183,0,0.4)]'
                    : isPassed
                    ? 'bg-[#22c55e] text-[#0b0e16]'
                    : 'bg-[#1c1f28] text-[#9c8f78] border border-white/5'
                }`}
              >
                {isPassed ? '✓' : idx + 1}
              </span>
              <span
                className={`hidden sm:inline ${
                  isActive ? 'text-[#ffd88a]' : 'text-[#9c8f78]'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Step Forms */}
        <div className="lg:col-span-7 rounded-3xl bg-[#14171f] border border-white/5 p-6 sm:p-8 shadow-sm">
          {/* STEP 1: SHIPPING ADDRESS */}
          {currentStep === 'shipping' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <h3 className="font-['Sora'] font-black text-lg text-[#e0e2ed] flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#f5b700]" />
                  <span>Dispatch Destination</span>
                </h3>
                <span className="font-['JetBrains_Mono'] text-xs text-[#ffd88a]">Prefilled from Executive Dossier</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-['JetBrains_Mono'] text-xs font-bold text-[#d4c5ac] mb-1">
                    First Name
                  </label>
                  <Input
                    value={shippingAddress.firstName}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, firstName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block font-['JetBrains_Mono'] text-xs font-bold text-[#d4c5ac] mb-1">
                    Last Name
                  </label>
                  <Input
                    value={shippingAddress.lastName}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, lastName: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-['JetBrains_Mono'] text-xs font-bold text-[#d4c5ac] mb-1">
                    Encrypted Terminal Email
                  </label>
                  <Input
                    type="email"
                    value={shippingAddress.email}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block font-['JetBrains_Mono'] text-xs font-bold text-[#d4c5ac] mb-1">
                    Satellite Secure Phone
                  </label>
                  <Input
                    value={shippingAddress.phone}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block font-['JetBrains_Mono'] text-xs font-bold text-[#d4c5ac] mb-1">
                  Street Residence
                </label>
                <Input
                  value={shippingAddress.address}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, address: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-['JetBrains_Mono'] text-xs font-bold text-[#d4c5ac] mb-1">
                    City
                  </label>
                  <Input
                    value={shippingAddress.city}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, city: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block font-['JetBrains_Mono'] text-xs font-bold text-[#d4c5ac] mb-1">
                    State / Sector
                  </label>
                  <Input
                    value={shippingAddress.state}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, state: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block font-['JetBrains_Mono'] text-xs font-bold text-[#d4c5ac] mb-1">
                    Postal Code
                  </label>
                  <Input
                    value={shippingAddress.postalCode}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        postalCode: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="pt-6 flex justify-end">
                <Button
                  onClick={() => setCurrentStep('delivery')}
                  variant="primary"
                  size="md"
                  className="gap-2"
                >
                  <span>Proceed to Logistics Protocol</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: DELIVERY METHOD */}
          {currentStep === 'delivery' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-white/5">
                <h3 className="font-['Sora'] font-black text-lg text-[#e0e2ed] flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#f5b700]" />
                  <span>Choose Logistics Speed</span>
                </h3>
              </div>

              <div className="space-y-3 font-['Manrope']">
                {[
                  {
                    id: 'standard' as DeliveryMethod,
                    title: 'Standard Zero-Latency (3-5 business days)',
                    price: baseShipping === 0 ? 'COMPLIMENTARY' : formatPrice(baseShipping),
                    desc: 'Encrypted ground transport with global satellite beacon tracking.',
                  },
                  {
                    id: 'express' as DeliveryMethod,
                    title: 'Priority Supersonic Air (2-3 business days)',
                    price: formatPrice(baseShipping + 9.99),
                    desc: 'Climate-controlled pressurized air transport with biometric handover.',
                  },
                  {
                    id: 'overnight' as DeliveryMethod,
                    title: 'Boss Dedicated Private Courier (Next business morning)',
                    price: formatPrice(baseShipping + 19.99),
                    desc: 'Direct executive courier charter hand-delivered to your coordinates.',
                  },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    onClick={() => setDeliveryMethod(opt.id)}
                    className={`block p-5 rounded-2xl border cursor-pointer transition-all ${
                      deliveryMethod === opt.id
                        ? 'border-[#f5b700] bg-[#f5b700]/10 shadow-[0_0_15px_rgba(245,183,0,0.1)]'
                        : 'border-white/5 bg-[#181b24] hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3.5">
                        <input
                          type="radio"
                          name="delivery"
                          checked={deliveryMethod === opt.id}
                          onChange={() => setDeliveryMethod(opt.id)}
                          className="text-[#f5b700]"
                        />
                        <div>
                          <p className="font-['Sora'] font-bold text-sm text-[#e0e2ed]">
                            {opt.title}
                          </p>
                          <p className="font-['Manrope'] text-xs text-[#9c8f78] mt-0.5">{opt.desc}</p>
                        </div>
                      </div>
                      <span className="font-['JetBrains_Mono'] font-extrabold text-[#ffd88a] text-sm">
                        {opt.price}
                      </span>
                    </div>
                  </label>
                ))}
              </div>

              <div className="pt-6 flex items-center justify-between">
                <Button
                  onClick={() => setCurrentStep('shipping')}
                  variant="outline"
                  size="md"
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </Button>
                <Button
                  onClick={() => setCurrentStep('payment')}
                  variant="primary"
                  size="md"
                  className="gap-2"
                >
                  <span>Proceed to Payment Authorization</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT FORM */}
          {currentStep === 'payment' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <h3 className="font-['Sora'] font-black text-lg text-[#e0e2ed] flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#f5b700]" />
                  <span>Quantum Payment Interface</span>
                </h3>
                <button
                  type="button"
                  onClick={handleUseDemoCard}
                  className="font-['JetBrains_Mono'] text-xs text-[#ffd88a] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Load Executive Token</span>
                </button>
              </div>

              <div>
                <label className="block font-['JetBrains_Mono'] text-xs font-bold text-[#d4c5ac] mb-1">
                  Cardholder Designation
                </label>
                <Input
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="Full name as verified"
                />
              </div>

              <div>
                <label className="block font-['JetBrains_Mono'] text-xs font-bold text-[#d4c5ac] mb-1">
                  Card Telemetry Number
                </label>
                <Input
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4242 •••• •••• 4242"
                  icon={<CreditCard className="w-4 h-4" />}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-['JetBrains_Mono'] text-xs font-bold text-[#d4c5ac] mb-1">
                    Expiration (MM/YY)
                  </label>
                  <Input
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="12/28"
                  />
                </div>
                <div>
                  <label className="block font-['JetBrains_Mono'] text-xs font-bold text-[#d4c5ac] mb-1">
                    CVC Security Key
                  </label>
                  <Input
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    placeholder="888"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0b0e16] border border-white/5 font-['JetBrains_Mono'] text-xs text-[#9c8f78] flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#22c55e] shrink-0" />
                <span>
                  Simulated sandbox environment. Zero real currency will be charged to your accounts.
                </span>
              </div>

              <div className="pt-6 flex items-center justify-between">
                <Button
                  onClick={() => setCurrentStep('delivery')}
                  variant="outline"
                  size="md"
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </Button>
                <Button
                  onClick={() => setCurrentStep('review')}
                  variant="primary"
                  size="md"
                  className="gap-2"
                >
                  <span>Review Final Telemetry</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: ORDER REVIEW */}
          {currentStep === 'review' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-white/5">
                <h3 className="font-['Sora'] font-black text-lg text-[#e0e2ed] flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#f5b700]" />
                  <span>Final Telemetry Verification</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-['JetBrains_Mono'] text-xs">
                <div className="p-5 rounded-2xl bg-[#0b0e16] border border-white/5 space-y-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-[#ffd88a] uppercase tracking-wider text-[11px]">
                      Destination Coordinates
                    </span>
                    <button
                      onClick={() => setCurrentStep('shipping')}
                      className="text-[#ffd88a] hover:underline font-semibold cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="font-['Sora'] font-bold text-[#e0e2ed]">
                    {shippingAddress.firstName} {shippingAddress.lastName}
                  </p>
                  <p className="text-[#9c8f78]">{shippingAddress.address}</p>
                  <p className="text-[#9c8f78]">
                    {shippingAddress.city}, {shippingAddress.state}{' '}
                    {shippingAddress.postalCode}
                  </p>
                  <p className="text-[#9c8f78]">{shippingAddress.phone}</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#0b0e16] border border-white/5 space-y-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-[#ffd88a] uppercase tracking-wider text-[11px]">
                      Transport &amp; Settlement
                    </span>
                    <button
                      onClick={() => setCurrentStep('delivery')}
                      className="text-[#ffd88a] hover:underline font-semibold cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="font-['Sora'] font-bold text-[#e0e2ed] capitalize">
                    {deliveryMethod} Transport
                  </p>
                  <p className="text-[#9c8f78]">
                    Quantum Card: •••• {cardNumber.slice(-4)}
                  </p>
                  <p className="text-[#9c8f78]">Bearer: {cardName}</p>
                </div>
              </div>

              <div className="pt-6 flex items-center justify-between">
                <Button
                  onClick={() => setCurrentStep('payment')}
                  variant="outline"
                  size="md"
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </Button>
                <Button
                  onClick={handlePlaceOrder}
                  isLoading={isSubmitting}
                  variant="primary"
                  size="lg"
                  className="gap-2 font-black shadow-[0_12px_32px_-8px_rgba(245,183,0,0.4)]"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Authorize &amp; Dispatch • {formatPrice(finalOrderTotal)}</span>
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Order Summary */}
        <div className="lg:col-span-5 rounded-3xl bg-[#14171f] border border-white/5 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <h3 className="font-['Sora'] font-black text-lg text-[#e0e2ed]">
              Allocated Assets ({cartItems.length})
            </h3>
            <Link
              to="/cart"
              className="font-['JetBrains_Mono'] text-xs text-[#ffd88a] font-semibold hover:underline"
            >
              Modify
            </Link>
          </div>

          <div className="max-h-64 overflow-y-auto divide-y divide-white/5 pr-1">
            {cartItems.map((item) => (
              <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center gap-3">
                <img
                  src={item.thumbnail}
                  alt=""
                  className="w-12 h-12 rounded-xl object-contain bg-[#0b0e16] p-1.5 border border-white/5 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-['Sora'] text-xs font-bold text-[#e0e2ed] truncate">
                    {item.title}
                  </p>
                  <p className="font-['JetBrains_Mono'] text-[11px] text-[#9c8f78]">
                    Qty: {item.quantity} × {formatPrice(item.price)}
                  </p>
                </div>
                <span className="font-['JetBrains_Mono'] text-xs font-extrabold text-[#ffd88a]">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing calculations */}
          <div className="space-y-3 font-['JetBrains_Mono'] text-xs text-[#9c8f78] pt-4 border-t border-white/5">
            <div className="flex justify-between">
              <span>Gross Subtotal</span>
              <span className="font-semibold text-[#e0e2ed]">
                {formatPrice(subtotal)}
              </span>
            </div>

            {couponDiscount > 0 && (
              <div className="flex justify-between text-[#ffd88a] font-bold">
                <span>Voucher Privilege</span>
                <span>-{formatPrice(couponDiscount)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Transport ({deliveryMethod})</span>
              <span className="font-semibold text-[#e0e2ed]">
                {effectiveShipping === 0 ? 'COMPLIMENTARY' : formatPrice(effectiveShipping)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Telemetry Duties (8%)</span>
              <span className="font-semibold text-[#e0e2ed]">
                {formatPrice(tax)}
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-4 border-t border-white/5">
              <span className="font-['Sora'] font-black text-base text-[#e0e2ed]">
                Net Authorization
              </span>
              <span className="font-['JetBrains_Mono'] font-extrabold text-2xl text-[#ffd88a]">
                {formatPrice(finalOrderTotal)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
