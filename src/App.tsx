import { Suspense, lazy, useCallback, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { HeroCarousel } from './components/HeroCarousel';
import { CategoryTabs } from './components/CategoryTabs';
import { MenuSection } from './components/MenuSection';
import { MenuData, useMenuData } from './data/menuStore';
import { useIsAdminRoute } from './useIsAdminRoute';
import { LanguageProvider, useLanguage } from './i18n';
import { MenuItem } from './types';

// Code-split the admin panel and the modals so they never load on the public page.
const AdminDashboard = lazy(() =>
  import('./admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);
const ItemDetailModal = lazy(() =>
  import('./components/ItemDetailModal').then((m) => ({ default: m.ItemDetailModal }))
);
const LocationModal = lazy(() =>
  import('./components/InfoModals').then((m) => ({ default: m.LocationModal }))
);
const CallModal = lazy(() =>
  import('./components/InfoModals').then((m) => ({ default: m.CallModal }))
);

const MODAL_FALLBACK = null;

export default function App() {
  return (
    <LanguageProvider>
      <Root />
    </LanguageProvider>
  );
}

function Root() {
  const { data, update } = useMenuData();
  const isAdmin = useIsAdminRoute();

  if (isAdmin) {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#F5F5F2] flex items-center justify-center">
            <p className="text-xs text-[#777777] font-semibold">جارٍ التحميل...</p>
          </div>
        }
      >
        <AdminDashboard />
      </Suspense>
    );
  }

  return <PublicMenu data={data} update={update} />;
}

interface PublicMenuProps {
  data: MenuData;
  update: (next: MenuData) => void;
}

function PublicMenu({ data, update }: PublicMenuProps) {
  const { lang } = useLanguage();
  const [activeCategoryId, setActiveCategoryId] = useState<string>(() => data.categories[0]?.id ?? '');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isLocationOpen, setIsLocationOpen] = useState<boolean>(false);
  const [isCallOpen, setIsCallOpen] = useState<boolean>(false);

  const { config, categories, heroSlides, menuItems } = data;

  // Active Category Object
  const activeCategory = useMemo(() => {
    return categories.find((c) => c.id === activeCategoryId) || categories[0];
  }, [activeCategoryId, categories]);

  // Filtered Menu Items
  const currentMenuItems = useMemo(() => {
    return menuItems.filter((item) => item.categoryId === activeCategoryId);
  }, [activeCategoryId, menuItems]);

  const handleSelectCategory = useCallback((catId: string) => setActiveCategoryId(catId), []);

  const handleOpenLocation = useCallback(() => setIsLocationOpen(true), []);
  const handleCloseLocation = useCallback(() => setIsLocationOpen(false), []);
  const handleOpenCall = useCallback(() => setIsCallOpen(true), []);
  const handleCloseCall = useCallback(() => setIsCallOpen(false), []);
  const handleSelectItem = useCallback((item: MenuItem) => setSelectedItem(item), []);
  const handleCloseItem = useCallback(() => setSelectedItem(null), []);

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#222222] font-sans antialiased selection:bg-[#4CAF50]/20 selection:text-[#222222]">
      {/* Container simulating high quality mobile 9:16 layout centered on desktop viewports */}
      <div className="max-w-md mx-auto bg-[#FAFAF8] min-h-screen shadow-2xl sm:border-x border-[#ECECEC] flex flex-col relative pb-16">
        {/* Smooth language switch transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={lang}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="flex flex-col"
          >
            {/* 1. Sticky Header */}
            <Header
              config={config}
              onOpenLocation={handleOpenLocation}
              onOpenCall={handleOpenCall}
            />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col">
              {/* 2. Hero Banner (Image Carousel) */}
              <HeroCarousel
                slides={heroSlides}
                onSelectCategory={handleSelectCategory}
              />

              {/* 3. Horizontal Category Tabs */}
              <CategoryTabs
                categories={categories}
                activeCategoryId={activeCategoryId}
                onSelectCategory={handleSelectCategory}
              />

              {/* 4. Dynamic Menu Section */}
              <MenuSection
                activeCategory={activeCategory}
                items={currentMenuItems}
                currencySymbol={config.currencySymbol}
                onSelectItem={handleSelectItem}
              />
            </main>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Item Detail Modal */}
      <Suspense fallback={MODAL_FALLBACK}>
        <ItemDetailModal
          item={selectedItem}
          currencySymbol={config.currencySymbol}
          onClose={handleCloseItem}
        />
      </Suspense>

      {/* Location & Hours Modal */}
      <Suspense fallback={MODAL_FALLBACK}>
        <LocationModal
          isOpen={isLocationOpen}
          config={config}
          onClose={handleCloseLocation}
        />
      </Suspense>

      {/* Call Confirmation Modal */}
      <Suspense fallback={MODAL_FALLBACK}>
        <CallModal
          isOpen={isCallOpen}
          config={config}
          onClose={handleCloseCall}
        />
      </Suspense>
    </div>
  );
}
