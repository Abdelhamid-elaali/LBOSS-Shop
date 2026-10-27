import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PackageCheck,
  ShoppingBag,
  Clock,
  MapPin,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectOrders } from '../features/orders/ordersSlice';
import { addToCart } from '../features/cart/cartSlice';
import { selectCurrency } from '../features/ui/uiSlice';
import { formatPrice } from '../lib/utils';
import { Button } from '../components/ui/Button';

export const Orders: React.FC = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectOrders);
  const currency = useAppSelector(selectCurrency);

  useEffect(() => {
    document.title = 'Courier Dispatches — LBOSS SHOP';
  }, []);

  const handleReorder = (order: typeof orders[0]) => {
    order.items.forEach((item) => {
      dispatch(
        addToCart({
          product: {
            id: item.id,
            title: item.title,
            price: item.price,
            discountPercentage: 0,
            rating: 5,
            stock: 99,
            category: 'general',
            images: [item.thumbnail],
            thumbnail: item.thumbnail,
            description: item.title,
          },
          quantity: item.quantity,
        })
      );
    });
    toast.success(`Assets from ${order.orderNumber} indexed into your cart!`, {
      style: { background: '#181b24', color: '#ffd88a', fontFamily: 'JetBrains Mono' },
    });
  };

  if (orders.length === 0) {
    return (
      <div className="max-w-[1920px] mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 rounded-2xl bg-[#14171f] border border-white/5 text-[#f5b700] flex items-center justify-center mx-auto mb-6 shadow-xl">
          <PackageCheck className="w-10 h-10" />
        </div>
        <h1 className="font-['Sora'] font-black text-3xl text-[#e0e2ed] mb-2">
          Zero Courier Dispatches Logged
        </h1>
        <p className="font-['Manrope'] text-sm text-[#9c8f78] max-w-sm mx-auto mb-8 leading-relaxed">
          No dispatch telemetry recorded in your executive session. Explore the 2027 collection to authorize your first acquisition.
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="pb-6 mb-8 border-b border-white/5 flex items-center justify-between">
        <div>
          <h1 className="font-['Sora'] font-black text-3xl sm:text-4xl text-[#e0e2ed]">
            Courier Dispatches
          </h1>
          <p className="font-['JetBrains_Mono'] text-xs sm:text-sm text-[#9c8f78] mt-1">
            TRACKING {orders.length} {orders.length === 1 ? 'DISPATCH MANIFEST' : 'DISPATCH MANIFESTS'}
          </p>
        </div>
        <Link to="/products">
          <Button variant="outline" size="sm" className="hidden sm:inline-flex gap-1.5 font-['JetBrains_Mono']">
            <ShoppingBag className="w-4 h-4 text-[#f5b700]" />
            <span>2027 Catalog</span>
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-3xl bg-[#14171f] border border-white/5 p-6 sm:p-8 shadow-sm overflow-hidden"
          >
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
              <div className="flex items-center gap-3.5">
                <span className="w-11 h-11 rounded-2xl bg-[#1c1f28] text-[#ffd88a] border border-white/5 flex items-center justify-center font-bold">
                  <PackageCheck className="w-5 h-5 text-[#f5b700]" />
                </span>
                <div>
                  <div className="flex items-center gap-2 font-['JetBrains_Mono']">
                    <span className="font-bold text-sm text-[#ffd88a]">
                      {order.orderNumber}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30">
                      {order.status}
                    </span>
                  </div>
                  <p className="font-['JetBrains_Mono'] text-xs text-[#9c8f78] mt-0.5 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-['JetBrains_Mono'] text-[10px] uppercase font-bold text-[#9c8f78]">Settled Total</p>
                  <p className="font-['JetBrains_Mono'] font-extrabold text-lg text-[#ffd88a]">
                    {formatPrice(order.total)}
                  </p>
                </div>
                <Button
                  onClick={() => handleReorder(order)}
                  variant="outline"
                  size="sm"
                  className="gap-1.5 ml-2 font-['JetBrains_Mono']"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#f5b700]" />
                  <span>Re-Acquire</span>
                </Button>
              </div>
            </div>

            {/* Items list */}
            <div className="py-6 space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 text-xs font-['JetBrains_Mono']">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-12 h-12 rounded-xl object-contain bg-[#0b0e16] p-1.5 border border-white/5"
                    />
                    <div>
                      <Link
                        to={`/products/${item.id}`}
                        className="font-['Sora'] font-bold text-sm text-[#e0e2ed] hover:text-[#ffd88a] line-clamp-1 transition-colors"
                      >
                        {item.title}
                      </Link>
                      <p className="text-[#9c8f78] mt-0.5">
                        Qty: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-[#ffd88a]">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Shipping footer */}
            <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between font-['JetBrains_Mono'] text-xs text-[#9c8f78] gap-2">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#f5b700]" />
                <span>
                  Delivering to: {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                  {order.shippingAddress.state} {order.shippingAddress.postalCode}
                </span>
              </div>
              <span className="font-medium capitalize text-[#d4c5ac]">
                {order.deliveryMethod} dispatch ({order.paymentMethod})
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
