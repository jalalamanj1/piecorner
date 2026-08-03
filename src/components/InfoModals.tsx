import React, { memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Clock, Phone, X, Navigation, ExternalLink } from 'lucide-react';
import { RestaurantConfig } from '../types';
import { useLanguage } from '../i18n';

interface LocationModalProps {
  isOpen: boolean;
  config: RestaurantConfig;
  onClose: () => void;
}

export const LocationModal: React.FC<LocationModalProps> = memo(({ isOpen, config, onClose }) => {
  const { lang, t } = useLanguage();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[4px]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          onClick={onClose}
        />

        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 10 }}
          className="relative w-full max-w-sm bg-white rounded-[28px] p-5 border border-[#ECECEC] shadow-2xl z-10 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#E8F5E9] flex items-center justify-center text-[#4CAF50]">
                <MapPin className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-[#222222]">{t('location')}</h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#FAFAF8] border border-[#ECECEC] flex items-center justify-center text-[#777777] hover:text-[#222222] cursor-pointer"
              aria-label={t('close')}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Map Styled Placeholder Graphic */}
          <div className="w-full h-32 rounded-2xl bg-[#F0F2EE] border border-[#ECECEC] overflow-hidden relative flex flex-col items-center justify-center p-3 text-center">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#4CAF50_1px,transparent_1px)] [background-size:12px_12px]" />
            <div className="w-10 h-10 rounded-full bg-[#4CAF50] text-white flex items-center justify-center shadow-lg animate-bounce z-10">
              <MapPin className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#222222] z-10 mt-2 bg-white/90 backdrop-blur-[4px] px-2.5 py-0.5 rounded-full border border-[#ECECEC]">
              {config.name[lang]}
            </span>
          </div>

          {/* Address */}
          <div className="space-y-3 text-xs text-[#444444]">
            <div className="flex items-start gap-2.5 bg-[#FAFAF8] p-3 rounded-2xl border border-[#ECECEC]">
              <MapPin className="w-4 h-4 text-[#4CAF50] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#222222]">{t('addressLabel')}</p>
                <p className="text-[#777777] mt-0.5">{config.address}</p>
              </div>
            </div>

            {/* Opening Hours */}
            <div className="flex items-start gap-2.5 bg-[#FAFAF8] p-3 rounded-2xl border border-[#ECECEC]">
              <Clock className="w-4 h-4 text-[#FF8A30] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#222222]">{t('hoursLabel')}</p>
                <p className="text-[#777777] mt-0.5">{config.openingHours[lang]}</p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(config.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-2xl bg-[#4CAF50] hover:bg-[#43A047] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98"
          >
            <Navigation className="w-4 h-4" />
            <span>{t('openMaps')}</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
        </motion.div>
      </div>
    </AnimatePresence>
  );
});

interface CallModalProps {
  isOpen: boolean;
  config: RestaurantConfig;
  onClose: () => void;
}

export const CallModal: React.FC<CallModalProps> = memo(({ isOpen, config, onClose }) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[4px]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          onClick={onClose}
        />

        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 10 }}
          className="relative w-full max-w-sm bg-white rounded-[28px] p-5 border border-[#ECECEC] shadow-2xl z-10 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#FFF3E0] flex items-center justify-center text-[#FF8A30]">
                <Phone className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-[#222222]">{t('call')}</h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#FAFAF8] border border-[#ECECEC] flex items-center justify-center text-[#777777] hover:text-[#222222] cursor-pointer"
              aria-label={t('close')}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center py-2 space-y-1">
            <p className="text-xs text-[#777777]">
              {t('callIntro')}
            </p>
            <p className="text-lg font-extrabold text-[#222222]" dir="ltr">
              {config.formattedPhone}
            </p>
          </div>

          <a
            href={`tel:${config.phone}`}
            className="w-full py-3 rounded-2xl bg-[#FF8A30] hover:bg-[#F57C00] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98"
          >
            <Phone className="w-4 h-4" />
            <span>{t('callNow')}</span>
          </a>
        </motion.div>
      </div>
    </AnimatePresence>
  );
});
