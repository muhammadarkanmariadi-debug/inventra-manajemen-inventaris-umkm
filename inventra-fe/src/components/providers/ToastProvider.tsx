'use client'
import React, { useState } from 'react';
import { Toaster, toast } from 'sonner';
import { createContext } from 'vm';

/**
 * ToastProvider wraps the Sonner Toaster with our application's design system tokens.
 * This should be injected at the root of the React application.
 */
  const ToastContext = createContext({
    value: '',
    setValue: (v: string) => { }, // Placeholder fungsi
  });

export function ToastProvider({ children }: { children: React.ReactNode }) {

  const [value, setValue] = useState();

  return (
    <ToastContext.Provider value={{value, setValue}}>

      <Toaster
        position={value }
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

 export const useToast = () => createContext(ToastContext)
