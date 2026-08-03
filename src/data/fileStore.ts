import type { MenuData } from './menuStore';

const SAVE_ENDPOINTS = ['/api/save', 'http://localhost:3999/api/save'];
const DATA_ENDPOINTS = ['/api/menu-data', 'http://localhost:3999/api/menu-data'];

export async function saveMenuDataToFiles(data: MenuData): Promise<{ ok: boolean }> {
  for (const url of SAVE_ENDPOINTS) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
      });
      if (res.ok) {
        const json = await res.json().catch(() => ({}));
        if (json && json.ok === true) return { ok: true };
      }
    } catch {
      // server not reachable at this endpoint, try next
    }
  }
  return { ok: false };
}

export async function fetchMenuDataFromFiles(): Promise<MenuData | null> {
  for (const url of DATA_ENDPOINTS) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const json = await res.json();
      if (json && typeof json === 'object' && json.config && Array.isArray(json.menuItems)) {
        return json as MenuData;
      }
    } catch {
      // server not reachable at this endpoint, try next
    }
  }
  return null;
}
