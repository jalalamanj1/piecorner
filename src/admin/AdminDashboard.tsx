import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Pencil,
  X,
  ArrowRight,
  Store,
  Utensils,
  LayoutGrid,
  Images,
  Check,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { defaultMenuData, MenuData, useMenuData, notifyMenuDataChanged } from '../data/menuStore';
import { saveMenuDataToFiles } from '../data/fileStore';
import { DIETARY_TAG_LABELS } from '../data/restaurantData';
import { Category, DietaryTag, HeroSlide, LocalizedText, MenuItem, RestaurantConfig } from '../types';
import { ADMIN_ROUTE } from '../useIsAdminRoute';
import { ImageInput } from './ImageInput';

type Tab = 'general' | 'items' | 'categories' | 'slides';

const DIETARY_KEYS = Object.keys(DIETARY_TAG_LABELS) as DietaryTag[];

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

const inputClass =
  'w-full text-xs px-3 py-2 rounded-xl border border-[#ECECEC] bg-white focus:outline-none focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20 transition-all';
const labelClass = 'text-[11px] font-bold text-[#222222] block mb-1';

const syncText = (v: string): LocalizedText => ({ ar: v, ckb: v, tr: v });

interface ArabicInputProps {
  label: string;
  value: LocalizedText;
  onChange: (v: LocalizedText) => void;
  placeholder?: string;
}

const ArabicInput: React.FC<ArabicInputProps> = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className={labelClass}>{label}</label>
    <input
      value={value.ar}
      onChange={(e) => onChange(syncText(e.target.value))}
      placeholder={placeholder}
      className={inputClass}
    />
  </div>
);

interface ArabicTextareaProps {
  label: string;
  value: LocalizedText;
  onChange: (v: LocalizedText) => void;
  rows?: number;
  placeholder?: string;
}

const ArabicTextarea: React.FC<ArabicTextareaProps> = ({ label, value, onChange, rows = 2, placeholder }) => (
  <div>
    <label className={labelClass}>{label}</label>
    <textarea
      value={value.ar}
      onChange={(e) => onChange(syncText(e.target.value))}
      rows={rows}
      placeholder={placeholder}
      className={`${inputClass} resize-none`}
    />
  </div>
);

interface ItemFormState {
  name: LocalizedText;
  description: LocalizedText;
  price: string;
  originalPrice: string;
  image: string;
  categoryId: string;
  isSpecialOffer: boolean;
  offerBadge: LocalizedText;
  calories: string;
  chefNote: LocalizedText;
  ingredients: string;
  dietaryTags: DietaryTag[];
}

function emptyItemForm(categoryId: string): ItemFormState {
  return {
    name: { ar: '', ckb: '', tr: '' },
    description: { ar: '', ckb: '', tr: '' },
    price: '',
    originalPrice: '',
    image: '',
    categoryId,
    isSpecialOffer: false,
    offerBadge: { ar: '', ckb: '', tr: '' },
    calories: '',
    chefNote: { ar: '', ckb: '', tr: '' },
    ingredients: '',
    dietaryTags: [],
  };
}

function itemToForm(item: MenuItem): ItemFormState {
  return {
    name: item.name,
    description: item.description ?? { ar: '', ckb: '', tr: '' },
    price: String(item.price),
    originalPrice: item.originalPrice !== undefined ? String(item.originalPrice) : '',
    image: item.image ?? '',
    categoryId: item.categoryId,
    isSpecialOffer: item.isSpecialOffer ?? false,
    offerBadge: item.offerBadge ?? { ar: '', ckb: '', tr: '' },
    calories: item.calories !== undefined ? String(item.calories) : '',
    chefNote: item.chefNote ?? { ar: '', ckb: '', tr: '' },
    ingredients: (item.ingredients ?? []).map((i) => i.ar).join('\n'),
    dietaryTags: item.dietaryTags ?? [],
  };
}

interface ItemEditorModalProps {
  initial: ItemFormState | null;
  categories: Category[];
  onSave: (item: MenuItem) => void;
  onClose: () => void;
}

