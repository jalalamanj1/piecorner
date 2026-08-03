import { useEffect, useState } from 'react';

export const ADMIN_ROUTE = '/piecornerdashboard';

export function isAdminRoute(path: string = window.location.pathname): boolean {
  const base = import.meta.env.BASE_URL;
  let p = path;
  if (base && base !== '/' && p.startsWith(base)) {
    p = p.slice(base.length - 1);
  }
  return p.startsWith(ADMIN_ROUTE);
}

export function useIsAdminRoute(): boolean {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => isAdminRoute());

  useEffect(() => {
    const onPopState = () => setIsAdmin(isAdminRoute());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return isAdmin;
}
