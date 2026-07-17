import React from 'react';
import { Toaster, toast } from 'sonner';

/**
 * ToastProvider wraps the Sonner Toaster with our application's design system tokens.
 * This should be injected at the root of the React application.
 */
export function ToastProvider() {
  return (
    <Toaster 
      position="top-center" 
      richColors
      toastOptions={{
        className: 'font-sans',
        style: {
          boxShadow: 'var(--tw-shadow-sm)',
        }
      }}
    />
  );
}
