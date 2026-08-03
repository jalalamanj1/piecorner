import React from 'react';
import { BadgePercent, CheckCircle2, ChevronDown } from 'lucide-react';
import { offers } from '../config';
import { SmartImage } from './SmartImage';

interface OffersProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Offers: React.FC<OffersProps> = ({ isOpen, onToggle }) => {
  return (
    <section id="offers" className="px-3 py-2 w-full max-w-lg mx-auto space-y-2">
      {/* Clickable Section Header Dropdown Bar */}
      <button
        onClick={onToggle}
        className="w-full glass-panel p-3.5 rounded-2xl border border-white/20 flex items-center justify-between text-right hover:border-[#FFBA08]/50 transition-all duration-300 group focus:outline-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#E85D04]/20 border border-[#E85D04]/40 text-[#FFBA08]">
            <BadgePercent className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-white group-hover:text-[#FFBA08] transition-colors">
              العروض 🎉
            </h2>
          </div>
        </div>

        <div className={`p-1.5 rounded-full glass-card border border-white/20 text-white/80 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#FFBA08]' : ''}`}>
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>

      {/* Collapsible Content */}
      <div className={`accordion-collapse ${isOpen ? 'open' : ''}`}>
        <div className="accordion-collapse-inner pt-1 space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="glass-card rounded-[18px] overflow-hidden border border-white/20 relative group flex flex-col"
              >
                {/* Offer Image (square) */}
                <div className={`relative h-24 w-full overflow-hidden bg-gradient-to-br ${offer.accent} bg-opacity-20 border-b border-white/10 flex items-center justify-center`}>
                  <SmartImage
                    src={offer.image}
                    alt={offer.titleAr}
                    emoji={offer.icon}
                    wrapperClassName="w-full h-full"
                    imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    emojiClassName="text-4xl drop-shadow-lg"
                  />
                </div>

                <div className="p-3 flex flex-col gap-2 flex-1">
                  <h3 className="text-[13px] font-extrabold text-[#FFBA08] leading-snug">
                    {offer.titleAr}
                  </h3>

                  <div className="space-y-1.5">
                    {offer.rows.map((row) => (
                      <div
                        key={row.label}
                        className="flex flex-col items-start gap-1 bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5"
                      >
                        <span className="text-[10px] font-bold text-white flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{row.label}</span>
                        </span>
                        <span className="text-[12px] font-black text-transparent bg-clip-text bg-gradient-to-l from-[#FFBA08] to-[#E85D04]">
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
      </div>
    </section>
  );
};
