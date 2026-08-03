import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Lang, LANGS } from './types';

export const langNames: Record<Lang, string> = { ar: 'العربية', ckb: 'کوردی', tr: 'Türkçe' };
export const langCodes: Record<Lang, string> = { ar: 'ع', ckb: 'ک', tr: 'TR' };

const ui = {
  ar: {
    switchTo: 'التبديل إلى',
    location: 'الموقع وساعات العمل',
    call: 'اتصال بالمطعم',
    callTitle: 'اتصل بنا',
    item: 'طبق',
    items: 'أطباق',
    noItems: 'لا توجد أطباق متاحة حالياً في هذه الفئة.',
    calories: 'حوالي {n} سعرة حرارية',
    chefNoteTitle: 'ملاحظة الشيف المميز',
    ingredientsTitle: 'المكونات والعناصر الطازجة',
    menuNotice: 'عرض رقمي للقائمة • تحدث مع النادل لطلب أطباقك',
    close: 'إغلاق',
    addressLabel: 'العنوان',
    hoursLabel: 'ساعات العمل',
    openMaps: 'افتح في خرائط جوجل',
    callIntro: 'للحجز أو الاستفسار:',
    callNow: 'اتصل',
    slideAria: 'الانتقال إلى الشريحة {n}',
  },
  ckb: {
    switchTo: 'گۆڕین بۆ',
    location: 'شوێن و کاتژمێرەکانی کار',
    call: 'پەیوەندی بە چێشتخانەوە',
    callTitle: 'پەیوەندیمان پێوە بکە',
    item: 'قاپ',
    items: 'قاپەکان',
    noItems: 'ئێستا هیچ قاپێک لەم بەشەدا نییە.',
    calories: 'نزیکەی {n} کالۆری',
    chefNoteTitle: 'تێبینی تایبەتی شێف',
    ingredientsTitle: 'پێکهاتە و توخمە تازەکان',
    menuNotice: 'پێشکەشکردنی مێنیۆی دیجیتاڵ • لەگەڵ خزمەتگوزارەکە قسە بکە بۆ داواکردن',
    close: 'داخستن',
    addressLabel: 'ناونیشان',
    hoursLabel: 'کاتژمێرەکانی کار',
    openMaps: 'کردنەوە لە گووگڵ مەپس',
    callIntro: 'ڕاستەوخۆ لەگەڵ فڕۆنتەکە قسە بکە بۆ یەدەگ گرتن یان پرسیارکردن:',
    callNow: 'پەیوەندی بکە بە {n}',
    slideAria: 'ڕۆیشتن بۆ سلاید {n}',
  },
  tr: {
    switchTo: 'Şuna geç',
    location: 'Konum ve Çalışma Saatleri',
    call: 'Restoranı Ara',
    callTitle: 'Bizi Arayın',
    item: 'yemek',
    items: 'yemekler',
    noItems: 'Bu kategoride şu anda mevcut yemek yok.',
    calories: 'Yaklaşık {n} kcal',
    chefNoteTitle: "Şefin Özel Notu",
    ingredientsTitle: 'Malzemeler ve Taze Bileşenler',
    menuNotice: 'Dijital Menü Sunumu • Sipariş için garsonla konuşun',
    close: 'Kapat',
    addressLabel: 'Adres',
    hoursLabel: 'Çalışma Saatleri',
    openMaps: "Google Haritalar'da aç",
    callIntro: 'Rezervasyon veya bilgi için doğrudan resepsiyonla konuşun:',
    callNow: 'Ara: {n}',
    slideAria: 'Slayt {n} öğesine git',
  },
} as const;

export type UiKey = keyof typeof ui.ar;

type Params = Record<string, string | number>;

interface LanguageContextValue {
  lang: Lang;
  isRtl: boolean;
  next: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: UiKey, params?: Params) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang] = useState<Lang>('ar');

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = 'rtl';
  }, [lang]);

  const setLang = useCallback((_l: Lang) => {}, []);
  const toggle = useCallback(() => {}, []);
  const t = useCallback(
    (key: UiKey, params?: Params) => {
      let s: string = ui[lang][key];
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          s = s.replaceAll(`{${k}}`, String(v));
        }
      }
      return s;
    },
    [lang]
  );

  const value = useMemo(
    () => ({
      lang,
      isRtl: lang !== 'tr',
      next: LANGS[(LANGS.indexOf(lang) + 1) % LANGS.length],
      setLang,
      toggle,
      t,
    }),
    [lang, setLang, toggle, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
