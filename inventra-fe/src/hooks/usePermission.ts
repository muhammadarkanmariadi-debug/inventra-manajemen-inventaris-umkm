import { useAuth } from '../context/AuthContext';

export function usePermission() {
  const { roles, permissions, hasPermission, user, business, isLoading } = useAuth();
  
  const isSuperAdmin = roles.includes('SUPERADMIN') || roles.includes('superadmin');
  const isOwner = roles.includes('owner');
  
  return {
    roles,
    permissions,
    hasPermission,
    isSuperAdmin,
    isOwner,
    user,
    business,
    isLoading
  };
}
