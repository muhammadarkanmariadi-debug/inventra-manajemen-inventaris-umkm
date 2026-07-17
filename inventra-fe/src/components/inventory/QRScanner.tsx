import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';

interface QRScannerProps {
  onScan: (code: string) => void;
}

export default function QRScanner({ onScan }: QRScannerProps) {
  const [isEnabled, setIsEnabled] = useState(false);

  if (!isEnabled) {
    return (
      <div 
        className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center cursor-pointer border border-dashed border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition transition-colors"
        onClick={() => setIsEnabled(true)}
      >
        <div className="text-center">
          <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-gray-500 text-sm font-medium">Click to Start Scanner</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
      <Scanner
        onScan={(result) => {
          if (result && result.length > 0) {
            onScan(result[0].rawValue);
            setIsEnabled(false);
          }
        }}
      />
      <button 
        className="w-full py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        onClick={() => setIsEnabled(false)}
      >
        Cancel
      </button>
    </div>
  );
}
