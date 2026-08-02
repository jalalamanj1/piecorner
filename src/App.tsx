import React, { useState, useEffect } from 'react';
import { Featured } from './components/Featured';
import { Offers } from './components/Offers';
import { MenuSection } from './components/MenuSection';
import { FloatingButtons } from './components/FloatingButtons';
import { ConfigDrawer } from './components/ConfigDrawer';

import { config as defaultConfig, initialMenuData, sampleMenuData } from './config';
import { RestaurantConfig, MenuData } from './types';

const ADMIN_PATH = '/piecorneradminpanel';

export default function App() {
  // Central Config state
  const [config, setConfig] = useState<RestaurantConfig>(defaultConfig);

  // Central Menu Data - populated with the restaurant's menu
  const [menuData, setMenuData] = useState<MenuData>(sampleMenuData);

  // Simple path-based routing
  const [pathname, setPathname] = useState(window.location.pathname);

  // Currently open accordion section (one at a time: 'featured' or a category id)
  const [openSection, setOpenSection] = useState<string | null>(null);

  const handleToggleSection = (id: string) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const onLocationChange = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', onLocationChange);
    return () => window.removeEventListener('popstate', onLocationChange);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setPathname(path);
    window.scrollTo({ top: 0 });
  };

  // Handlers
  const handleUpdateConfig = (newConfig: RestaurantConfig) => {
    setConfig(newConfig);
  };

  const handleUpdateMenuData = (newMenu: MenuData) => {
    setMenuData(newMenu);
  };

  const handleLoadSampleMenu = () => {
    setMenuData(sampleMenuData);
  };

  const handleClearMenu = () => {
    setMenuData(initialMenuData);
  };

  if (pathname === ADMIN_PATH) {
    return (
      <ConfigDrawer
        isOpen
        variant="page"
        onClose={() => navigate('/')}
        config={config}
        onUpdateConfig={handleUpdateConfig}
        menuData={menuData}
        onUpdateMenuData={handleUpdateMenuData}
        onLoadSampleMenu={handleLoadSampleMenu}
        onClearMenu={handleClearMenu}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#181818] text-white selection:bg-[#E85D04] selection:text-white font-['Cairo',sans-serif] relative overflow-x-hidden">
      
      {/* Global Ambient Lighting Orbs */}
      <div className="fixed top-0 right-1/2 translate-x-1/2 w-[350px] h-[350px] bg-[#E85D04]/12 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-1/3 left-0 w-[300px] h-[300px] bg-[#FFBA08]/8 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Container - Mobile Centered Architecture */}
      <div className="w-full max-w-lg mx-auto relative z-10 space-y-2">
        
        {/* MOST REQUESTED ⭐ */}
        <Featured
          featuredItems={menuData.featured || []}
          isOpen={openSection === 'featured'}
          onToggle={() => handleToggleSection('featured')}
        />

        {/* OFFERS 🎉 */}
        <Offers
          isOpen={openSection === 'offers'}
          onToggle={() => handleToggleSection('offers')}
        />

        {/* MENU */}
        <MenuSection
          menuData={menuData}
          openCategory={openSection}
          onToggleCategory={handleToggleSection}
        />

      </div>

      {/* FLOATING ACTION BUTTONS */}
      <FloatingButtons config={config} />

    </div>
  );
}
