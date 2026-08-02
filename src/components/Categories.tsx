import React from 'react';
import { categories } from '../config';
import { createRipple } from '../utils/ripple';

interface CategoriesProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const Categories: React.FC<CategoriesProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  const getCategoryEmoji = (id: string) => {
    switch (id) {
      case 'pizza':
        return '🍕';
      case 'pie':
        return '🥟';
      case 'sides':
        return '🍟';
      case 'drinks':
        return '🥤';
      case 'desserts':
        return '🍰';
      default:
        return '🍕';
    }
  };

  const handleCategoryClick = (e: React.MouseEvent<HTMLElement>, categoryId: string) => {
    createRipple(e);
    onSelectCategory(categoryId);
    const element = document.getElementById(`section-${categoryId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="px-3 py-2 w-full max-w-lg mx-auto space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-black text-white/90">الأقسام</h2>
        <span className="text-[10px] text-[#FFE8CC]/70 font-medium">اختر للفيض المباشر</span>
      </div>

      {/* Horizontal Scrolling Chips */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none py-1.5 px-0.5 -mx-0.5 snap-x">
        <button
          onClick={(e) => {
            createRipple(e);
            onSelectCategory('all');
          }}
          className={`ripple-button snap-start shrink-0 min-h-[48px] px-4 rounded-2xl text-xs font-bold transition-all border flex items-center gap-2 ${
            selectedCategory === 'all'
              ? 'glass-button-primary text-white border-white/40 shadow-lg'
              : 'glass-button-secondary text-white/80 border-white/15'
          }`}
        >
          <span>✨</span>
          <span>الكل</span>
        </button>

        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={(e) => handleCategoryClick(e, cat.id)}
              className={`ripple-button snap-start shrink-0 min-h-[48px] px-4 rounded-2xl text-xs font-bold transition-all border flex items-center gap-2 ${
                isActive
                  ? 'glass-button-primary text-white border-white/40 shadow-lg'
                  : 'glass-button-secondary text-white/80 border-white/15'
              }`}
            >
              <span className="text-base">{getCategoryEmoji(cat.id)}</span>
              <span>{cat.titleAr}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
