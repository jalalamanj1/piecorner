import React from 'react';
import { MenuData, MenuItem } from '../types';
import { categories } from '../config';
import { AlertCircle, Flame, Leaf } from 'lucide-react';
import { getItemEmoji } from '../utils/foodEmoji';
import { SmartImage } from './SmartImage';

interface MenuSectionProps {
  menuData: MenuData;
  selectedCategory?: string;
}

// Each category is a horizontally side-scrollable row of item cards.
export const MenuSection: React.FC<MenuSectionProps> = ({
  menuData,
  selectedCategory = 'all',
}) => {
  const displayedCategories = selectedCategory === 'all'
    ? categories
    : categories.filter((c) => c.id === selectedCategory);

  return (
    <>
      {displayedCategories.map((category) => {
        const itemsKey = category.id as keyof MenuData;
        const items: MenuItem[] = (menuData[itemsKey] as MenuItem[]) || [];

        return (
          <section key={category.id} id={category.id} className="scroll-mt-[124px]">
            {items.length > 0 ? (
              <div className="flex gap-3 overflow-x-auto scrollbar-none px-3 pb-1 snap-x snap-mandatory">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="snap-start shrink-0 w-[150px] glass-card rounded-[18px] overflow-hidden border border-white/20 relative group flex flex-col"
                  >
                    {/* Item Image (square) */}
                    <div className="relative h-24 w-full overflow-hidden bg-black/40 border-b border-white/10">
                      <SmartImage
                        src={item.image}
                        alt={item.nameAr}
                        emoji={getItemEmoji(item.nameAr)}
                        wrapperClassName="w-full h-full"
                        imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        emojiClassName="text-3xl drop-shadow-lg"
                      />
                      {item.badge && (
                        <span className="absolute top-1.5 right-1.5 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded-md text-[8px] font-black text-[#FFBA08]">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    {/* Item Body */}
                    <div className="p-2.5 flex flex-col gap-1 flex-1">
                      <h4 className="text-[12px] font-extrabold text-white group-hover:text-[#FFBA08] transition-colors leading-snug line-clamp-1">
                        {item.nameAr}
                      </h4>
                      <span className="text-[12px] font-black text-transparent bg-clip-text bg-gradient-to-l from-[#FFBA08] to-[#E85D04]">
                        {item.price}
                      </span>
                      {item.descriptionAr && (
                        <p className="text-[9px] text-white/60 line-clamp-1 leading-relaxed font-medium">
                          {item.descriptionAr}
                        </p>
                      )}

                      {(item.calories || item.isVegetarian || item.isSpicy) && (
                        <div className="flex items-center gap-1 mt-auto pt-1 flex-wrap">
                          {item.calories && (
                            <span className="text-[8px] text-[#FFE8CC]/70 bg-white/5 px-1.5 py-0.5 rounded-md border border-white/10">
                              {item.calories}
                            </span>
                          )}
                          {item.isVegetarian && (
                            <span className="text-[8px] text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded-md border border-emerald-500/30 flex items-center gap-0.5">
                              <Leaf className="w-2 h-2" /> نباتي
                            </span>
                          )}
                          {item.isSpicy && (
                            <span className="text-[8px] text-rose-400 bg-rose-950/40 px-1.5 py-0.5 rounded-md border border-rose-500/30 flex items-center gap-0.5">
                              <Flame className="w-2 h-2" /> حار
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State Placeholder Glass Card */
              <div className="glass-panel rounded-[22px] p-5 text-center border-2 border-dashed border-white/20 space-y-2 mx-3">
                <div className="w-10 h-10 mx-auto rounded-xl glass-card flex items-center justify-center text-[#FFBA08] border border-white/20">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-white">{category.titleAr}</p>
                <p className="text-[10px] text-white/50 font-medium">
                  سيتم إضافة الأصناف قريبًا
                </p>
              </div>
            )}
          </section>
        );
      })}
    </>
  );
};
