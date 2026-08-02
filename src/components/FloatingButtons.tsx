import React from 'react';
import { RestaurantConfig } from '../types';
import { Phone, ShoppingCart, MapPin } from 'lucide-react';
import { createRipple } from '../utils/ripple';

interface FloatingButtonsProps {
  config: RestaurantConfig;
}

export const FloatingButtons: React.FC<FloatingButtonsProps> = ({ config }) => {
  return (
    <div className="fixed bottom-20 left-4 z-40 flex flex-col gap-2.5 items-center">
      {/* Location Button */}
      <button
        onClick={(e) => {
          createRipple(e);
          if (config.locationLink) {
            window.open(config.locationLink, '_blank', 'noopener,noreferrer');
          } else {
            window.open('https://maps.google.com', '_blank', 'noopener,noreferrer');
          }
        }}
        className="ripple-button w-12 h-12 rounded-full glass-button-secondary text-white flex items-center justify-center border border-white/30 shadow-2xl group hover:scale-110 active:scale-95 transition-all"
        title="الموقع"
        aria-label="الموقع"
      >
        <MapPin className="w-5 h-5 text-[#FFBA08] group-hover:animate-bounce" />
      </button>

      {/* Order Button */}
      <button
        onClick={(e) => {
          createRipple(e);
          if (config.orderLink) {
            window.open(config.orderLink, '_blank', 'noopener,noreferrer');
          }
        }}
        className="ripple-button w-12 h-12 rounded-full glass-button-primary text-white flex items-center justify-center border border-white/40 shadow-2xl group hover:scale-110 active:scale-95 transition-all"
        title="طلب"
        aria-label="طلب"
      >
        <ShoppingCart className="w-5 h-5 text-white" />
      </button>

      {/* Call Button */}
      <button
        onClick={(e) => {
          createRipple(e);
          if (config.phone) {
            window.open(`tel:${config.phone}`, '_self');
          }
        }}
        className="ripple-button w-12 h-12 rounded-full glass-button-secondary text-white flex items-center justify-center border border-white/30 shadow-2xl group hover:scale-110 active:scale-95 transition-all"
        title="اتصال"
        aria-label="اتصال"
      >
        <Phone className="w-5 h-5 text-[#E85D04]" />
      </button>
    </div>
  );
};
