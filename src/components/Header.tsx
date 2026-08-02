import React from 'react';
import { RestaurantConfig } from '../types';
import { resolveImageUrl } from '../utils/image';

interface HeaderProps {
  config: RestaurantConfig;
}

export const Header: React.FC<HeaderProps> = ({ config }) => {
  return (
    <header className="sticky top-0 z-50 px-3 py-2 w-full max-w-lg mx-auto">
      <div className="glass-panel rounded-2xl px-3.5 py-2 flex items-center justify-center border border-white/20 shadow-xl backdrop-blur-xl">
        {/* Brand identity */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-[#FFBA08]/40 shadow-md bg-black/40 shrink-0">
            <img
              src={resolveImageUrl('icon.png')}
              alt={config.restaurantName}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-lg font-black text-white leading-tight flex items-center gap-1">
              <span>{config.restaurantName}</span>
            </h1>
            <p className="text-[10px] text-[#FFE8CC]/70 font-medium leading-none">
              {config.slogan}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
