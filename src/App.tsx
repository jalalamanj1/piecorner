import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { HeroCarousel } from './components/HeroCarousel';
import { CategoryTabs } from './components/CategoryTabs';
import { MenuSection } from './components/MenuSection';
import { ItemDetailModal } from './components/ItemDetailModal';
import { LocationModal, CallModal } from './components/InfoModals';
import { AdminDashboard } from './admin/AdminDashboard';
import { MenuData, useMenuData } from './data/menuStore';
import { defaultRestaurantConfig } from './data/restaurantData';
import { useIsAdminRoute } from './useIsAdminRoute';
import { LanguageProvider, useLanguage } from './i18n';
import { MenuItem, RestaurantConfig } from './types';

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
    return <AdminDashboard />;
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

  // Handle configuration updates
  const handleUpdateConfig = (newConfig: Partial<RestaurantConfig>) => {
    update({ ...data, config: { ...config, ...newConfig } });
  };

  const handleResetDefault = () => {
    update({ ...data, config: { ...defaultRestaurantConfig } });
  };

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
              onOpenLocation={() => setIsLocationOpen(true)}
              onOpenCall={() => setIsCallOpen(true)}
            />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col">
              {/* 2. Hero Banner (Image Carousel) */}
              <HeroCarousel
                slides={heroSlides}
                onSelectCategory={(catId) => setActiveCategoryId(catId)}
              />

              {/* 3. Horizontal Category Tabs */}
              <CategoryTabs
                categories={categories}
                activeCategoryId={activeCategoryId}
                onSelectCategory={(catId) => setActiveCategoryId(catId)}
              />

              {/* 4. Dynamic Menu Section */}
              <MenuSection
                activeCategory={activeCategory}
                items={currentMenuItems}
                currencySymbol={config.currencySymbol}
                onSelectItem={(item) => setSelectedItem(item)}
              />
            </main>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Item Detail Modal */}
      <ItemDetailModal
        item={selectedItem}
        currencySymbol={config.currencySymbol}
        onClose={() => setSelectedItem(null)}
      />

      {/* Location & Hours Modal */}
      <LocationModal
        isOpen={isLocationOpen}
        config={config}
        onClose={() => setIsLocationOpen(false)}
      />

      {/* Call Confirmation Modal */}
      <CallModal
        isOpen={isCallOpen}
        config={config}
        onClose={() => setIsCallOpen(false)}
      />
    </div>
  );
}
