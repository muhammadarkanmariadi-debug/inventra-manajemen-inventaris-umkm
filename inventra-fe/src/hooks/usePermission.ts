import { useAuth } from '@/context/AuthContext';

export function usePermission() {
  const { roles, permissions, hasPermission, user, business, isLoading } = useAuth();
  
  const isSuperAdmin = user?.role === 'SUPERADMIN';

  return {
    roles,
    permissions,
    hasPermission,
    isSuperAdmin,

    user,
    business,
    isLoading
  };
}
