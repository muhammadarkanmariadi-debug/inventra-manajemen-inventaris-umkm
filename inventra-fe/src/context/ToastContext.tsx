'use client'
import React, { useState, createContext, useContext } from 'react';
import { Toaster, toast } from 'sonner';



/**
 * ToastProvider wraps the Sonner Toaster with our application's design system tokens.
 * This should be injected at the root of the React application.
 */
type ToastPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';

export const ToastContext = createContext({
  value: 'top-left' as ToastPosition,
  setValue: (v: ToastPosition) => { }, // Placeholder fungsi
});

export function ToastProvider({ children }: { children: React.ReactNode }) {

  const [value, setValue] = useState<ToastPosition>('top-left');

  return (
    <ToastContext.Provider value={{ value, setValue }}>

      <Toaster
        position={value}
        richColors
        toastOptions={{
          className: 'font-sans',
          style: {
            boxShadow: 'var(--tw-shadow-sm)',
          }
        }}
      />
      {children}
    </ToastContext.Provider>
  );

}
export const useToast = () => {
  const context = useContext(ToastContext);
  
  // It's good practice to ensure the hook is used inside a Provider
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
};
