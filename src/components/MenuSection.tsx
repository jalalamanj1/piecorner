import React, { memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Category, MenuItem } from '../types';
import { DIETARY_TAG_LABELS } from '../data/restaurantData';
import { useLanguage } from '../i18n';
import { ResponsiveImage } from './ResponsiveImage';
import { useInView } from '../lib/useInView';

interface MenuSectionProps {
  activeCategory: Category;
  items: MenuItem[];
  currencySymbol: string;
  onSelectItem: (item: MenuItem) => void;
}

interface MenuItemCardProps {
  item: MenuItem;
  categoryIcon: string;
  currencySymbol: string;
  onSelectItem: (item: MenuItem) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = memo(({ item, categoryIcon, currencySymbol, onSelectItem }) => {
  const { lang } = useLanguage();
  const hasDiscount = item.originalPrice && item.originalPrice > item.price;

  const handleClick = useCallback(() => onSelectItem(item), [item, onSelectItem]);

  return (
    <motion.article
      key={item.id}
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -2 }}
      onClick={handleClick}
      className="group relative bg-white rounded-[24px] p-3 border border-[#ECECEC] shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200 cursor-pointer flex items-center gap-3.5 select-none"
    >
      {/* Food Image */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-[20px] overflow-hidden bg-[#FAFAF8] shrink-0 border border-[#ECECEC]">
        {item.image ? (
          <ResponsiveImage
            src={item.image}
            alt={item.name[lang]}
            width={160}
            height={160}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-[#F5F5F2] to-[#EBEBE5]">
            {categoryIcon}
          </div>
        )}

        {/* Offer Badge Overlay if Special Offer */}
        {item.offerBadge && (
          <span className="absolute top-1.5 right-1.5 text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#FF8A30] text-white shadow-xs">
            {item.offerBadge[lang]}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 pr-1 flex flex-col justify-between py-0.5 h-24 sm:h-28">
        <div>
          {/* Name */}
          <h3 className="text-sm sm:text-base font-bold text-[#222222] leading-snug truncate group-hover:text-[#4CAF50] transition-colors">
            {item.name[lang]}
          </h3>

          {/* Description / Ingredients */}
          {item.description && item.description[lang].trim() !== '' && (
            <p className="text-xs text-[#777777] leading-relaxed mt-1 line-clamp-2">
              {item.description[lang]}
            </p>
          )}
        </div>

        {/* Price Block */}
        <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#F5F5F3]">
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-extrabold text-[#222222]">
              {item.price.toLocaleString('en-US')} {currencySymbol}
            </span>
            {hasDiscount && (
              <span className="text-xs text-[#777777] line-through font-medium">
                {item.originalPrice?.toLocaleString('en-US')} {currencySymbol}
              </span>
            )}
          </div>

          {/* Dietary tags mini pills if any */}
          {item.dietaryTags && item.dietaryTags.length > 0 && (
            <span className="text-[10px] font-semibold text-[#4CAF50] bg-[#E8F5E9] px-2 py-0.5 rounded-full truncate max-w-[100px]">
              {DIETARY_TAG_LABELS[item.dietaryTags[0]][lang]}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
});

export const MenuSection: React.FC<MenuSectionProps> = memo(({
  activeCategory,
  items,
  currencySymbol,
  onSelectItem,
}) => {
  const { lang, t } = useLanguage();
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section ref={ref} id="menu-category-section" className="w-full max-w-md mx-auto px-4 py-3 min-h-[360px]">
      {/* Category Title & Badge Header */}
      <div className="flex items-center justify-between mb-3.5 px-0.5">
        <div className="flex items-center gap-2">
          <span className="text-xl">{activeCategory.icon}</span>
          <h2 className="text-lg font-bold text-[#222222] font-sans">
            {activeCategory.name[lang]}
          </h2>
        </div>
        <span className="text-xs font-medium text-[#777777] bg-white px-2.5 py-1 rounded-full border border-[#ECECEC]">
          {items.length} {items.length === 1 ? t('item') : t('items')}
        </span>
      </div>

      {/* Menu Cards with AnimatePresence for smooth Category Transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="space-y-3.5"
        >
          {items.length === 0 ? (
            <div className="text-center py-12 px-4 bg-white rounded-[24px] border border-[#ECECEC]">
              <p className="text-sm font-medium text-[#777777]">
                {t('noItems')}
              </p>
            </div>
          ) : !inView ? (
            // Defer rendering the item cards until the section is near the
            // viewport. Keeps the initial render light on low-end phones.
            <div className="py-12 text-center text-xs text-[#C5C5C0]" aria-hidden="true">
              ⋯
            </div>
          ) : (
            items.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                categoryIcon={activeCategory.icon}
                currencySymbol={currencySymbol}
                onSelectItem={onSelectItem}
              />
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
});
