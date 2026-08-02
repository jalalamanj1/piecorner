import React, { useState } from 'react';
import { RestaurantConfig, MenuData, MenuItem, MenuCategoryData } from '../types';
import { categories } from '../config';
import { X, Settings, Phone, Link as LinkIcon, MapPin, Sparkles, Plus, Trash2, CheckCircle, Database, Flame, ArrowLeft } from 'lucide-react';
import { createRipple } from '../utils/ripple';

interface ConfigDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: RestaurantConfig;
  onUpdateConfig: (newConfig: RestaurantConfig) => void;
  menuData: MenuData;
  onUpdateMenuData: (newMenu: MenuData) => void;
  onLoadSampleMenu: () => void;
  onClearMenu: () => void;
  variant?: 'drawer' | 'page';
}

export const ConfigDrawer: React.FC<ConfigDrawerProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  menuData,
  onUpdateMenuData,
  onLoadSampleMenu,
  onClearMenu,
  variant = 'drawer',
}) => {
  const [activeTab, setActiveTab] = useState<'config' | 'menu'>('config');
  const [localConfig, setLocalConfig] = useState<RestaurantConfig>(config);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New item form state for manual menu insertion
  const [newItemCategory, setNewItemCategory] = useState<MenuCategoryData['id'] | 'featured'>('pizza');
  const [newItemName, setNewItemName] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemBadge, setNewItemBadge] = useState('');
  const [newItemImage, setNewItemImage] = useState('');

  if (variant === 'drawer' && !isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig(localConfig);
    showToast('تم تحديث إعدادات المطعم بنجاح!');
  };

  const handleAddMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice) return;

    const newItem: MenuItem = {
      id: Date.now().toString(),
      nameAr: newItemName,
      descriptionAr: newItemDesc || 'صنف فاخر أعد بعناية في مطبخ باي كورنر',
      price: newItemPrice.includes('د.ع') ? newItemPrice : `${newItemPrice} د.ع`,
      badge: newItemBadge || undefined,
      image: newItemImage || undefined
    };

    const targetKey = newItemCategory as keyof MenuData;
    const currentList = menuData[targetKey] || [];

    const updatedMenu = {
      ...menuData,
      [targetKey]: [...currentList, newItem],
    };

    onUpdateMenuData(updatedMenu);
    setNewItemName('');
    setNewItemDesc('');
    setNewItemPrice('');
    setNewItemBadge('');
    setNewItemImage('');

    const targetLabel = newItemCategory === 'featured'
      ? 'الأكثر طلبًا ⭐'
      : categories.find((c) => c.id === newItemCategory)?.titleAr;

    showToast(`تمت إضافة "${newItemName}" إلى ${targetLabel}!`);
  };

  const handleRemoveItem = (key: keyof MenuData, itemId: string) => {
    const updatedCategoryItems = (menuData[key] || []).filter((item) => item.id !== itemId);
    const updatedMenu = {
      ...menuData,
      [key]: updatedCategoryItems,
    };
    onUpdateMenuData(updatedMenu);
    showToast('تم حذف الصنف من القائمة.');
  };

  return (
    <div className={`${variant === 'page' ? 'min-h-screen bg-[#181818] flex justify-center' : 'fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md animate-in fade-in duration-300'}`}>
      <div className={`${variant === 'page' ? 'w-full max-w-lg min-h-screen' : 'w-full max-w-lg bg-[#181818] border-r border-white/20 h-full overflow-y-auto'} overflow-y-auto p-5 flex flex-col justify-between shadow-2xl relative`}>
        
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-white/15">
            <div className="flex items-center gap-3">
              <div className="p-2 glass-panel rounded-2xl text-[#FFBA08]">
                <Settings className="w-5 h-5 animate-spin-slow" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">لوحة تحكم باي كورنر</h3>
                <p className="text-[11px] text-[#FFE8CC]/70 font-medium">
                  تعديل كائن Config وإدارة الأصناف في menuData
                </p>
              </div>
            </div>
            {variant === 'drawer' ? (
              <button
                onClick={(e) => {
                  createRipple(e);
                  onClose();
                }}
                className="ripple-button p-2 glass-panel rounded-2xl text-white hover:text-[#E85D04] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={(e) => {
                  createRipple(e);
                  onClose();
                }}
                className="ripple-button p-2.5 glass-panel rounded-2xl text-[#FFBA08] hover:text-white transition-colors flex items-center gap-1.5 text-[11px] font-bold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>العودة للموقع</span>
              </button>
            )}
          </div>

          {/* Toast Notification */}
          {toastMessage && (
            <div className="mt-3 p-3 glass-panel bg-emerald-950/80 border border-emerald-500/40 rounded-2xl text-xs font-bold text-emerald-300 flex items-center gap-2 animate-in slide-in-from-top-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Tabs Toggle */}
          <div className="flex items-center gap-2 my-4 p-1 glass-panel rounded-2xl border border-white/15">
            <button
              onClick={(e) => {
                createRipple(e);
                setActiveTab('config');
              }}
              className={`ripple-button flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'config'
                  ? 'glass-button-primary text-white shadow-lg'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              إعدادات المطعم (Config)
            </button>
            <button
              onClick={(e) => {
                createRipple(e);
                setActiveTab('menu');
              }}
              className={`ripple-button flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'menu'
                  ? 'glass-button-primary text-white shadow-lg'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              إدارة القائمة (menuData)
            </button>
          </div>

          {/* Tab 1: Config Object Customizer */}
          {activeTab === 'config' && (
            <form onSubmit={handleSaveConfig} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-[#FFE8CC] mb-1">اسم المطعم (restaurantName)</label>
                <input
                  type="text"
                  value={localConfig.restaurantName}
                  onChange={(e) => setLocalConfig({ ...localConfig, restaurantName: e.target.value })}
                  className="w-full bg-white/5 border border-white/15 rounded-xl p-2.5 text-xs text-white focus:border-[#E85D04] focus:outline-none"
                  placeholder="باى كورنر"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#FFE8CC] mb-1">الشعار (slogan)</label>
                <input
                  type="text"
                  value={localConfig.slogan}
                  onChange={(e) => setLocalConfig({ ...localConfig, slogan: e.target.value })}
                  className="w-full bg-white/5 border border-white/15 rounded-xl p-2.5 text-xs text-white focus:border-[#E85D04] focus:outline-none"
                  placeholder="شعار المطعم العربي..."
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#FFE8CC] mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#FFBA08]" />
                  <span>رقم الهاتف (phone)</span>
                </label>
                <input
                  type="text"
                  value={localConfig.phone}
                  onChange={(e) => setLocalConfig({ ...localConfig, phone: e.target.value })}
                  className="w-full bg-white/5 border border-white/15 rounded-xl p-2.5 text-xs text-white focus:border-[#E85D04] focus:outline-none"
                  placeholder="+966501234567"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#FFE8CC] mb-1 flex items-center gap-1">
                  <LinkIcon className="w-3.5 h-3.5 text-[#E85D04]" />
                  <span>رابط الطلب المباشر (orderLink)</span>
                </label>
                <input
                  type="text"
                  value={localConfig.orderLink}
                  onChange={(e) => setLocalConfig({ ...localConfig, orderLink: e.target.value })}
                  className="w-full bg-white/5 border border-white/15 rounded-xl p-2.5 text-xs text-white focus:border-[#E85D04] focus:outline-none"
                  placeholder="https://piecorner.sa/order"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#FFE8CC] mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#FFBA08]" />
                  <span>رابط خرائط جوجل (locationLink)</span>
                </label>
                <input
                  type="text"
                  value={localConfig.locationLink}
                  onChange={(e) => setLocalConfig({ ...localConfig, locationLink: e.target.value })}
                  className="w-full bg-white/5 border border-white/15 rounded-xl p-2.5 text-xs text-white focus:border-[#E85D04] focus:outline-none"
                  placeholder="https://maps.google.com/..."
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#FFE8CC] mb-1">العنوان بالتفصيل (addressAr)</label>
                <input
                  type="text"
                  value={localConfig.addressAr}
                  onChange={(e) => setLocalConfig({ ...localConfig, addressAr: e.target.value })}
                  className="w-full bg-white/5 border border-white/15 rounded-xl p-2.5 text-xs text-white focus:border-[#E85D04] focus:outline-none"
                  placeholder="شارع التخصصي، حي المحمدية، الرياض"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  onClick={(e) => createRipple(e)}
                  className="ripple-button w-full glass-button-primary min-h-[50px] rounded-2xl font-bold text-xs text-white shadow-xl"
                >
                  حفظ التغييرات
                </button>
              </div>
            </form>
          )}

          {/* Tab 2: Menu Data Manager */}
          {activeTab === 'menu' && (
            <div className="space-y-5">
              {/* Data Control Actions */}
              <div className="p-3.5 glass-panel rounded-2xl border border-white/15 space-y-2.5">
                <h4 className="text-xs font-extrabold text-[#FFBA08] flex items-center gap-1.5">
                  <Database className="w-4 h-4" />
                  <span>توليد القائمة أو التفريغ (Data Control)</span>
                </h4>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={(e) => {
                      createRipple(e);
                      onLoadSampleMenu();
                      showToast('تم تحميل القائمة التجريبية بنجاح!');
                    }}
                    className="ripple-button glass-button-primary py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#FFBA08]" />
                    <span>توليد قائمة تجريبية</span>
                  </button>
                  <button
                    onClick={(e) => {
                      createRipple(e);
                      onClearMenu();
                      showToast('تم تفريغ جميع المصفوفات (EMPTY).');
                    }}
                    className="ripple-button glass-button-secondary py-2.5 rounded-xl text-xs font-bold text-rose-300 hover:text-rose-200 flex items-center justify-center gap-1.5 border-rose-500/30"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>تفريغ القائمة (EMPTY)</span>
                  </button>
                </div>
              </div>

              {/* Form to Add New Custom Item */}
              <form onSubmit={handleAddMenuItem} className="p-3.5 glass-panel rounded-2xl border border-white/15 space-y-2.5">
                <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-[#E85D04]" />
                  <span>إضافة صنف جديد ديناميكياً</span>
                </h4>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] text-white/70 mb-1">القسم المستهدف</label>
                    <select
                      value={newItemCategory}
                      onChange={(e) => setNewItemCategory(e.target.value as MenuCategoryData['id'] | 'featured')}
                      className="w-full bg-[#181818] border border-white/15 rounded-xl p-2 text-xs text-white focus:outline-none"
                    >
                      <option value="featured">🔥 الأكثر طلبًا (featured)</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.titleAr}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-white/70 mb-1">اسم الصنف *</label>
                    <input
                      type="text"
                      required
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      placeholder="بيتزا الفصول الأربعة"
                      className="w-full bg-white/5 border border-white/15 rounded-xl p-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] text-white/70 mb-1">السعر *</label>
                    <input
                      type="text"
                      required
                      value={newItemPrice}
                      onChange={(e) => setNewItemPrice(e.target.value)}
                      placeholder="8000 د.ع"
                      className="w-full bg-white/5 border border-white/15 rounded-xl p-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-white/70 mb-1">شارة خاصة (اختياري)</label>
                    <input
                      type="text"
                      value={newItemBadge}
                      onChange={(e) => setNewItemBadge(e.target.value)}
                      placeholder="الأكثر طلباً ⭐"
                      className="w-full bg-white/5 border border-white/15 rounded-xl p-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-white/70 mb-1">رابط الصورة (اختياري)</label>
                  <input
                    type="text"
                    value={newItemImage}
                    onChange={(e) => setNewItemImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-white/5 border border-white/15 rounded-xl p-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-white/70 mb-1">الوصف</label>
                  <input
                    type="text"
                    value={newItemDesc}
                    onChange={(e) => setNewItemDesc(e.target.value)}
                    placeholder="مكونات الصنف والتفاصيل..."
                    className="w-full bg-white/5 border border-white/15 rounded-xl p-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  onClick={(e) => createRipple(e)}
                  className="ripple-button w-full glass-button-primary min-h-[44px] rounded-xl font-bold text-xs text-white flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Plus className="w-4 h-4 text-[#FFBA08]" />
                  <span>إضافة الصنف إلى المصفوفة</span>
                </button>
              </form>

              {/* Current Items List Preview */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-extrabold text-white">الأصناف المضافة حالياً في المصفوفات:</h4>
                
                {/* Featured Section Items */}
                <div className="p-2.5 glass-panel rounded-xl border border-white/10 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-[#FFBA08]">
                    <span className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-[#E85D04]" />
                      <span>الأكثر طلبًا (featured) ({menuData.featured?.length || 0})</span>
                    </span>
                  </div>
                  {(!menuData.featured || menuData.featured.length === 0) ? (
                    <p className="text-[10px] text-white/40 italic">لا توجد أصناف حالياً (فارغ)</p>
                  ) : (
                    <div className="space-y-1">
                      {menuData.featured.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between bg-white/5 p-2 rounded-lg text-xs"
                        >
                          <div className="truncate pl-2">
                            <span className="font-bold text-white">{item.nameAr}</span>
                            <span className="text-[#FFBA08] font-mono mr-2">({item.price})</span>
                          </div>
                          <button
                            onClick={() => handleRemoveItem('featured', item.id)}
                            className="text-rose-400 hover:text-rose-300 p-1"
                            title="حذف"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Category Items */}
                {categories.map((cat) => {
                  const catItems = menuData[cat.id] || [];
                  return (
                    <div key={cat.id} className="p-2.5 glass-panel rounded-xl border border-white/10 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-[#FFBA08]">
                        <span>{cat.titleAr} ({catItems.length})</span>
                      </div>
                      {catItems.length === 0 ? (
                        <p className="text-[10px] text-white/40 italic">لا توجد أصناف حالياً (فارغ)</p>
                      ) : (
                        <div className="space-y-1">
                          {catItems.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between bg-white/5 p-2 rounded-lg text-xs"
                            >
                              <div className="truncate pl-2">
                                <span className="font-bold text-white">{item.nameAr}</span>
                                <span className="text-[#FFBA08] font-mono mr-2">({item.price})</span>
                              </div>
                              <button
                                onClick={() => handleRemoveItem(cat.id, item.id)}
                                className="text-rose-400 hover:text-rose-300 p-1"
                                title="حذف"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="pt-4 border-t border-white/10 text-center">
          <p className="text-[10px] text-white/40 font-medium">
            تصميم مخصص 100% للهواتف الذكية والتصفح باللمس بأسلوب الجلاس مورفيزم الفاخر
          </p>
        </div>

      </div>
    </div>
  );
};
