import React from 'react';
import { MenuData, MenuItem } from '../types';
import { categories } from '../config';
import {
  AlertCircle,
  Pizza,
  PieChart,
  Cake,
  Coffee,
  Flame,
  Leaf,
  ChevronDown,
  Beef,
  Croissant,
  Milk
} from 'lucide-react';
import { getItemEmoji } from '../utils/foodEmoji';
import { resolveImageUrl } from '../utils/image';
import { SmartImage } from './SmartImage';

interface MenuSectionProps {
  menuData: MenuData;
  selectedCategory?: string;
  openCategory: string | null;
  onToggleCategory: (catId: string) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  menuData,
  selectedCategory = 'all',
  openCategory,
  onToggleCategory,
}) => {

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Pizza':
        return <Pizza className="w-5 h-5 text-[#FFBA08]" />;
      case 'PieChart':
        return <PieChart className="w-5 h-5 text-[#E85D04]" />;
      case 'Beef':
        return <Beef className="w-5 h-5 text-[#FFBA08]" />;
      case 'Croissant':
        return <Croissant className="w-5 h-5 text-[#E85D04]" />;
      case 'Cake':
        return <Cake className="w-5 h-5 text-[#FFBA08]" />;
      case 'Milk':
        return <Milk className="w-5 h-5 text-[#E85D04]" />;
      case 'Coffee':
        return <Coffee className="w-5 h-5 text-[#FFBA08]" />;
      default:
        return <Pizza className="w-5 h-5 text-[#FFBA08]" />;
    }
  };

  const displayedCategories = selectedCategory === 'all'
    ? categories
    : categories.filter((c) => c.id === selectedCategory);

  return (
    <section id="menu" className="px-3 py-2 w-full max-w-lg mx-auto space-y-3">
      {displayedCategories.map((category) => {
        // Retrieve array safely
        const itemsKey = category.id as keyof MenuData;
        const items: MenuItem[] = (menuData[itemsKey] as MenuItem[]) || [];
        const isOpen = openCategory === category.id;

        return (
          <div key={category.id} id={`section-${category.id}`} className="space-y-2 scroll-mt-20">
            {/* Clickable Accordion / Dropdown Header Glass Bar */}
            <button
              onClick={() => onToggleCategory(category.id)}
              className="w-full glass-panel p-3.5 rounded-2xl border border-white/20 flex items-center justify-between text-right hover:border-[#FFBA08]/50 transition-all duration-300 group focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl glass-card border border-white/20 transition-transform duration-300 ${isOpen ? 'bg-[#E85D04]/20 border-[#E85D04]/40' : ''}`}>
                  {getCategoryIcon(category.iconName)}
                </div>
                <div>
                  <h3 className="text-base font-black text-white group-hover:text-[#FFBA08] transition-colors flex items-center gap-2">
                    <span>{category.titleAr}</span>
                  </h3>
                  <p className="text-[10px] text-white/60 font-medium">
                    {category.descriptionAr}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="glass-pill px-2.5 py-1 rounded-full text-[10px] font-bold text-[#FFBA08] border border-white/20">
                  {items.length} أصناف
                </span>
                <div className={`p-1.5 rounded-full glass-card border border-white/20 text-white/80 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#FFBA08]' : ''}`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </button>

            {/* Collapsible Content: Slide down/up when section is clicked (isOpen) */}
            <div className={`accordion-collapse ${isOpen ? 'open' : ''}`}>
              <div className="accordion-collapse-inner space-y-3 pt-1">
                {items.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2.5">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="glass-card rounded-[18px] overflow-hidden border border-white/20 relative group flex flex-col"
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
                          <h4 className="text-[13px] font-extrabold text-white group-hover:text-[#FFBA08] transition-colors leading-snug">
                            {item.nameAr}
                          </h4>
                          <span className="text-[13px] font-black text-transparent bg-clip-text bg-gradient-to-l from-[#FFBA08] to-[#E85D04]">
                            {item.price}
                          </span>
                          {item.descriptionAr && (
                            <p className="text-[10px] text-white/70 line-clamp-1 leading-relaxed font-medium">
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
                  /* Beautiful Empty Glass Card Placeholder */
                  <div className="glass-panel rounded-[22px] p-6 text-center border-2 border-dashed border-white/20 space-y-3">
                    <div className="w-10 h-10 mx-auto rounded-xl glass-card flex items-center justify-center text-[#FFBA08] border border-white/20">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">
                        {category.titleAr}
                      </h4>
                      <p className="text-xs text-[#FFBA08] font-bold">
                        سيتم إضافة الأصناف قريبًا
                      </p>
                      <p className="text-[10px] text-white/50 font-medium">
                        لا توجد أصناف حالياً في هذا القسم. الهيكل البرمجي جاهز تماماً للتلقي المباشر.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
};
