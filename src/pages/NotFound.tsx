import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ShoppingBag } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFound: React.FC = () => {
  useEffect(() => {
    document.title = '404 — Terminal Anomaly | LBOSS SHOP';
  }, []);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <span className="font-['JetBrains_Mono'] font-extrabold text-7xl sm:text-9xl text-[#f5b700]/15 block select-none mb-2">
          404
        </span>
        <h1 className="font-['Sora'] font-black text-2xl sm:text-3xl text-[#e0e2ed] mb-2">
          Terminal Route Unresolved
        </h1>
        <p className="font-['Manrope'] text-xs sm:text-sm text-[#9c8f78] mb-8 max-w-sm mx-auto leading-relaxed">
          The requested coordinate does not match active vault memory or has been restricted by executive protocol.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/">
            <Button variant="primary" size="md" className="gap-2">
              <Home className="w-4 h-4" />
              <span>Return Home</span>
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="outline" size="md" className="gap-2">
              <ShoppingBag className="w-4 h-4 text-[#f5b700]" />
              <span>2027 Catalog</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
