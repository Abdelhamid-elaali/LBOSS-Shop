import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  PackageCheck,
  Heart,
  ShoppingBag,
  LogOut,
  MapPin,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout } from '../features/auth/authSlice';
import { selectOrders } from '../features/orders/ordersSlice';
import { selectWishlistCount } from '../features/wishlist/wishlistSlice';
import { selectCartCount } from '../features/cart/cartSlice';
import { useGetCurrentUserQuery } from '../features/api/apiSlice';
import { Button } from '../components/ui/Button';

export const Account: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);
  const orders = useAppSelector(selectOrders);
  const wishlistCount = useAppSelector(selectWishlistCount);
  const cartCount = useAppSelector(selectCartCount);

  const { data: freshUser } = useGetCurrentUserQuery(undefined, {
    skip: !user,
  });

  const currentUser = freshUser || user;

  useEffect(() => {
    document.title = 'Executive Profile — LBOSS SHOP';
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Session terminated');
    navigate('/');
  };

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h2 className="font-['Sora'] text-xl font-bold mb-4 text-[#e0e2ed]">
          VIP Authentication Required
        </h2>
        <Link to="/login">
          <Button variant="primary" size="md">
            Go to Authentication
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Profile Header Card */}
      <div className="rounded-3xl bg-[#14171f] border border-white/5 p-6 sm:p-10 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-white/5">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={currentUser.image || 'https://dummyjson.com/icon/emilys/128'}
                alt={currentUser.firstName}
                className="w-20 h-20 rounded-2xl object-cover bg-[#0b0e16] border-2 border-[#f5b700]/40 p-1 shadow-[0_0_20px_rgba(245,183,0,0.25)]"
              />
              <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-[#f5b700] ring-2 ring-[#10131b]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-['Sora'] font-black text-2xl sm:text-3xl text-[#e0e2ed]">
                  {currentUser.firstName} {currentUser.lastName}
                </h1>
                <span className="font-['JetBrains_Mono'] px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f5b700]/15 text-[#ffd88a] border border-[#f5b700]/30 shadow-sm">
                  VIP EXECUTIVE
                </span>
              </div>
              <p className="font-['JetBrains_Mono'] text-xs text-[#9c8f78] mt-1">
                @{currentUser.username} • CLEARANCE LEVEL: APEX 2027
              </p>
            </div>
          </div>

          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="gap-2 font-['JetBrains_Mono'] text-[#ffb4ab] border-[#ffb4ab]/30 hover:bg-[#ffb4ab]/10"
          >
            <LogOut className="w-4 h-4" />
            <span>Terminate Session</span>
          </Button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
          <Link
            to="/orders"
            className="p-5 rounded-2xl bg-[#0b0e16] border border-white/5 hover:border-[#f5b700]/40 transition-colors group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-wider text-[#9c8f78]">
                Dispatches
              </span>
              <PackageCheck className="w-4 h-4 text-[#f5b700] group-hover:scale-110 transition-transform" />
            </div>
            <p className="font-['JetBrains_Mono'] font-extrabold text-2xl text-[#ffd88a]">
              {orders.length}
            </p>
          </Link>

          <Link
            to="/wishlist"
            className="p-5 rounded-2xl bg-[#0b0e16] border border-white/5 hover:border-[#cabeff]/40 transition-colors group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-wider text-[#9c8f78]">
                Vault Watchlist
              </span>
              <Heart className="w-4 h-4 text-[#cabeff] group-hover:scale-110 transition-transform" />
            </div>
            <p className="font-['JetBrains_Mono'] font-extrabold text-2xl text-[#cabeff]">
              {wishlistCount}
            </p>
          </Link>

          <Link
            to="/cart"
            className="p-5 rounded-2xl bg-[#0b0e16] border border-white/5 hover:border-[#ffd88a]/40 transition-colors group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-wider text-[#9c8f78]">
                Cart Allocation
              </span>
              <ShoppingBag className="w-4 h-4 text-[#f5b700] group-hover:scale-110 transition-transform" />
            </div>
            <p className="font-['JetBrains_Mono'] font-extrabold text-2xl text-[#ffd88a]">
              {cartCount}
            </p>
          </Link>
        </div>
      </div>

      {/* Profile Details Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="rounded-3xl bg-[#14171f] border border-white/5 p-6 sm:p-8 shadow-sm space-y-4">
          <h3 className="font-['Sora'] font-bold text-base text-[#e0e2ed] pb-3 border-b border-white/5 flex items-center gap-2">
            <User className="w-4 h-4 text-[#f5b700]" />
            <span>Encrypted Dossier Coordinates</span>
          </h3>

          <div className="space-y-3 font-['JetBrains_Mono'] text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#9c8f78]">Terminal Email</span>
              <span className="font-semibold text-[#e0e2ed]">
                {currentUser.email}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#9c8f78]">Secure Line</span>
              <span className="font-semibold text-[#e0e2ed]">
                {currentUser.phone || '+1 555-0199'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#9c8f78]">Gender</span>
              <span className="font-semibold text-[#e0e2ed] capitalize">
                {currentUser.gender || 'Not specified'}
              </span>
            </div>
            {currentUser.company && (
              <div className="flex items-center justify-between">
                <span className="text-[#9c8f78]">Enterprise</span>
                <span className="font-semibold text-[#ffd88a]">
                  {currentUser.company.name} ({currentUser.company.title})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="rounded-3xl bg-[#14171f] border border-white/5 p-6 sm:p-8 shadow-sm space-y-4">
          <h3 className="font-['Sora'] font-bold text-base text-[#e0e2ed] pb-3 border-b border-white/5 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#f5b700]" />
            <span>Primary Dispatch Coordinate</span>
          </h3>

          <div className="space-y-3 font-['JetBrains_Mono'] text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#9c8f78]">Street Residence</span>
              <span className="font-semibold text-[#e0e2ed]">
                {currentUser.address?.address || '1745 T St NW'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#9c8f78]">City</span>
              <span className="font-semibold text-[#e0e2ed]">
                {currentUser.address?.city || 'Washington'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#9c8f78]">Sector / State</span>
              <span className="font-semibold text-[#e0e2ed]">
                {currentUser.address?.state || 'DC'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#9c8f78]">Postal Code</span>
              <span className="font-semibold text-[#e0e2ed]">
                {currentUser.address?.postalCode || '20009'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
