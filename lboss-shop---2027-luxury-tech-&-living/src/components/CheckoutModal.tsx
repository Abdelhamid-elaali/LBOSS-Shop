import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { formatCurrency } from '../utils/shopLogic';

export const CheckoutModal: React.FC = () => {
  const { isCheckoutModalOpen, setIsCheckoutModalOpen, cartTotals, cartItems, showToast, setCurrentScreen } =
    useShop();

  const [step, setStep] = useState<2 | 3 | 4>(2);
  const [transitMethod, setTransitMethod] = useState<'white-glove' | 'armored-air'>('white-glove');
  const [paymentMethod, setPaymentMethod] = useState<'apple-pay' | 'google-pay' | 'crypto-vault' | 'card'>('crypto-vault');

  const [formData, setFormData] = useState({
    fullName: 'Alexander Sterling',
    email: 'sterling.exec@sovereign.io',
    address: 'One Central Park West, Penthouse 48',
    city: 'New York',
    country: 'United States',
    postalCode: '10023',
    biometricPin: '••••••••',
  });

  const [isProcessing, setIsProcessing] = useState(false);

  if (!isCheckoutModalOpen) return null;

  const handleExecuteOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(4); // Order Confirmed
      showToast('Quantum Vault Allocation Cleared • Order Sealed');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#181b24] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#10131b]">
          <div className="flex items-center gap-3">
            <span className="font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-[#ffd88a] font-bold">
              ORDER SEQUENCE 2027-V9 // {step === 4 ? 'DISPATCH CONFIRMED' : `STEP 0${step} OF 03`}
            </span>
          </div>
          <button
            onClick={() => {
              setIsCheckoutModalOpen(false);
              setStep(2);
            }}
            className="p-1.5 rounded-lg text-[#9c8f78] hover:text-[#e0e2ed] hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close checkout"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Step Indicator */}
        {step < 4 && (
          <div className="px-6 pt-4 pb-2 bg-[#14171f] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-white/10 text-xs font-['JetBrains_Mono'] flex items-center justify-center text-[#d4c5ac]">
                1
              </span>
              <span className="font-['JetBrains_Mono'] text-xs text-[#9c8f78]">Allocation</span>
            </div>
            <div className="w-8 h-px bg-white/10"></div>
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full text-xs font-['JetBrains_Mono'] flex items-center justify-center font-bold ${
                  step === 2
                    ? 'bg-[#f5b700] text-[#402d00]'
                    : 'bg-white/10 text-[#d4c5ac]'
                }`}
              >
                2
              </span>
              <span
                className={`font-['JetBrains_Mono'] text-xs font-bold ${
                  step === 2 ? 'text-[#ffd88a]' : 'text-[#d4c5ac]'
                }`}
              >
                Transit Armored
              </span>
            </div>
            <div className="w-8 h-px bg-white/10"></div>
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full text-xs font-['JetBrains_Mono'] flex items-center justify-center font-bold ${
                  step === 3
                    ? 'bg-[#f5b700] text-[#402d00]'
                    : 'bg-white/10 text-[#d4c5ac]'
                }`}
              >
                3
              </span>
              <span
                className={`font-['JetBrains_Mono'] text-xs font-bold ${
                  step === 3 ? 'text-[#ffd88a]' : 'text-[#d4c5ac]'
                }`}
              >
                Vault Pay
              </span>
            </div>
          </div>
        )}

        {/* Step 2: Transit Armored Details */}
        {step === 2 && (
          <div className="p-6 flex flex-col gap-5">
            <div>
              <h3 className="font-['Sora'] text-xl font-bold text-[#e0e2ed]">
                Encrypted Diplomatic Transit Address
              </h3>
              <p className="font-['Manrope'] text-xs text-[#9c8f78] mt-1">
                Your destination is protected under our Tier-1 zero-disclosure security protocol.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-['Manrope'] text-sm">
              <div className="flex flex-col gap-1.5">
                <label className="font-['JetBrains_Mono'] text-xs text-[#d4c5ac]">Full Name</label>
                <input
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="bg-[#10131b] border border-white/10 rounded-xl px-4 py-2.5 text-[#e0e2ed] focus:outline-none focus:ring-1 focus:ring-[#f5b700]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-['JetBrains_Mono'] text-xs text-[#d4c5ac]">Confidential Terminal Email</label>
                <input
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-[#10131b] border border-white/10 rounded-xl px-4 py-2.5 text-[#e0e2ed] focus:outline-none focus:ring-1 focus:ring-[#f5b700]"
                />
              </div>
              <div className="md:col-span-2 flex flex-col gap-1.5">
                <label className="font-['JetBrains_Mono'] text-xs text-[#d4c5ac]">Destination Address</label>
                <input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="bg-[#10131b] border border-white/10 rounded-xl px-4 py-2.5 text-[#e0e2ed] focus:outline-none focus:ring-1 focus:ring-[#f5b700]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-['JetBrains_Mono'] text-xs text-[#d4c5ac]">City</label>
                <input
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="bg-[#10131b] border border-white/10 rounded-xl px-4 py-2.5 text-[#e0e2ed] focus:outline-none focus:ring-1 focus:ring-[#f5b700]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-['JetBrains_Mono'] text-xs text-[#d4c5ac]">Postal Code</label>
                <input
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="bg-[#10131b] border border-white/10 rounded-xl px-4 py-2.5 text-[#e0e2ed] focus:outline-none focus:ring-1 focus:ring-[#f5b700]"
                />
              </div>
            </div>

            {/* Courier Selection */}
            <div className="flex flex-col gap-2 pt-2">
              <span className="font-['JetBrains_Mono'] text-xs text-[#d4c5ac] uppercase font-bold">
                Select Bonded Courier Protocol
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTransitMethod('white-glove')}
                  className={`p-3 rounded-xl border text-left flex flex-col gap-1 cursor-pointer transition-all ${
                    transitMethod === 'white-glove'
                      ? 'bg-[#1c1f28] border-[#f5b700] ring-1 ring-[#f5b700]'
                      : 'bg-[#10131b] border-white/5 hover:bg-[#1c1f28]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-['Sora'] text-sm font-bold text-[#e0e2ed]">
                      White-Glove Armored Courier
                    </span>
                    <span className="font-['JetBrains_Mono'] text-xs text-[#ffd88a] font-bold">
                      FREE
                    </span>
                  </div>
                  <span className="font-['Manrope'] text-xs text-[#9c8f78]">
                    Signature-mandated temperature-controlled armored vehicle.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setTransitMethod('armored-air')}
                  className={`p-3 rounded-xl border text-left flex flex-col gap-1 cursor-pointer transition-all ${
                    transitMethod === 'armored-air'
                      ? 'bg-[#1c1f28] border-[#f5b700] ring-1 ring-[#f5b700]'
                      : 'bg-[#10131b] border-white/5 hover:bg-[#1c1f28]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-['Sora'] text-sm font-bold text-[#e0e2ed]">
                      Armored Diplomatic Air Freight
                    </span>
                    <span className="font-['JetBrains_Mono'] text-xs text-[#ffd88a] font-bold">
                      +$120
                    </span>
                  </div>
                  <span className="font-['Manrope'] text-xs text-[#9c8f78]">
                    Expedited intercontinental priority transit within 24 hours.
                  </span>
                </button>
              </div>
            </div>

            {/* Next Action */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <span className="font-['JetBrains_Mono'] text-xs text-[#9c8f78]">
                Total: <strong className="text-[#ffd88a] text-sm">{formatCurrency(cartTotals.finalTotal)}</strong>
              </span>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-xl bg-[#f5b700] text-[#402d00] font-['Sora'] text-sm font-bold hover:bg-[#ffd88a] transition-all flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <span>Continue to Vault Pay</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Vault Pay Execution */}
        {step === 3 && (
          <div className="p-6 flex flex-col gap-5">
            <div>
              <h3 className="font-['Sora'] text-xl font-bold text-[#e0e2ed]">
                Execute Vault Disbursement
              </h3>
              <p className="font-['Manrope'] text-xs text-[#9c8f78] mt-1">
                Quantum-safe encrypted transaction with immediate cryptographic escrow verification.
              </p>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('crypto-vault')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                  paymentMethod === 'crypto-vault'
                    ? 'bg-[#1c1f28] border-[#f5b700] text-[#ffd88a]'
                    : 'bg-[#10131b] border-white/5 text-[#d4c5ac]'
                }`}
              >
                <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                <span className="font-['JetBrains_Mono'] text-xs font-bold">Crypto Vault</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('apple-pay')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                  paymentMethod === 'apple-pay'
                    ? 'bg-[#1c1f28] border-[#f5b700] text-[#ffd88a]'
                    : 'bg-[#10131b] border-white/5 text-[#d4c5ac]'
                }`}
              >
                <span className="font-['JetBrains_Mono'] text-lg font-bold"></span>
                <span className="font-['JetBrains_Mono'] text-xs font-bold">Apple Pay</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('google-pay')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                  paymentMethod === 'google-pay'
                    ? 'bg-[#1c1f28] border-[#f5b700] text-[#ffd88a]'
                    : 'bg-[#10131b] border-white/5 text-[#d4c5ac]'
                }`}
              >
                <span className="font-['JetBrains_Mono'] text-lg font-bold">G</span>
                <span className="font-['JetBrains_Mono'] text-xs font-bold">Google Pay</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-[#1c1f28] border-[#f5b700] text-[#ffd88a]'
                    : 'bg-[#10131b] border-white/5 text-[#d4c5ac]'
                }`}
              >
                <span className="material-symbols-outlined text-2xl">credit_card</span>
                <span className="font-['JetBrains_Mono'] text-xs font-bold">Infinite Card</span>
              </button>
            </div>

            {/* Payment Details Form */}
            {paymentMethod === 'crypto-vault' && (
              <div className="p-4 rounded-xl bg-[#10131b] border border-white/5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-['JetBrains_Mono'] text-xs text-[#d4c5ac]">Vault Multi-Sig Node</span>
                  <span className="font-['JetBrains_Mono'] text-xs text-emerald-400 font-bold">Connected • 0x8F9...A32</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#181b24] font-['JetBrains_Mono'] text-xs text-[#ffd88a] break-all border border-white/5">
                  vault:lboss-sovereign-0x892f39c049d921b773a4b9c8
                </div>
                <div className="flex items-center gap-2 text-xs text-[#9c8f78]">
                  <span className="material-symbols-outlined text-base text-[#ffd88a]">lock</span>
                  <span>Instant zero-gas settlement via Layer-1 Sovereign Rollup.</span>
                </div>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="flex flex-col gap-3 font-['Manrope'] text-sm">
                <div className="flex flex-col gap-1">
                  <label className="font-['JetBrains_Mono'] text-xs text-[#d4c5ac]">Card Number</label>
                  <input
                    defaultValue="•••• •••• •••• 8842 (Visa Infinite Concierge)"
                    className="bg-[#10131b] border border-white/10 rounded-xl px-4 py-2.5 text-[#e0e2ed] focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="font-['JetBrains_Mono'] text-xs text-[#d4c5ac]">Expires</label>
                    <input
                      defaultValue="12/29"
                      className="bg-[#10131b] border border-white/10 rounded-xl px-4 py-2.5 text-[#e0e2ed] focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-['JetBrains_Mono'] text-xs text-[#d4c5ac]">CVC</label>
                    <input
                      defaultValue="982"
                      className="bg-[#10131b] border border-white/10 rounded-xl px-4 py-2.5 text-[#e0e2ed] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Total breakdown preview */}
            <div className="p-4 rounded-xl bg-[#14171f] flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-[#d4c5ac]">
                <span>Allocation Subtotal ({cartTotals.itemCount} items)</span>
                <span>{formatCurrency(cartTotals.subtotal)}</span>
              </div>
              {cartTotals.discount > 0 && (
                <div className="flex items-center justify-between text-xs text-[#cabeff]">
                  <span>VIP Voucher Rebate</span>
                  <span>-{formatCurrency(cartTotals.discount)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-xs text-[#d4c5ac]">
                <span>Armored Courier</span>
                <span className="text-[#ffd88a]">COMPLIMENTARY</span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#d4c5ac]">
                <span>Duty &amp; Global Tax</span>
                <span>{formatCurrency(cartTotals.tax)}</span>
              </div>
              <div className="h-px bg-white/10 my-1"></div>
              <div className="flex items-center justify-between text-sm font-bold">
                <span className="font-['Sora'] text-[#e0e2ed]">Total Disbursement</span>
                <span className="font-['JetBrains_Mono'] text-xl text-[#f5b700]">
                  {formatCurrency(cartTotals.finalTotal)}
                </span>
              </div>
            </div>

            {/* Confirm button */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 text-xs font-['JetBrains_Mono'] text-[#9c8f78] hover:text-[#e0e2ed] transition-colors"
              >
                Back to Transit
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleExecuteOrder}
                className="px-8 py-3.5 rounded-xl bg-[#f5b700] hover:bg-[#ffd88a] text-[#402d00] font-['Sora'] font-bold text-sm flex items-center gap-2 cursor-pointer transition-all shadow-[0_12px_24px_-6px_rgba(245,183,0,0.4)] disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <span className="material-symbols-outlined text-lg animate-spin">sync</span>
                    <span>Authorizing Quantum Vault Key...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">enhanced_encryption</span>
                    <span>Confirm &amp; Seal Allocation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Dispatch Confirmed Receipt */}
        {step === 4 && (
          <div className="p-8 flex flex-col items-center text-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#f5b700]/20 text-[#f5b700] flex items-center justify-center border border-[#f5b700]/40 shadow-[0_0_30px_rgba(245,183,0,0.3)]">
              <span className="material-symbols-outlined text-3xl">verified</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-['JetBrains_Mono'] text-xs text-[#f5b700] tracking-widest font-bold uppercase">
                VAULT HANDSHAKE SEALED
              </span>
              <h3 className="font-['Sora'] text-2xl font-bold text-[#e0e2ed]">
                Allocation Successfully Dispatched
              </h3>
              <p className="font-['Manrope'] text-sm text-[#d4c5ac] max-w-md">
                Tracking protocol <span className="font-['JetBrains_Mono'] text-[#ffd88a]">#LB-2027-V9-8834</span> has been issued.
                Your armored flight case is being prepared at our Zurich facility.
              </p>
            </div>

            <div className="w-full bg-[#10131b] border border-white/5 rounded-xl p-4 flex flex-col gap-2.5 text-left font-['JetBrains_Mono'] text-xs">
              <div className="flex items-center justify-between text-[#9c8f78]">
                <span>COURIER ASSIGNMENT</span>
                <span className="text-[#e0e2ed]">Bonded Courier #042 (Geneva - New York)</span>
              </div>
              <div className="flex items-center justify-between text-[#9c8f78]">
                <span>DESTINATION</span>
                <span className="text-[#e0e2ed]">{formData.address}, {formData.city}</span>
              </div>
              <div className="flex items-center justify-between text-[#9c8f78]">
                <span>DISBURSED AMOUNT</span>
                <span className="text-[#f5b700] font-bold">{formatCurrency(cartTotals.finalTotal)}</span>
              </div>
              <div className="flex items-center justify-between text-[#9c8f78]">
                <span>WARRANTY ACTIVATION</span>
                <span className="text-emerald-400">5-Year Biometric Vault Warranty Active</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCheckoutModalOpen(false);
                setStep(2);
                setCurrentScreen('home');
              }}
              className="w-full py-3.5 rounded-xl bg-[#f5b700] text-[#402d00] font-['Sora'] text-sm font-bold hover:bg-[#ffd88a] transition-colors cursor-pointer"
            >
              Return to Executive Showroom
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
