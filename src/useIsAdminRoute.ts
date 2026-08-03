import { useEffect, useState } from 'react';

export const ADMIN_ROUTE = '/piecornerdashboard';

export function isAdminRoute(path: string = window.location.pathname): boolean {
  return path.startsWith(ADMIN_ROUTE);
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
