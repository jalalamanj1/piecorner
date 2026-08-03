import React from 'react';
import { MapPin, Phone, Utensils } from 'lucide-react';
import { RestaurantConfig } from '../types';
import { useLanguage } from '../i18n';

interface HeaderProps {
  config: RestaurantConfig;
  onOpenLocation: () => void;
  onOpenCall: () => void;
}

export const Header: React.FC<HeaderProps> = ({ config, onOpenLocation, onOpenCall }) => {
  const { lang, t } = useLanguage();

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-[#ECECEC] transition-all">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo & Restaurant Name */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-2xl overflow-hidden border border-[#ECECEC] bg-[#FAFAF8] flex items-center justify-center shrink-0 shadow-xs">
            {config.logo ? (
              <img
                src={config.logo}
                alt={config.name[lang]}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback icon if image fails
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : null}
            <Utensils className="w-5 h-5 text-[#4CAF50] absolute" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#222222] leading-none font-sans">
              {config.name[lang]}
            </h1>
            <p className="text-[11px] text-[#777777] font-medium mt-0.5 truncate max-w-[160px]">
              {config.tagline[lang]}
            </p>
          </div>
        </div>

        {/* Icon Buttons (Location & Call) */}
        <div className="flex items-center gap-2">
          {/* Location button */}
          <button
            onClick={onOpenLocation}
            className="w-10 h-10 rounded-2xl bg-[#FAFAF8] hover:bg-[#F2F2EE] active:scale-95 transition-all border border-[#ECECEC] flex items-center justify-center text-[#222222] shadow-xs cursor-pointer"
            aria-label={t('location')}
            title={t('location')}
          >
            <MapPin className="w-4 h-4 text-[#4CAF50]" />
          </button>

          {/* Call button */}
          <button
            onClick={onOpenCall}
            className="w-10 h-10 rounded-2xl bg-[#FAFAF8] hover:bg-[#F2F2EE] active:scale-95 transition-all border border-[#ECECEC] flex items-center justify-center text-[#222222] shadow-xs cursor-pointer"
            aria-label={t('call')}
            title={t('callTitle')}
          >
            <Phone className="w-4 h-4 text-[#FF8A30]" />
          </button>
        </div>
      </div>
    </header>
  );
};
