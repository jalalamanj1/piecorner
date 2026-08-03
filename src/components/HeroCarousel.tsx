import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HeroSlide } from '../types';
import { useLanguage } from '../i18n';

interface HeroCarouselProps {
  slides: HeroSlide[];
  onSelectCategory: (categoryId: string) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ slides, onSelectCategory }) => {
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

  const currentSlide = slides[currentIndex];

  const handleSlideClick = (slide: HeroSlide) => {
    onSelectCategory(slide.targetCategoryId);
    // Smooth scroll to menu section
    const menuEl = document.getElementById('menu-category-section');
    if (menuEl) {
      menuEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 40;
    const isRightSwipe = distance < -40;

    if (isLeftSwipe) {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    } else if (isRightSwipe) {
      setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  if (!currentSlide) return null;

  return (
    <div className="w-full max-w-md mx-auto px-4 pt-3 pb-2">
      <div 
        className="relative w-full h-[180px] sm:h-[200px] rounded-[24px] overflow-hidden shadow-[0_6px_24px_rgba(0,0,0,0.06)] border border-[#ECECEC] bg-white cursor-pointer group select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => handleSlideClick(currentSlide)}
      >
        {/* Animated Slide Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRtl ? 20 : -20 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Edge to Edge Image */}
            <img
              src={currentSlide.image}
              alt={currentSlide.title[lang]}
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
        <div className="absolute bottom-2.5 left-4 z-10 flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-2 py-1 rounded-full border border-white/20">
          {slides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
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
};
