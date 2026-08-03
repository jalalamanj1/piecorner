import React from 'react';
import { MenuItem } from '../types';
import { Flame } from 'lucide-react';
import { getItemEmoji } from '../utils/foodEmoji';
import { SmartImage } from './SmartImage';

interface FeaturedProps {
  featuredItems: MenuItem[];
}

export const Featured: React.FC<FeaturedProps> = ({ featuredItems = [] }) => {
  return (
    <section id="featured" className="scroll-mt-[124px]">
      {featuredItems.length > 0 ? (
        <div className="flex gap-3 overflow-x-auto scrollbar-none px-3 pb-1 snap-x snap-mandatory">
          {featuredItems.map((item) => (
            <div
              key={item.id}
              className="snap-start shrink-0 w-[230px] glass-card rounded-[22px] p-3.5 border border-white/20 flex flex-col justify-between relative group"
            >
              {/* Card Image */}
              <div className="relative h-28 w-full rounded-xl overflow-hidden mb-2.5 bg-black/40 border border-white/10">
                <SmartImage
                  src={item.image}
                  alt={item.nameAr}
                  emoji={getItemEmoji(item.nameAr)}
                  wrapperClassName="w-full h-full"
                  imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  emojiClassName="text-5xl drop-shadow-lg"
                />
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
        <div className="glass-panel rounded-[22px] p-5 text-center border-2 border-dashed border-white/20 space-y-3 mx-3">
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
    </section>
  );
};
