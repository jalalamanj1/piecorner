import React, { useState, useEffect } from 'react';
import { Featured } from './components/Featured';
import { Offers } from './components/Offers';
import { MenuSection } from './components/MenuSection';
import { ConfigDrawer } from './components/ConfigDrawer';
import { Header } from './components/Header';

import { config as defaultConfig, initialMenuData, sampleMenuData } from './config';
import { RestaurantConfig, MenuData } from './types';

const ADMIN_PATH = '/piecorneradminpanel';

export default function App() {
  // Central Config state
  const [config, setConfig] = useState<RestaurantConfig>(defaultConfig);

  // Central Menu Data - populated with the restaurant's menu
  const [menuData, setMenuData] = useState<MenuData>(sampleMenuData);

  // Simple path-based routing (works on root or a subpath like /piecorner/)
  const [pathname, setPathname] = useState(window.location.pathname);

  // Currently open accordion section (one at a time: 'featured' or a category id)
  const [openSection, setOpenSection] = useState<string | null>(null);

  const handleToggleSection = (id: string) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

  const isAdminPage = pathname === ADMIN_PATH || pathname.endsWith(ADMIN_PATH);
  const sitePrefix = isAdminPage ? pathname.slice(0, pathname.indexOf(ADMIN_PATH)) : '';

  useEffect(() => {
    const onLocationChange = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', onLocationChange);
    return () => window.removeEventListener('popstate', onLocationChange);
  }, []);

  const navigate = (path: string) => {
    const target = sitePrefix + path;
    window.history.pushState({}, '', target);
    setPathname(target);
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

  if (isAdminPage) {
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
      
      {/* Global Ambient Lighting Orbs (radial gradients — GPU-cheap, no blur filter) */}
      <div className="fixed top-[-120px] right-1/2 translate-x-1/2 w-[450px] h-[450px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(232,93,4,0.16) 0%, rgba(232,93,4,0.05) 45%, transparent 70%)' }} />
      <div className="fixed bottom-1/3 left-[-120px] w-[380px] h-[380px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,186,8,0.10) 0%, rgba(255,186,8,0.03) 45%, transparent 70%)' }} />

      {/* Main Container - Mobile Centered Architecture */}
      <div className="w-full max-w-lg mx-auto relative z-10 space-y-2">

        {/* HEADER */}
        <Header config={config} />

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
    </div>
  );
}
