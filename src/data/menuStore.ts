import { useEffect, useState } from 'react';
import {
  defaultRestaurantConfig,
  categories as defaultCategories,
  heroSlides as defaultHeroSlides,
  menuItems as defaultMenuItems,
} from './restaurantData';
import { fetchMenuDataFromFiles } from './fileStore';
import { Category, HeroSlide, MenuItem, RestaurantConfig } from '../types';

export interface MenuData {
  config: RestaurantConfig;
  categories: Category[];
  heroSlides: HeroSlide[];
  menuItems: MenuItem[];
}

const STORAGE_KEY = 'pie-corner-menu-admin-data-v4';
const SYNC_CHANNEL = 'pie-corner-menu-sync';

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

export function defaultMenuData(): MenuData {
  return {
    config: clone(defaultRestaurantConfig),
    categories: clone(defaultCategories),
    heroSlides: clone(defaultHeroSlides),
    menuItems: clone(defaultMenuItems),
  };
}

export function loadStoredMenuData(): MenuData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as MenuData;
    if (!parsed || typeof parsed !== 'object' || !parsed.config || !Array.isArray(parsed.menuItems)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function persistMenuData(data: MenuData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage unavailable or quota exceeded (e.g. very large images)
  }
}

// Ask other open tabs to reload the canonical file data after a save. Uses
// BroadcastChannel so it works even when localStorage is over quota.
export function notifyMenuDataChanged() {
  if ('BroadcastChannel' in window) {
    try {
      const channel = new BroadcastChannel(SYNC_CHANNEL);
      channel.postMessage({ type: 'saved' });
      channel.close();
    } catch {
      // ignore
    }
  }
}

export function useMenuData() {
  const [data, setData] = useState<MenuData>(() => {
    return loadStoredMenuData() ?? defaultMenuData();
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    persistMenuData(data);
  }, [data]);

  // Always load the canonical file data on mount. The file is the source of
  // truth; localStorage is only an offline cache for when the server is down.
  useEffect(() => {
    let cancelled = false;
    fetchMenuDataFromFiles()
      .then((remote) => {
        if (!cancelled && remote) setData(remote);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Live cross-tab sync after an admin save: the admin writes the file then
  // broadcasts on the sync channel; other tabs refetch the canonical file data.
  useEffect(() => {
    if (!('BroadcastChannel' in window)) return;
    const channel = new BroadcastChannel(SYNC_CHANNEL);
    const onMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'saved') {
        fetchMenuDataFromFiles()
          .then((remote) => {
            if (remote) setData(remote);
          })
          .catch(() => {});
      }
    };
    channel.addEventListener('message', onMessage);
    return () => {
      channel.removeEventListener('message', onMessage);
      channel.close();
    };
  }, []);

  // Fallback live sync: when the admin saves in another tab it writes
  // localStorage, which fires a storage event here (only works when data fits
  // the localStorage quota).
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      const stored = loadStoredMenuData();
      if (stored) setData(stored);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const update = (next: MenuData) => setData(next);
  const reset = () => setData(defaultMenuData());

  return { data, update, reset, loading };
}
