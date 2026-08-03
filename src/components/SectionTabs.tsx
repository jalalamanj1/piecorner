import React, { useEffect, useRef } from 'react';

interface Tab {
  id: string;
  label: string;
}

interface SectionTabsProps {
  tabs: Tab[];
  activeId: string;
  onSelect: (id: string) => void;
}

// Sticky row of section titles, one next to each other.
// The active section is highlighted; clicking one scrolls to its list.
export const SectionTabs: React.FC<SectionTabsProps> = ({ tabs, activeId, onSelect }) => {
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Keep the active tab in view inside the horizontal row
  useEffect(() => {
    const btn = btnRefs.current[activeId];
    if (btn) {
      btn.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
    }
  }, [activeId]);

  return (
    <nav className="sticky top-[74px] z-40 bg-[#181818]/70 backdrop-blur-xl px-3 py-2 w-full max-w-lg mx-auto">
      <div className="flex gap-2 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const active = tab.id === activeId;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                btnRefs.current[tab.id] = el;
              }}
              onClick={() => onSelect(tab.id)}
              className={`shrink-0 px-4 py-2 rounded-2xl text-xs font-black transition-all duration-300 border whitespace-nowrap ${
                active
                  ? 'glass-button-primary text-white shadow-lg border-white/30'
                  : 'glass-panel text-white/70 border-white/15 hover:text-white hover:border-white/30'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
