import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Category } from '../types';
import { useLanguage } from '../i18n';

interface CategoryTabsProps {
  categories: Category[];
  activeCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeCategoryId,
  onSelectCategory,
}) => {
  const { lang } = useLanguage();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll selected tab into view smoothly
  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const activeTabEl = scrollContainerRef.current.querySelector(
      `[data-category-id="${activeCategoryId}"]`
    );
    if (activeTabEl) {
      activeTabEl.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeCategoryId]);

  return (
    <div className="w-full max-w-md mx-auto px-4 py-2 sticky top-[57px] z-20 bg-[#FAFAF8]/95 backdrop-blur-md">
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1 -mx-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((cat) => {
          const isSelected = cat.id === activeCategoryId;

          return (
            <button
              key={cat.id}
              data-category-id={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`relative flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 select-none ${
                isSelected
                  ? 'text-[#222222] bg-white shadow-xs border border-[#ECECEC]'
                  : 'text-[#777777] bg-[#F2F2EE]/80 hover:bg-[#EBEBE5] border border-transparent'
              }`}
            >
              {/* Category Icon */}
              <span
                className={`text-sm transition-transform duration-200 ${
                  isSelected ? 'scale-110' : 'opacity-80'
                }`}
              >
                {cat.icon}
              </span>

              {/* Category Name */}
              <span
                className={`${
                  isSelected ? 'font-bold text-[#222222]' : 'font-medium'
                }`}
              >
                {cat.name[lang]}
              </span>

              {/* Optional badge count or deal pill */}
              {cat.badge && (
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? 'bg-[#4CAF50] text-white'
                      : 'bg-black/10 text-[#777777]'
                  }`}
                >
                  {cat.badge[lang]}
                </span>
              )}

              {/* Animated Soft Green Underline Indicator */}
              {isSelected && (
                <motion.div
                  layoutId="softGreenTabIndicator"
                  className="absolute bottom-0 left-3 right-3 h-[3px] bg-[#4CAF50] rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
