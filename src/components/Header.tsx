import React from 'react';
import { RestaurantConfig } from '../types';
import { Settings, Sparkles } from 'lucide-react';
import { createRipple } from '../utils/ripple';

interface HeaderProps {
  config: RestaurantConfig;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({ config, onOpenAdmin }) => {
  return (
    <header className="sticky top-0 z-50 px-3 py-2 w-full max-w-lg mx-auto">
      <div className="glass-panel rounded-2xl px-3.5 py-2 flex items-center justify-between border border-white/20 shadow-xl backdrop-blur-xl">
        {/* Brand identity */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#FFBA08]/40 shadow-md bg-black/40 shrink-0">
            <img
              src={config.logo}
              alt={config.restaurantName}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-base font-black text-white leading-tight flex items-center gap-1">
              <span>{config.restaurantName}</span>
              <Sparkles className="w-3.5 h-3.5 text-[#FFBA08]" />
            </h1>
            <p className="text-[10px] text-[#FFE8CC]/70 font-medium leading-none">
              مطعم البيتزا والفطائر
            </p>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={(e) => {
            createRipple(e);
            onOpenAdmin();
          }}
          className="ripple-button glass-button-secondary p-2 rounded-xl text-white/90 hover:text-[#FFBA08] transition-all flex items-center justify-center shrink-0 border border-white/20"
          title="إدارة القائمة والبيانات"
          aria-label="إدارة"
        >
          <Settings className="w-4 h-4 text-[#FFBA08]" />
        </button>
      </div>
    </header>
  );
};
