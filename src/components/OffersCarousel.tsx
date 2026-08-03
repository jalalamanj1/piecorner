import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Sparkles } from 'lucide-react';
import { offers } from '../config';
import { SmartImage } from './SmartImage';

const AUTOPLAY_MS = 4500;

// First section: full-width slideshow of the restaurant offers.
// Auto-advances, supports swipe, arrow controls and dots.
export const OffersCarousel: React.FC = () => {
  const [index, setIndex] = useState(0);
  const total = offers.length;
  const isRtl = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [total, next]);

  // Touch swipe (drag left = next, drag right = previous)
  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      if (delta < 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  if (total === 0) return null;

  return (
    <section id="offers" className="px-3 pt-1 scroll-mt-[124px]">
      <div className="relative overflow-hidden rounded-3xl" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(${-index * 100}%)` }}
        >
          {offers.map((offer) => (
            <div key={offer.id} className="w-full shrink-0">
              <div className={`relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br ${offer.accent} p-5 min-h-[230px] flex flex-col justify-between`}>
                <div className="flex items-start gap-4">
                  <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-black/30 border border-white/25 shrink-0 shadow-lg">
                    <SmartImage
                      src={offer.image}
                      alt={offer.titleAr}
                      emoji={offer.icon}
                      wrapperClassName="w-full h-full"
                      imgClassName="w-full h-full object-cover"
                      emojiClassName="text-5xl drop-shadow-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <span className="inline-flex items-center gap-1 bg-black/30 border border-[#FFBA08]/40 text-[#FFBA08] text-[10px] font-black px-2.5 py-1 rounded-full">
                      <Sparkles className="w-3 h-3" /> عرض خاص
                    </span>
                    <h3 className="text-xl font-black text-white mt-2 leading-tight">
                      {offer.titleAr}
                    </h3>
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  {offer.rows.map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between gap-2 bg-black/30 backdrop-blur-sm border border-white/15 rounded-2xl px-3.5 py-2"
                    >
                      <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{row.label}</span>
                      </span>
                      <span className="text-[13px] font-black text-[#FFBA08] whitespace-nowrap">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls: RTL-aware (forward = left in RTL, right in LTR) */}
      <div className="flex items-center justify-center gap-4 mt-3">
        <button
          onClick={isRtl ? next : prev}
          className="w-8 h-8 rounded-full glass-card border border-white/20 flex items-center justify-center text-white active:scale-95 transition-all"
          aria-label={isRtl ? 'العرض التالي' : 'العرض السابق'}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5">
          {offers.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`الانتقال إلى العرض ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-6 bg-[#FFBA08]' : 'w-1.5 bg-white/40'}`}
            />
          ))}
        </div>

        <button
          onClick={isRtl ? prev : next}
          className="w-8 h-8 rounded-full glass-card border border-white/20 flex items-center justify-center text-white active:scale-95 transition-all"
          aria-label={isRtl ? 'العرض السابق' : 'العرض التالي'}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
