import React from 'react';
import QRCode from 'react-qr-code';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';

interface PrintableQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  title?: string;
  subtitle?: string;
}

export function PrintableQRModal({ isOpen, onClose, code, title = "QR Code", subtitle }: PrintableQRModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    const printIframe = document.createElement('iframe');
    printIframe.style.position = 'absolute';
    printIframe.style.top = '-1000px';
    printIframe.style.left = '-1000px';
    document.body.appendChild(printIframe);

    const container = document.getElementById('qr-svg-wrapper');
    const contentWindow = printIframe.contentWindow;
    
    if (contentWindow && container) {
      const svgContent = container.innerHTML;
      contentWindow.document.write(`
        <html>
          <head>
            <title>${title}</title>
            <style>
               body { 
                 display: flex; 
                 flex-direction: column; 
                 align-items: center; 
                 justify-content: center; 
                 height: 100vh; 
                 font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; 
                 margin: 0;
               }
               .qr-wrapper { 
                 padding: 24px; 
                 background: #fff;
                 border: 2px solid #f3f4f6; 
                 border-radius: 24px; 
                 margin-bottom: 24px; 
               }
               .code { 
                 padding: 8px 16px; 
                 background: #f9fafb; 
                 border-radius: 8px; 
                 font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; 
                 font-size: 16px; 
                 color: #4b5563; 
                 font-weight: 500;
               }
               h3 { 
                 font-size: 24px; 
                 color: #1f2937; 
                 margin-bottom: 8px; 
                 margin-top: 0; 
               }
               p.subtitle { 
                 color: #6b7280; 
                 font-size: 14px; 
                 margin-top: 0;
                 margin-bottom: 32px; 
               }
            </style>
          </head>
          <body>
            <h3>${title}</h3>
            ${subtitle ? `<p class="subtitle">${subtitle}</p>` : ''}
            <div class="qr-wrapper">
              ${svgContent}
            </div>
            <span class="code">${code}</span>
          </body>
        </html>
      `);
      contentWindow.document.close();
      contentWindow.focus();
      
      // Allow minimal time for browser to parse SVG, then execute print dialog in iframe
      setTimeout(() => {
        contentWindow.print();
        setTimeout(() => {
          document.body.removeChild(printIframe);
        }, 2000);
      }, 250);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className="p-6 relative">
 
        
        <div className="flex flex-col items-center justify-center p-8 bg-white border border-gray-100 rounded-xl shadow-sm">
          <h3 className="text-xl font-bold text-gray-800 mb-1">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500 mb-6 text-center">{subtitle}</p>}
          
          <div id="qr-svg-wrapper" className="p-4 bg-white border-2 border-gray-100 rounded-2xl shadow-sm">
            <QRCode value={code || '-'} size={220} />
          </div>
          
          <p className="mt-6 text-sm font-mono font-medium text-gray-600 bg-gray-50 px-4 py-2 rounded-md">{code || '-'}</p>
        </div>

        <div className="flex justify-center gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={handlePrint} className="flex items-center gap-2">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Cetak / Simpan PDF
          </Button>
        </div>
      </div>
    </Modal>
  );
}
