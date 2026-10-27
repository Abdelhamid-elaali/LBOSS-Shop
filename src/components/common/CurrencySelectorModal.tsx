import React from 'react';
import { X, Check, MapPin, Compass, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectCurrency,
  selectIsCurrencySelectorOpen,
  setCurrencySelectorOpen,
  setCurrencyByCode,
  autoDetectLocationCurrency,
} from '../../features/ui/uiSlice';
import { SUPPORTED_CURRENCIES } from '../../lib/currencies';
import { Button } from '../ui/Button';

export const CurrencySelectorModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentCurrency = useAppSelector(selectCurrency);
  const isOpen = useAppSelector(selectIsCurrencySelectorOpen);

  const handleClose = () => dispatch(setCurrencySelectorOpen(false));

  const handleSelect = (code: string) => {
    dispatch(setCurrencyByCode(code));
    toast.success(`Currency switched to ${SUPPORTED_CURRENCIES[code].flag} ${code} (${SUPPORTED_CURRENCIES[code].symbol})`, {
      style: {
        background: '#181b24',
        color: '#ffd88a',
        fontFamily: 'JetBrains Mono',
        border: '1px solid rgba(245, 183, 0, 0.4)',
      },
    });
    handleClose();
  };

  const handleAutoDetect = () => {
    dispatch(autoDetectLocationCurrency());
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    toast.success(`Location detected from timezone (${tz})!`, {
      style: {
        background: '#181b24',
        color: '#ffd88a',
        fontFamily: 'JetBrains Mono',
        border: '1px solid rgba(245, 183, 0, 0.4)',
      },
    });
    handleClose();
  };

  const currenciesList = Object.values(SUPPORTED_CURRENCIES);

  return (
    <AnimatePresence>
      {isOpen && (
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
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-lg bg-[#14171f] text-[#e0e2ed] border border-white/15 rounded-none shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#181b24]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-none bg-[#f5b700]/15 text-[#ffd88a] border border-[#f5b700]/30 shadow-sm">
                  <Globe className="w-5 h-5 text-[#f5b700]" />
                </div>
                <div>
                  <h3 className="font-['Sora'] font-bold text-lg text-[#e0e2ed]">
                    Regional Currency &amp; Country
                  </h3>
                  <p className="font-['JetBrains_Mono'] text-xs text-[#9c8f78]">
                    Global telemetry exchange rates
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-none text-[#9c8f78] hover:text-[#e0e2ed] hover:bg-[#1c1f28] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Auto-detect button banner */}
              <div className="p-4 rounded-none bg-[#1c1f28] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 text-xs font-['Manrope']">
                  <Compass className="w-4 h-4 text-[#f5b700] shrink-0" />
                  <div>
                    <p className="font-bold text-[#e0e2ed]">Auto-Detect from System Time</p>
                    <p className="text-[#9c8f78] font-['JetBrains_Mono'] text-[11px]">
                      {Intl.DateTimeFormat().resolvedOptions().timeZone}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleAutoDetect}
                  variant="primary"
                  size="sm"
                  className="gap-1.5 shrink-0 rounded-none"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Detect Location</span>
                </Button>
              </div>

              {/* Currency options list */}
              <div>
                <label className="block font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-wider text-[#9c8f78] mb-3">
                  Select Country &amp; Currency
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-80 overflow-y-auto pr-1">
                  {currenciesList.map((curr) => {
                    const isSelected = currentCurrency.code === curr.code;
                    return (
                      <button
                        key={curr.code}
                        onClick={() => handleSelect(curr.code)}
                        className={`flex items-center justify-between p-3.5 rounded-none border transition-all cursor-pointer text-left ${
                          isSelected
                            ? 'bg-[#f5b700]/15 border-[#f5b700] shadow-[0_0_15px_rgba(245,183,0,0.15)]'
                            : 'bg-[#181b24] border-white/10 hover:border-white/20 hover:bg-[#1c1f28]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{curr.flag}</span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-['Sora'] text-xs font-bold text-[#e0e2ed]">
                                {curr.country}
                              </span>
                            </div>
                            <p className="font-['JetBrains_Mono'] text-[11px] text-[#ffd88a] font-semibold">
                              {curr.code} ({curr.symbol}) • {curr.name}
                            </p>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-none bg-[#f5b700] text-[#0b0e16] flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rate hint */}
              <div className="p-3.5 rounded-none bg-[#0b0e16] border border-white/10 font-['JetBrains_Mono'] text-xs text-[#9c8f78] flex items-center justify-between">
                <span>Active Reference Rate:</span>
                <span className="font-bold text-[#ffd88a]">
                  1 USD = {currentCurrency.rate} {currentCurrency.code}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
