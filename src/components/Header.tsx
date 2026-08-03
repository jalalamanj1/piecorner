import React from 'react';
import { RestaurantConfig } from '../types';
import { Phone, MapPin } from 'lucide-react';
import { createRipple } from '../utils/ripple';
import { resolveImageUrl } from '../utils/image';

interface HeaderProps {
  config: RestaurantConfig;
}

export const Header: React.FC<HeaderProps> = ({ config }) => {
  return (
    <header className="sticky top-0 z-50 px-3 py-2 w-full max-w-lg mx-auto">
      <div className="glass-panel rounded-2xl px-3.5 py-2 flex items-center justify-between gap-2 border border-white/20 shadow-xl backdrop-blur-xl">
        {/* Brand identity */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-[#FFBA08]/40 shadow-md bg-black/40 shrink-0">
            <img
              src={resolveImageUrl('icon-128.png')}
              alt={config.restaurantName}
              className="w-full h-full object-cover"
              decoding="async"
            />
          </div>
          <h1 className="text-lg font-black text-white leading-tight truncate">
            {config.restaurantName}
          </h1>
        </div>

        {/* Call + Location buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={(e) => {
              createRipple(e);
              if (config.phone) {
                window.open(`tel:${config.phone}`, '_self');
              }
            }}
            className="ripple-button w-10 h-10 rounded-xl glass-button-secondary text-white flex items-center justify-center border border-white/25 active:scale-95 transition-all"
            title="اتصال"
            aria-label="اتصال"
          >
            <Phone className="w-4.5 h-4.5 text-[#E85D04]" />
          </button>
          <button
            onClick={(e) => {
              createRipple(e);
              window.open(config.locationLink || 'https://maps.google.com', '_blank', 'noopener,noreferrer');
            }}
            className="ripple-button w-10 h-10 rounded-xl glass-button-secondary text-white flex items-center justify-center border border-white/25 active:scale-95 transition-all"
            title="الموقع"
            aria-label="الموقع"
          >
            <MapPin className="w-4.5 h-4.5 text-[#FFBA08]" />
          </button>
        </div>
      </div>
    </header>
  );
};
