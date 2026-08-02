import React, { useState } from 'react';
import { Home, Flame, Pizza, MapPin, Phone } from 'lucide-react';
import { createRipple } from '../utils/ripple';
import { RestaurantConfig } from '../types';

interface BottomNavProps {
  config?: RestaurantConfig;
}

export const BottomNav: React.FC<BottomNavProps> = ({ config }) => {
  const [activeTab, setActiveTab] = useState<string>('home');

  const navItems = [
    { id: 'home', label: 'الرئيسية', icon: Home, action: 'scroll-top' },
    { id: 'featured', label: 'الأكثر طلبًا', icon: Flame, action: 'scroll-featured' },
    { id: 'menu', label: 'القائمة', icon: Pizza, action: 'scroll-menu' },
    { id: 'location', label: 'الموقع', icon: MapPin, action: 'open-map' },
    { id: 'contact', label: 'اتصال', icon: Phone, action: 'open-phone' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLElement>, item: typeof navItems[0]) => {
    createRipple(e);
    setActiveTab(item.id);

    if (item.action === 'scroll-top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (item.action === 'scroll-featured') {
      const el = document.getElementById('featured');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (item.action === 'scroll-menu') {
      const el = document.getElementById('menu');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (item.action === 'open-map') {
      if (config?.locationLink) {
        window.open(config.locationLink, '_blank', 'noopener,noreferrer');
      } else {
        window.open('https://maps.google.com', '_blank', 'noopener,noreferrer');
      }
    } else if (item.action === 'open-phone') {
      if (config?.phone) {
        window.open(`tel:${config.phone}`, '_self');
      }
    }
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 px-3 py-2 w-full max-w-lg mx-auto">
      <div className="glass-panel rounded-2xl px-2 py-1.5 flex items-center justify-around border border-white/20 shadow-2xl backdrop-blur-2xl bg-black/60">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={(e) => handleNavClick(e, item)}
              className={`ripple-button relative py-1.5 px-2.5 rounded-xl flex flex-col items-center gap-1 transition-all duration-300 ${
                isActive
                  ? 'text-white'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              {/* Active Glow Pill Indicator */}
              {isActive && (
                <span className="absolute inset-0 bg-gradient-to-r from-[#E85D04]/30 to-[#FFBA08]/30 rounded-xl border border-[#FFBA08]/40 shadow-lg -z-10 animate-fade-in" />
              )}
              <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'text-[#FFBA08] scale-110' : ''}`} />
              <span className={`text-[10px] font-bold leading-none ${isActive ? 'text-white' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
