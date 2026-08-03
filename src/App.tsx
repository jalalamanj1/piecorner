import React, { useState, useEffect, useMemo } from 'react';
import { OffersCarousel } from './components/OffersCarousel';
import { Featured } from './components/Featured';
import { MenuSection } from './components/MenuSection';
import { SectionTabs } from './components/SectionTabs';
import { ConfigDrawer } from './components/ConfigDrawer';
import { Header } from './components/Header';

import { config as defaultConfig, initialMenuData, sampleMenuData, categories } from './config';
import { RestaurantConfig, MenuData } from './types';

const ADMIN_PATH = '/piecorneradminpanel';

// Offset below the sticky header + tab bar where sections snap to
const SECTION_OFFSET = 124;
const SPY_LINE = 132;

export default function App() {
  // Central Config state
  const [config, setConfig] = useState<RestaurantConfig>(defaultConfig);

  // Central Menu Data - populated with the restaurant's menu
  const [menuData, setMenuData] = useState<MenuData>(sampleMenuData);

  // Simple path-based routing (works on root or a subpath like /piecorner/)
  const [pathname, setPathname] = useState(window.location.pathname);

  // Section currently in view (scroll-spy), used to highlight the active tab
  const [activeSection, setActiveSection] = useState('offers');

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

  // Section tabs: offers slideshow first, then featured, then each category
  const tabs = useMemo(
    () => [
      { id: 'offers', label: 'العروض' },
      { id: 'featured', label: 'الأكثر طلبًا' },
      ...categories.map((c) => ({ id: c.id, label: c.titleAr })),
    ],
    []
  );

  // Scroll-spy: highlight the section currently sitting below the tab bar
  useEffect(() => {
    const ids = tabs.map((t) => t.id);
    const onScroll = () => {
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= SPY_LINE) current = id;
        else break;
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [tabs]);

  const handleSelectSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    <div className="min-h-screen bg-[#181818] text-white selection:bg-[#E85D04] selection:text-white font-['Cairo',sans-serif] relative">

      {/* Global Ambient Lighting Orbs (radial gradients — GPU-cheap, no blur filter) */}
      <div className="fixed top-[-120px] right-1/2 translate-x-1/2 w-[450px] h-[450px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(232,93,4,0.16) 0%, rgba(232,93,4,0.05) 45%, transparent 70%)' }} />
      <div className="fixed bottom-1/3 left-[-120px] w-[380px] h-[380px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,186,8,0.10) 0%, rgba(255,186,8,0.03) 45%, transparent 70%)' }} />

      {/* Main Container - Mobile Centered Architecture */}
      <div className="w-full max-w-lg mx-auto relative z-10">
        {/* HEADER */}
        <Header config={config} />

        {/* OFFERS SLIDESHOW - first section, above the tabs */}
        <OffersCarousel />

        {/* Section titles in one row */}
        <SectionTabs tabs={tabs} activeId={activeSection} onSelect={handleSelectSection} />

        {/* Section lists (each snaps below the sticky header + tabs) */}
        <div className="space-y-5 pb-8 pt-2">
          <Featured featuredItems={menuData.featured || []} />
          <MenuSection menuData={menuData} />
        </div>
      </div>
    </div>
  );
}
