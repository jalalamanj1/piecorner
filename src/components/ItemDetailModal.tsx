import React, { memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Flame, Sparkles, ChefHat, Info } from 'lucide-react';
import { MenuItem } from '../types';
import { DIETARY_TAG_LABELS } from '../data/restaurantData';
import { useLanguage } from '../i18n';
import { ResponsiveImage } from './ResponsiveImage';

interface ItemDetailModalProps {
  item: MenuItem | null;
  currencySymbol: string;
  onClose: () => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = memo(({
  item,
  currencySymbol,
  onClose,
}) => {
  const { lang, t } = useLanguage();

  if (!item) return null;

  const hasDiscount = item.originalPrice && item.originalPrice > item.price;

  return (
    <AnimatePresence>
      {item && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs">          {/* Backdrop Click */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] overflow-hidden border border-[#ECECEC] shadow-2xl z-10 max-h-[90vh] flex flex-col"
          >
            {/* Close Button Floating */}
            <button
              onClick={onClose}
              className="absolute top-4 left-4 z-20 w-9 h-9 rounded-full bg-white/80 backdrop-blur-[6px] border border-[#ECECEC] flex items-center justify-center text-[#222222] shadow-sm hover:bg-white cursor-pointer active:scale-95 transition-all"
              aria-label={t('close')}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Top Large Hero Image */}
            <div className="relative w-full h-60 sm:h-64 bg-[#FAFAF8] shrink-0">
              {item.image ? (
                <ResponsiveImage
                  src={item.image}
                  alt={item.name[lang]}
                  priority
                  width={640}
                  height={256}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl bg-gradient-to-br from-[#4CAF50]/20 via-[#FAFAF8] to-[#FF8A30]/20">
                  🍽️
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              {/* Offer or Dietary Badge Overlay */}
              <div className="absolute bottom-4 right-4 flex flex-wrap gap-2">
                {item.offerBadge && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FF8A30] text-white shadow-xs">
                    {item.offerBadge[lang]}
                  </span>
                )}
                {item.dietaryTags?.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-semibold px-3 py-1 rounded-full bg-white/90 backdrop-blur-[6px] text-[#222222] shadow-xs"
                  >
                    {DIETARY_TAG_LABELS[tag][lang]}
                  </span>
                ))}
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
              {/* Title & Price Header */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl font-bold text-[#222222] leading-snug font-sans">
                    {item.name[lang]}
                  </h3>
                  <div className="text-left shrink-0">
                    <span className="text-xl font-extrabold text-[#4CAF50]">
                      {item.price.toLocaleString('en-US')} {currencySymbol}
                    </span>
                    {hasDiscount && (
                      <p className="text-xs text-[#777777] line-through">
                        {item.originalPrice?.toLocaleString('en-US')} {currencySymbol}
                      </p>
                    )}
                  </div>
                </div>

                {/* Calories or Prep info */}
                {item.calories && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-[#777777]">
                    <Flame className="w-4 h-4 text-[#FF8A30]" />
                    <span>{t('calories', { n: item.calories })}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {item.description && item.description[lang].trim() !== '' && (
                <div className="bg-[#FAFAF8] p-3.5 rounded-2xl border border-[#ECECEC]">
                  <p className="text-xs sm:text-sm text-[#444444] leading-relaxed">
                    {item.description[lang]}
                  </p>
                </div>
              )}

              {/* Chef's Note if available */}
              {item.chefNote && (
                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#E8F5E9]/60 border border-[#4CAF50]/20">
                  <ChefHat className="w-5 h-5 text-[#4CAF50] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#2E7D32]">
                      {t('chefNoteTitle')}
                    </h4>
                    <p className="text-xs text-[#222222] mt-0.5 leading-relaxed">
                      {item.chefNote[lang]}
                    </p>
                  </div>
                </div>
              )}

              {/* Key Ingredients List */}
              {item.ingredients && item.ingredients.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-[#222222] mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#4CAF50]" />
                    <span>{t('ingredientsTitle')}</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {item.ingredients.map((ing, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-[#F2F2EE] text-[#444444] px-2.5 py-1 rounded-xl border border-[#ECECEC]"
                      >
                        {ing[lang]}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notice that this is purely digital menu view */}
              <div className="pt-2 text-center border-t border-[#ECECEC]">
                <p className="text-[11px] text-[#777777] flex items-center justify-center gap-1">
                  <Info className="w-3.5 h-3.5 text-[#777777]" />
                  <span>{t('menuNotice')}</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});
