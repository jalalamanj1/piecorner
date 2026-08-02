import React from 'react';
import { RestaurantConfig } from '../types';

interface HeroProps {
  config: RestaurantConfig;
}

export const Hero: React.FC<HeroProps> = ({ config }) => {
  return (
    <section className="px-3 pt-1 pb-3 w-full max-w-lg mx-auto">
      <div className="relative h-[190px] w-full rounded-[24px] overflow-hidden glass-card border border-white/20 shadow-2xl group">
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop"
          alt="بيتزا وفطائر باي كورنر"
          className="absolute inset-0 w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-1000"
        />

        {/* Gradient Glass Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent backdrop-blur-[2px]" />

        {/* Subtle Ambient Light Effect */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#E85D04]/30 rounded-full blur-2xl pointer-events-none" />

        {/* Content Container */}
        <div className="absolute inset-0 p-5 flex flex-col justify-end">
          <div className="glass-panel p-3.5 rounded-2xl border border-white/20 bg-black/40 backdrop-blur-md">
            <span className="inline-block text-[10px] font-bold text-[#FFBA08] bg-[#E85D04]/30 px-2 py-0.5 rounded-md border border-[#FFBA08]/30 mb-1">
              طعم فاخر من فرن الحطب 🔥
            </span>
            <p className="text-xs sm:text-sm font-extrabold text-white leading-snug">
              {config.slogan || "عالم من الفطائر الذهبية والبيتزا الفاخرة المحضرة بحب وشغف"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