const ItemEditorModal: React.FC<ItemEditorModalProps> = ({ initial, categories, onSave, onClose }) => {
  const [form, setForm] = useState<ItemFormState>(() => initial ?? emptyItemForm(categories[0]?.id ?? ''));
  const [showDetails, setShowDetails] = useState(false);
  const isEditing = initial !== null;

  const set = (patch: Partial<ItemFormState>) => setForm((prev) => ({ ...prev, ...patch }));

  const toggleDietary = (tag: DietaryTag) =>
    setForm((prev) => ({
      ...prev,
      dietaryTags: prev.dietaryTags.includes(tag)
        ? prev.dietaryTags.filter((t) => t !== tag)
        : [...prev.dietaryTags, tag],
    }));

  const handleSubmit = () => {
    const ar = (s: string): string => s.trim();
    const ingredients: LocalizedText[] = form.ingredients
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((line) => ({ ar: line, ckb: line, tr: line }));

    const item: MenuItem = {
      id: initial?.id ?? `item-${Date.now()}`,
      name: syncText(ar(form.name.ar) || 'طبق جديد'),
      ...(ar(form.description.ar) !== '' ? { description: syncText(form.description.ar) } : {}),
      price: parseFloat(form.price) || 0,
      ...(form.image.trim() !== '' ? { image: form.image.trim() } : {}),
      categoryId: form.categoryId || categories[0]?.id || '',
      ...(form.originalPrice.trim() !== '' ? { originalPrice: parseFloat(form.originalPrice) || 0 } : {}),
      ...(form.isSpecialOffer ? { isSpecialOffer: true } : {}),
      ...(ar(form.offerBadge.ar) !== '' ? { offerBadge: syncText(form.offerBadge.ar) } : {}),
      ...(form.calories.trim() !== '' ? { calories: parseInt(form.calories, 10) || 0 } : {}),
      ...(ar(form.chefNote.ar) !== '' ? { chefNote: syncText(form.chefNote.ar) } : {}),
      ...(ingredients.length > 0 ? { ingredients } : {}),
      dietaryTags: form.dietaryTags,
    };
    onSave(item);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-t-[28px] sm:rounded-[28px] p-5 border border-[#ECECEC] shadow-2xl z-10 max-h-[90vh] overflow-y-auto space-y-3">
        <div className="flex items-center justify-between border-b border-[#ECECEC] pb-3">
          <h3 className="text-sm font-bold text-[#222222]">{isEditing ? 'تعديل الطبق' : 'إضافة طبق جديد'}</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#FAFAF8] flex items-center justify-center text-[#777777] hover:text-[#222222] cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <ArabicInput label="اسم الطبق *" value={form.name} onChange={(v) => set({ name: v })} />

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={labelClass}>السعر (د.ع) *</label>
            <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => set({ price: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>السعر قبل الخصم</label>
            <input type="number" min="0" step="0.01" value={form.originalPrice} onChange={(e) => set({ originalPrice: e.target.value })} className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={labelClass}>الفئة</label>
            <select value={form.categoryId} onChange={(e) => set({ categoryId: e.target.value })} className={inputClass}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name.ar}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>السعرات الحرارية</label>
            <input type="number" min="0" value={form.calories} onChange={(e) => set({ calories: e.target.value })} className={inputClass} />
          </div>
        </div>

        <ImageInput label="صورة الطبق" value={form.image} onChange={(v) => set({ image: v })} />

        <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#444444] bg-[#FAFAF8] rounded-xl px-3 py-2.5 border border-[#ECECEC]">
          <input type="checkbox" checked={form.isSpecialOffer} onChange={(e) => set({ isSpecialOffer: e.target.checked })} className="accent-[#4CAF50] w-4 h-4" />
          عرض خاص
        </label>

        <button
          type="button"
          onClick={() => setShowDetails((s) => !s)}
          className="w-full py-2 rounded-xl bg-[#F2F2EE] hover:bg-[#EBEBE5] text-[#222222] text-xs font-semibold transition-all cursor-pointer"
        >
          {showDetails ? 'إخفاء التفاصيل الإضافية' : 'إظهار التفاصيل الإضافية (اختياري)'}
        </button>

        {showDetails && (
          <div className="space-y-3 pt-1 border-t border-[#ECECEC]">
            <ArabicTextarea label="الوصف" value={form.description} onChange={(v) => set({ description: v })} />
            <ArabicInput label="شارة العرض" value={form.offerBadge} onChange={(v) => set({ offerBadge: v })} />
            <ArabicTextarea label="ملاحظة الشيف" value={form.chefNote} onChange={(v) => set({ chefNote: v })} rows={1} />
            <ArabicTextarea
              label="المكونات (سطر لكل مكون)"
              value={{ ar: form.ingredients, ckb: form.ingredients, tr: form.ingredients }}
              onChange={(v) => set({ ingredients: v.ar })}
              rows={3}
            />
            <div>
              <label className={labelClass}>التصنيفات الغذائية</label>
              <div className="flex flex-wrap gap-1.5">
                {DIETARY_KEYS.map((tag) => {
                  const active = form.dietaryTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleDietary(tag)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer ${
                        active
                          ? 'bg-[#4CAF50] text-white border-[#4CAF50]'
                          : 'bg-[#FAFAF8] text-[#777777] border-[#ECECEC] hover:bg-[#F2F2EE]'
                      }`}
                    >
                      {DIETARY_TAG_LABELS[tag].ar}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-2xl bg-[#4CAF50] hover:bg-[#43A047] text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
        >
          {isEditing ? 'حفظ التعديلات' : 'إضافة الطبق'}
        </button>
      </div>
    </div>
  );
};

export const AdminDashboard: React.FC = () => {
  const { data, update, reset, loading } = useMenuData();
  const [draft, setDraft] = useState<MenuData>(() => clone(data));
  const [tab, setTab] = useState<Tab>('general');
  const [editor, setEditor] = useState<{ item: MenuItem | null; isNew: boolean } | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  const [fileSaveState, setFileSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Keep the draft in sync with the store until the user starts editing, so the
  // admin never works on stale data (initial file fetch, external saves, etc.).
  const draftRef = useRef(draft);
  draftRef.current = draft;
  const draftInitializedRef = useRef(false);
  const lastSyncedRef = useRef<MenuData>(data);

  useEffect(() => {
    if (loading) return;
    if (!draftInitializedRef.current) {
      draftInitializedRef.current = true;
      setDraft(clone(data));
      lastSyncedRef.current = data;
      return;
    }
    const prev = lastSyncedRef.current;
    lastSyncedRef.current = data;
    if (JSON.stringify(draftRef.current) === JSON.stringify(prev)) {
      setDraft(clone(data));
    }
  }, [loading, data]);

  useEffect(() => {
    if (!justSaved) return;
    const t = setTimeout(() => setJustSaved(false), 1600);
    return () => clearTimeout(t);
  }, [justSaved]);

  const hasChanges = useMemo(() => JSON.stringify(draft) !== JSON.stringify(data), [draft, data]);

  const setConfigField = (field: keyof RestaurantConfig, value: LocalizedText | string) =>
    setDraft((d) => ({ ...d, config: { ...d.config, [field]: value } }));

  const setCategory = (id: string, patch: Partial<Category>) =>
    setDraft((d) => ({ ...d, categories: d.categories.map((c) => (c.id === id ? { ...c, ...patch } : c)) }));

  const addCategory = () =>
    setDraft((d) => ({
      ...d,
      categories: [...d.categories, { id: `cat-${Date.now()}`, name: { ar: 'فئة جديدة', ckb: 'فەتەگۆریی نوێ', tr: 'Yeni Kategori' }, icon: '🍽️' }],
    }));

  const removeCategory = (id: string) =>
    setDraft((d) => ({
      ...d,
      categories: d.categories.filter((c) => c.id !== id),
      menuItems: d.menuItems.filter((it) => it.categoryId !== id),
      heroSlides: d.heroSlides.filter((s) => s.targetCategoryId !== id),
    }));

  const setSlide = (id: string, patch: Partial<HeroSlide>) =>
    setDraft((d) => ({ ...d, heroSlides: d.heroSlides.map((s) => (s.id === id ? { ...s, ...patch } : s)) }));

  const addSlide = () =>
    setDraft((d) => ({
      ...d,
      heroSlides: [
        ...d.heroSlides,
        {
          id: `slide-${Date.now()}`,
          title: { ar: 'شريحة جديدة', ckb: 'سلایدی نوێ', tr: 'Yeni Slayt' },
          subtitle: { ar: '', ckb: '', tr: '' },
          image: '',
          tag: { ar: '', ckb: '', tr: '' },
          targetCategoryId: d.categories[0]?.id ?? '',
        },
      ],
    }));

  const removeSlide = (id: string) =>
    setDraft((d) => ({ ...d, heroSlides: d.heroSlides.filter((s) => s.id !== id) }));

  const upsertItem = (item: MenuItem) =>
    setDraft((d) => {
      const exists = d.menuItems.some((it) => it.id === item.id);
      return {
        ...d,
        menuItems: exists ? d.menuItems.map((it) => (it.id === item.id ? item : it)) : [...d.menuItems, item],
      };
    });

  const removeItem = (id: string) =>
    setDraft((d) => ({ ...d, menuItems: d.menuItems.filter((it) => it.id !== id) }));

  useEffect(() => {
    if (fileSaveState === 'idle') return;
    const t = setTimeout(() => setFileSaveState('idle'), 3000);
    return () => clearTimeout(t);
  }, [fileSaveState]);

  const handleSave = async () => {
    update(draft);
    setJustSaved(true);
    setFileSaveState('saving');
    const result = await saveMenuDataToFiles(draft);
    if (result.ok) notifyMenuDataChanged();
    setFileSaveState(result.ok ? 'saved' : 'error');
  };

  const handleReset = () => {
    if (window.confirm('هل تريد استعادة البيانات الافتراضية؟ سيتم حذف جميع التغييرات الحالية.')) {
      reset();
      setDraft(defaultMenuData());
    }
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'general', label: 'بيانات المطعم', icon: <Store className="w-4 h-4" /> },
    { id: 'categories', label: 'الفئات', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'items', label: 'الأطباق', icon: <Utensils className="w-4 h-4" /> },
    { id: 'slides', label: 'الشرائح', icon: <Images className="w-4 h-4" /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F2] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#4CAF50]" />
          <p className="text-xs text-[#777777] font-semibold">جارٍ تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F2] text-[#222222] font-sans antialiased pb-24">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#ECECEC]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#4CAF50]/10 border border-[#4CAF50]/20 flex items-center justify-center text-[#4CAF50]">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-[#222222] leading-none">لوحة تحكم {draft.config.name.ar}</h1>
              <p className="text-[11px] text-[#777777] mt-1">إدارة قائمة الطعام والمحتوى</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAFAF8] border border-[#ECECEC] text-[#777777] hover:text-[#222222] text-xs font-semibold transition-all cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              عرض القائمة
            </a>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAFAF8] border border-[#ECECEC] text-[#777777] hover:text-[#222222] text-xs font-semibold transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              استعادة الافتراضي
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                hasChanges
                  ? 'bg-[#4CAF50] hover:bg-[#43A047] text-white'
                  : 'bg-[#E8E8E4] text-[#999999] cursor-not-allowed'
              }`}
            >
              <Save className="w-3.5 h-3.5" />
              حفظ التغييرات
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-4xl mx-auto px-4 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2">
          {tabs.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  active ? 'bg-[#222222] text-white shadow-xs' : 'bg-white text-[#777777] border border-[#ECECEC] hover:bg-[#FAFAF8]'
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            );
          })}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-5 space-y-4">
        {/* Toast */}
        <AnimatePresence>
          {justSaved && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="fixed top-20 right-1/2 translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#2E7D32] text-white text-xs font-bold shadow-lg"
            >
              <Check className="w-4 h-4" />
              تم حفظ التغييرات بنجاح
            </motion.div>
          )}
        </AnimatePresence>

        {/* General */}
        {tab === 'general' && (
          <section className="bg-white rounded-[24px] border border-[#ECECEC] p-5 space-y-4">
            <h2 className="text-sm font-bold text-[#222222]">بيانات المطعم العامة</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ArabicInput label="اسم المطعم" value={draft.config.name} onChange={(v) => setConfigField('name', v)} />
              <ArabicInput label="الشعار / الوصف المختصر" value={draft.config.tagline} onChange={(v) => setConfigField('tagline', v)} />
              <div>
                <label className={labelClass}>رقم الهاتف (للاتصال)</label>
                <input type="text" dir="ltr" value={draft.config.phone} onChange={(e) => setConfigField('phone', e.target.value)} className={`${inputClass} text-left`} />
              </div>
              <div>
                <label className={labelClass}>رقم الهاتف المعروض</label>
                <input type="text" dir="ltr" value={draft.config.formattedPhone} onChange={(e) => setConfigField('formattedPhone', e.target.value)} className={`${inputClass} text-left`} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>العنوان</label>
                <input type="text" value={draft.config.address} onChange={(e) => setConfigField('address', e.target.value)} className={inputClass} />
              </div>
              <ArabicInput label="ساعات العمل" value={draft.config.openingHours} onChange={(v) => setConfigField('openingHours', v)} />
              <div>
                <label className={labelClass}>رمز العملة</label>
                <input type="text" value={draft.config.currencySymbol} onChange={(e) => setConfigField('currencySymbol', e.target.value)} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <ImageInput label="شعار المطعم" value={draft.config.logo} onChange={(v) => setConfigField('logo', v)} />
              </div>
              <div>
                <label className={labelClass}>اللون الأساسي</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={draft.config.primaryColor} onChange={(e) => setConfigField('primaryColor', e.target.value)} className="w-10 h-10 rounded-xl cursor-pointer border border-[#ECECEC] bg-white" />
                  <span className="text-xs font-mono text-[#777777]" dir="ltr">{draft.config.primaryColor}</span>
                </div>
              </div>
              <div>
                <label className={labelClass}>اللون الثانوي</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={draft.config.secondaryColor} onChange={(e) => setConfigField('secondaryColor', e.target.value)} className="w-10 h-10 rounded-xl cursor-pointer border border-[#ECECEC] bg-white" />
                  <span className="text-xs font-mono text-[#777777]" dir="ltr">{draft.config.secondaryColor}</span>
                </div>
              </div>
            </div>

            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(draft.config.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#4CAF50] hover:underline"
            >
              معاينة العنوان في خرائط جوجل
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </section>
        )}

        {/* Categories */}
        {tab === 'categories' && (
          <section className="bg-white rounded-[24px] border border-[#ECECEC] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#222222]">الفئات ({draft.categories.length})</h2>
              <button
                onClick={addCategory}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#4CAF50] hover:bg-[#43A047] text-white text-xs font-bold transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                إضافة فئة
              </button>
            </div>
            <div className="space-y-2">
              {draft.categories.map((cat) => (
                <div key={cat.id} className="bg-[#FAFAF8] rounded-2xl border border-[#ECECEC] p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={cat.icon}
                      onChange={(e) => setCategory(cat.id, { icon: e.target.value })}
                      className="w-12 text-center text-sm px-1 py-2 rounded-xl border border-[#ECECEC] bg-white focus:outline-none focus:border-[#4CAF50]"
                      aria-label="أيقونة الفئة"
                    />
                    <div className="flex-1 grid grid-cols-1 gap-1.5">
                      <ArabicInput
                        label="اسم الفئة"
                        value={cat.name}
                        onChange={(v) => setCategory(cat.id, { name: v })}
                        placeholder="اسم الفئة بالعربية"
                      />
                    </div>
                    <button
                      onClick={() => removeCategory(cat.id)}
                      className="w-9 h-9 rounded-xl bg-white border border-[#ECECEC] flex items-center justify-center text-[#D32F2F] hover:bg-[#FFEBEE] transition-all cursor-pointer shrink-0"
                      aria-label="حذف الفئة"
                      title="حذف الفئة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <ArabicInput
                      label="الشارة (اختياري)"
                      value={cat.badge ?? { ar: '', ckb: '', tr: '' }}
                      onChange={(v) => setCategory(cat.id, { badge: v.ar.trim() ? v : undefined })}
                      placeholder="شارة الفئة"
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-[#777777]">
              ملاحظة: عند حذف فئة يتم حذف أطباقها وشرائحها المرتبطة بها تلقائياً.
            </p>
          </section>
        )}

        {/* Items */}
        {tab === 'items' && (
          <section className="bg-white rounded-[24px] border border-[#ECECEC] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#222222]">الأطباق ({draft.menuItems.length})</h2>
              <button
                onClick={() => setEditor({ item: null, isNew: true })}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#4CAF50] hover:bg-[#43A047] text-white text-xs font-bold transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                إضافة طبق
              </button>
            </div>
            <div className="space-y-2">
              {draft.menuItems.map((item) => {
                const cat = draft.categories.find((c) => c.id === item.categoryId);
                return (
                  <div key={item.id} className="flex items-center gap-3 bg-[#FAFAF8] rounded-2xl border border-[#ECECEC] p-2.5">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-[#ECECEC] shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name.ar} className="w-full h-full object-cover" onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')} />
                      ) : null}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#222222] truncate">{item.name.ar}</p>
                      <p className="text-[11px] text-[#777777] truncate mt-0.5">
                        {item.price.toLocaleString('en-US')} د.ع • {cat?.name.ar ?? 'بدون فئة'}
                      </p>
                    </div>
                    <button
                      onClick={() => setEditor({ item, isNew: false })}
                      className="w-8 h-8 rounded-xl bg-white border border-[#ECECEC] flex items-center justify-center text-[#4CAF50] hover:bg-[#E8F5E9] transition-all cursor-pointer shrink-0"
                      aria-label="تعديل الطبق"
                      title="تعديل"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-8 h-8 rounded-xl bg-white border border-[#ECECEC] flex items-center justify-center text-[#D32F2F] hover:bg-[#FFEBEE] transition-all cursor-pointer shrink-0"
                      aria-label="حذف الطبق"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
              {draft.menuItems.length === 0 && (
                <p className="text-xs text-[#777777] text-center py-8">لا توجد أطباق. أضف طبقاً جديداً للبدء.</p>
              )}
            </div>
          </section>
        )}

        {/* Slides */}
        {tab === 'slides' && (
          <section className="bg-white rounded-[24px] border border-[#ECECEC] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#222222]">شرائح البانر ({draft.heroSlides.length})</h2>
              <button
                onClick={addSlide}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#4CAF50] hover:bg-[#43A047] text-white text-xs font-bold transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                إضافة شريحة
              </button>
            </div>
            <div className="space-y-3">
              {draft.heroSlides.map((slide) => (
                <div key={slide.id} className="bg-[#FAFAF8] rounded-2xl border border-[#ECECEC] p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <ArabicInput
                      label="عنوان الشريحة"
                      value={slide.title}
                      onChange={(v) => setSlide(slide.id, { title: v })}
                    />
                    <button
                      onClick={() => removeSlide(slide.id)}
                      className="w-9 h-9 rounded-xl bg-white border border-[#ECECEC] flex items-center justify-center text-[#D32F2F] hover:bg-[#FFEBEE] transition-all cursor-pointer shrink-0 self-end"
                      aria-label="حذف الشريحة"
                      title="حذف الشريحة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <ArabicTextarea label="النص الفرعي" value={slide.subtitle} onChange={(v) => setSlide(slide.id, { subtitle: v })} rows={2} />
                    <div className="space-y-2">
                      <ArabicInput label="الشارة" value={slide.tag ?? { ar: '', ckb: '', tr: '' }} onChange={(v) => setSlide(slide.id, { tag: v })} />
                      <div>
                        <label className={labelClass}>الفئة المستهدفة</label>
                        <select value={slide.targetCategoryId} onChange={(e) => setSlide(slide.id, { targetCategoryId: e.target.value })} className={inputClass}>
                          {draft.categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name.ar}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <ImageInput label="صورة الشريحة" value={slide.image} onChange={(v) => setSlide(slide.id, { image: v })} />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Bottom sticky save bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#ECECEC]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <p className="text-[11px] text-[#777777]">
            {hasChanges ? 'لديك تغييرات غير محفوظة' : 'كل التغييرات محفوظة'}
          </p>
          {fileSaveState !== 'idle' && (
            <p
              className={`text-[11px] font-semibold ${
                fileSaveState === 'saved'
                  ? 'text-[#4CAF50]'
                  : fileSaveState === 'error'
                    ? 'text-[#D32F2F]'
                    : 'text-[#777777]'
              }`}
            >
              {fileSaveState === 'saving'
                ? 'جارٍ الحفظ في الملفات...'
                : fileSaveState === 'saved'
                  ? '✓ محفوظ في الملفات'
                  : '⚠ تعذر الحفظ في الملفات (الخادم غير متصل) — محفوظ محلياً'}
            </p>
          )}
          <div className="flex items-center gap-2">
            <a
              href={ADMIN_ROUTE}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAFAF8] border border-[#ECECEC] text-[#777777] hover:text-[#222222] text-xs font-semibold transition-all cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              فتح لوحة التحكم في نافذة جديدة
            </a>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                hasChanges
                  ? 'bg-[#4CAF50] hover:bg-[#43A047] text-white'
                  : 'bg-[#E8E8E4] text-[#999999] cursor-not-allowed'
              }`}
            >
              <Save className="w-3.5 h-3.5" />
              حفظ التغييرات
            </button>
          </div>
        </div>
      </div>

      {/* Item editor modal */}
      {editor && (
        <ItemEditorModal
          initial={editor.isNew ? null : itemToForm(editor.item!)}
          categories={draft.categories}
          onSave={(item) => {
            upsertItem(item);
            setEditor(null);
          }}
          onClose={() => setEditor(null)}
        />
      )}
    </div>
  );
};
