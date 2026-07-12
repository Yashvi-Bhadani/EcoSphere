import { useMemo } from 'react';

export const useAuthRole = () => {
  return useMemo(() => {
    const role = localStorage.getItem('role') || 'EMPLOYEE';
    return role.toUpperCase();
  }, []);
};
