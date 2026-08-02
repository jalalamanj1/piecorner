import React from 'react';
import { MenuItem } from '../types';
import { Flame, ChevronDown } from 'lucide-react';
import { getItemEmoji } from '../utils/foodEmoji';
import { resolveImageUrl } from '../utils/image';

interface FeaturedProps {
  featuredItems: MenuItem[];
  isOpen: boolean;
  onToggle: () => void;
}

export const Featured: React.FC<FeaturedProps> = ({
  featuredItems = [],
  isOpen,
  onToggle,
}) => {
  return (
    <section id="featured" className="px-3 py-2 w-full max-w-lg mx-auto space-y-2">
      {/* Clickable Section Header Dropdown Bar */}
      <button
        onClick={onToggle}
        className="w-full glass-panel p-3.5 rounded-2xl border border-white/20 flex items-center justify-between text-right hover:border-[#FFBA08]/50 transition-all duration-300 group focus:outline-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#E85D04]/20 border border-[#E85D04]/40 text-[#FFBA08]">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-black text-white group-hover:text-[#FFBA08] transition-colors">
              الأكثر طلبًا ⭐
            </h2>
            <p className="text-[10px] text-white/60 font-medium">
              أصناف مميزة يُنصح بتجربتها
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="glass-pill px-2.5 py-1 rounded-full text-[10px] font-bold text-[#FFBA08] border border-white/20">
            {featuredItems.length} أصناف
          </span>
          <div className={`p-1.5 rounded-full glass-card border border-white/20 text-white/80 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#FFBA08]' : ''}`}>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </button>

      {/* Collapsible Content */}
      <div className={`accordion-collapse ${isOpen ? 'open' : ''}`}>
        <div className="accordion-collapse-inner pt-1">
          {featuredItems.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto scrollbar-none pt-1 pb-3 px-1 -mx-1 snap-x snap-mandatory">
              {featuredItems.map((item) => (
                <div
                  key={item.id}
                  className="snap-start shrink-0 w-[240px] glass-card rounded-[22px] p-3.5 border border-white/20 flex flex-col justify-between relative group"
                >
                  {/* Card Image */}
                  <div className="relative h-28 w-full rounded-xl overflow-hidden mb-2.5 bg-black/40 border border-white/10">
                    {item.image ? (
                      <img
                        src={resolveImageUrl(item.image)}
                        alt={item.nameAr}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#E85D04]/25 to-[#FFBA08]/10">
                        <span className="text-5xl drop-shadow-lg">
                          {getItemEmoji(item.nameAr)}
                        </span>
                      </div>
                    )}
                    {item.badge && (
                      <span className="absolute top-2 right-2 glass-pill px-2.5 py-0.5 rounded-full text-[10px] font-black text-[#FFBA08] border border-[#FFBA08]/40 shadow-md">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="space-y-1 mb-3">
                    <h3 className="text-sm font-extrabold text-white line-clamp-1 group-hover:text-[#FFBA08] transition-colors">
                      {item.nameAr}
                    </h3>
                    <p className="text-[11px] text-white/70 line-clamp-2 leading-relaxed font-medium">
                      {item.descriptionAr}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between mt-auto">
                    <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-l from-[#FFBA08] to-[#E85D04]">
                      {item.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State Placeholder Glass Card */
            <div className="glass-panel rounded-[22px] p-5 text-center border-2 border-dashed border-white/20 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl glass-card flex items-center justify-center text-[#FFBA08] border border-white/20 shadow-md">
                <Flame className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">
                  سيتم إضافة الأصناف الأكثر طلبًا قريبًا
                </p>
                <p className="text-[11px] text-white/60 font-medium">
                  جميع البيانات تنهمر ديناميكياً بدون أي إدخال إجباري مسبق.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
