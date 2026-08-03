import React, { memo, useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HeroSlide } from '../types';
import { useLanguage } from '../i18n';
import { ResponsiveImage } from './ResponsiveImage';
import { assetUrl } from '../lib/assetUrl';

interface HeroCarouselProps {
  slides: HeroSlide[];
  onSelectCategory: (categoryId: string) => void;
}

const HERO_SIZES = '(max-width: 448px) 416px, 1000px';

export const HeroCarousel: React.FC<HeroCarouselProps> = memo(({ slides, onSelectCategory }) => {
  const { lang, isRtl, t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Auto-play every 2 seconds
  useEffect(() => {
    if (isPaused || slides.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  // Warm the non-active slides so advancing never flashes. They are small,
  // local WebP files, so this costs almost nothing.
  useEffect(() => {
    for (const slide of slides) {
      const url = assetUrl(slide.image);
      if (url) {
        const img = new Image();
        img.src = url;
      }
    }
  }, [slides]);

  const currentSlide = slides[currentIndex];

  const goTo = useCallback(
    (index: number) => {
      if (slides.length === 0) return;
      setCurrentIndex((index % slides.length + slides.length) % slides.length);
    },
    [slides.length]
  );

  const handleSlideClick = useCallback(() => {
    if (!currentSlide) return;
    onSelectCategory(currentSlide.targetCategoryId);
    const menuEl = document.getElementById('menu-category-section');
    if (menuEl) {
      menuEl.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentSlide, onSelectCategory]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.targetTouches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsPaused(false);
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 40) goTo(currentIndex + 1);
    else if (distance < -40) goTo(currentIndex - 1);
    touchStartX.current = 0;
    touchEndX.current = 0;
  }, [currentIndex, goTo]);

  if (!currentSlide) return null;

  const srcSet = (slide: HeroSlide) => {
    if (!slide.image || slide.image.startsWith('data:') || slide.image.startsWith('http')) return undefined;
    const base = slide.image.replace(/\.webp$/, '');
    return `${base}@640.webp 640w, ${slide.image} 1000w`;
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 pt-3 pb-2">
      <div
        className="relative w-full h-[180px] sm:h-[200px] rounded-[24px] overflow-hidden shadow-[0_6px_24px_rgba(0,0,0,0.06)] border border-[#ECECEC] bg-white cursor-pointer group select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleSlideClick}
      >
        {/* Animated Slide Content */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRtl ? 20 : -20 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute inset-0 w-full h-full will-change-transform"
          >
            {/* Edge to Edge Image */}
            <ResponsiveImage
              src={currentSlide.image}
              srcSet={srcSet(currentSlide)}
              sizes={HERO_SIZES}
              alt={currentSlide.title[lang]}
              priority={currentIndex === 0}
              width={1000}
              height={417}
              className="w-full h-full object-cover rounded-[24px]"
            />

            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent rounded-[24px]" />

            {/* Slide Text Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col justify-end text-white">
              {currentSlide.tag && (
                <span className="self-start text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#4CAF50] text-white mb-1.5 shadow-xs">
                  {currentSlide.tag[lang]}
                </span>
              )}
              <h2 className="text-lg font-bold leading-tight drop-shadow-xs font-sans">
                {currentSlide.title[lang]}
              </h2>
              <p className="text-xs text-white/85 font-normal mt-0.5 line-clamp-1">
                {currentSlide.subtitle[lang]}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Pagination Dots */}
        <div className="absolute bottom-2.5 left-4 z-10 flex items-center gap-1.5 bg-black/30 backdrop-blur-[6px] px-2 py-1 rounded-full border border-white/20">
          {slides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={(e) => {
                e.stopPropagation();
                goTo(idx);
              }}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                idx === currentIndex
                  ? 'w-5 h-1.5 bg-[#4CAF50]'
                  : 'w-1.5 h-1.5 bg-white/60 hover:bg-white'
              }`}
              aria-label={t('slideAria', { n: idx + 1 })}
            />
          ))}
        </div>
      </div>
    </div>
  );
});
