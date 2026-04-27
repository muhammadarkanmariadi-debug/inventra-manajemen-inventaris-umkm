import { useAuth } from '../context/AuthContext';

export function usePermission() {
  const { roles, permissions, hasPermission, user, business, isLoading } = useAuth();
  
  const isSuperAdmin = user?.role === 'SUPERADMIN';
  const isOwner = roles.includes('OWNER');
  
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
